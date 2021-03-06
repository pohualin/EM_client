'use strict';

angular.module('emmiManager')
    .factory('AuthSharedService', ['$rootScope', '$http', 'authService', 'Session', 'API', '$q', '$location', 'arrays','LoginErrorMessageFactory',
        function ($rootScope, $http, authService, Session, API, $q, $location, arrays, LoginErrorMessageFactory) {
            var makingCurrentUserCall = false, currentUserCallQueue = [];
            return {
                login: function (creds) {
                    var self = this;
                    return $http.post(API.authenticate, {
                        'j_username': creds.username,
                        'j_password': creds.password,
                        'remember-me': creds.rememberMe
                    }, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj) {
                                if (obj.hasOwnProperty(p)) {
                                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                                }
                            }
                            return str.join('&');
                        },
                        ignoreAuthModule: 'ignoreAuthModule'
                    }).success(function () {
                        self.valid('*').then(function (loggedIn) {
                            if (loggedIn) {
                            	$rootScope.authenticationError = false;
                                $rootScope.lockError = false;
                                $rootScope.lockExpirationDateTime = null;
                                $rootScope.username = null;
                                Session.password = creds.password;
                                authService.loginConfirmed(loggedIn);
                            }
                        });
                    }).error(function (error) {
                        self.processLoginFailureError(error, creds);
                        Session.destroy();
                    });
                },
                currentUser: function (deferred) {
                    var me = this;
                    deferred = deferred || $q.defer();
                    if (makingCurrentUserCall) {
                        currentUserCallQueue.push(deferred);
                    } else {
                        deferred.resolve($rootScope.account);
                        var nextCall = currentUserCallQueue.shift();
                        if (nextCall) {
                            me.currentUser(nextCall);
                        }
                    }
                    return deferred.promise;
                },
                valid: function (authorizedRoles) {
                    makingCurrentUserCall = true;
                    var me = this;
                    return $http.get(API.authenticated, {
                        ignoreAuthModule: 'ignoreAuthModule'
                    }).success(function (user) {
                        $rootScope.account = Session.create(user);

                        // set XSRF defaults based upon logged in user
                        $http.defaults.xsrfHeaderName = 'X-XSRF-TOKEN-' + (!Session.impersonated ? 'CLIENT' : 'IMP');
                        $http.defaults.xsrfCookieName = 'XSRF-TOKEN-' + (!Session.impersonated ? 'CLIENT' : 'IMP');

                        $rootScope.authenticated = true;
                        if (!$rootScope.isAuthorized(authorizedRoles)) {
                            $rootScope.$broadcast('event:auth-notAuthorized');
                        }
                        return $rootScope.account;
                    }).error(function (data, status) {
                        $rootScope.authenticated = false;
                        if (status === 403) {
                            $rootScope.$broadcast('event:auth-totallyNotAuthorized');
                        } else if (!$rootScope.isAuthorized(authorizedRoles)) {
                            $rootScope.$broadcast('event:auth-loginRequired', {location: angular.copy($location)});
                        }
                    }).finally(function () {
                        makingCurrentUserCall = false;
                        var nextCall = currentUserCallQueue.shift();
                        if (nextCall) {
                            me.currentUser(nextCall);
                        }
                    });
                },

                isAuthorized: function (authorizedRoles) {
                    if (!angular.isArray(authorizedRoles)) {
                        if (authorizedRoles === '*') {
                            return true;
                        }
                        authorizedRoles = [authorizedRoles];
                    }
                    var isAuthorized = false;
                    angular.forEach(authorizedRoles, function (authorizedRole) {

                        var authorized = (!!Session.login &&  Session.userRoles &&
                        Session.userRoles.indexOf(authorizedRole) !== -1);

                        if (authorized || authorizedRole === '*') {
                            isAuthorized = true;
                        }
                    });

                    return isAuthorized;
                },
                logout: function () {
                    var self = this;
                    return $http.post(API.logout,{})
                        .success(function () {
                            self.localLogout();
                        }).error(function () {
                            self.localLogout();
                        });

                },
                localLogout: function () {
                    $rootScope.authenticated = false;
                    $rootScope.account = null;
                    Session.destroy();

                    // set XSRF defaults
                    $http.defaults.xsrfHeaderName = 'X-XSRF-TOKEN-CLIENT';
                    $http.defaults.xsrfCookieName = 'XSRF-TOKEN-CLIENT';

                    authService.loginCancelled();
                },
                processLoginFailureError: function (error, creds) {
                    $rootScope.authenticationError = false;
                    $rootScope.lockError = false;
                    $rootScope.lockExpirationDateTime = null;
                    if (angular.isObject(error)) {
                        if (error.entity.reason === 'BAD') {
                            $rootScope.authenticationError = true;
                        } else if (error.entity.reason === 'LOCK') {
                            $rootScope.lockError = true;
                            if (error.entity.userClient.lockExpirationDateTime) {
                                $rootScope.lockExpirationDateTime = error.entity.userClient.lockExpirationDateTime + 'Z';
                            }
                        } else if (error.entity.reason === 'EXPIRED') {
                            error.clientResource.link = arrays.convertToObject('rel', 'href', error.clientResource.link);
                            $rootScope.$broadcast('event:auth-credentialsExpired', {
                                credentials: creds,
                                client: error.clientResource
                            });
                        } else if (error.entity.reason === 'EXPIRED_CANT_CHANGE'){
                            angular.extend(LoginErrorMessageFactory,{showTemporaryPasswordTokenExpired:true});
                        } else if (error.entity.reason === 'XSRF_MISSING') {
                            $rootScope.$broadcast('event:auth-xsrf-token-missing');
                        } else if (error.entity.reason === 'INVALID_IP_ADDRESS') {
                            $rootScope.$broadcast('event:auth-totallyNotAuthorized');
                        }
                    } else {
                        $rootScope.authenticationError = true;
                    }
                }

            };

        }])
;
