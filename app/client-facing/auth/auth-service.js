'use strict';

angular.module('emmiManager')
    .factory('AuthSharedService', ['$rootScope', '$http', 'authService', 'Session', 'API', '$q', '$location', 'arrays',
        function ($rootScope, $http, authService, Session, API, $q, $location, arrays) {

            return {
                login: function (creds) {
                    var self = this;
                    $http.post(API.authenticate, {
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
                        self.currentUser().then(function (currentUser) {
                            authService.loginConfirmed(currentUser);
                        });
                    }).error(function (error) {
                        self.processLoginFailureError(error);
                        Session.destroy();
                    });
                },
                currentUser: function () {
                    var deferred = $q.defer();
                    if (!Session.login) {
                        $http.get(API.authenticated, {
                            ignoreAuthModule: 'ignoreAuthModule'
                        }).success(function (user) {
                            $rootScope.account = Session.create(user);
                            $rootScope.authenticated = true;
                            deferred.resolve($rootScope.account);
                        }).error(function () {
                            deferred.resolve({notLoggedIn: true});
                            $rootScope.authenticated = false;
                        });
                    } else {
                        $rootScope.authenticated = !!Session.login;
                        $rootScope.account = Session;
                        deferred.resolve(Session);
                    }

                    return deferred.promise;
                },
                authorizedRoute: function (authorizedRoles) {
                    var self = this;
                    self.currentUser().then(function (user) {
                        if (!self.isAuthorized(authorizedRoles)) {
                            if (user === null || user.notLoggedIn) {
                                // user needs to login
                                $rootScope.$broadcast('event:auth-loginRequired', {location: angular.copy($location)});
                            } else {
                                // user is not allowed
                                $rootScope.$broadcast('event:auth-notAuthorized');
                            }
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

                        var authorized = (!!Session.login &&
                        Session.userRoles.indexOf(authorizedRole) !== -1);

                        if (authorized || authorizedRole === '*') {
                            isAuthorized = true;
                        }
                    });

                    return isAuthorized;
                },
                logout: function () {
                    var self = this;
                    return $http.get(API.logout)
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
                    authService.loginCancelled();
                },
                processLoginFailureError: function(error){
                    window.paul = error;
                    $rootScope.authenticationError = false;
                    $rootScope.infiniteLock = false;
                    $rootScope.temporaryLock = false;
                    if (angular.isObject(error)){
                        if(error.entity.reason === 'BAD_CREDENTIAL' && error.entity.userClient.accountNonLocked){
                            $rootScope.authenticationError = true;
                        } else if (error.entity.reason === 'LOCK' || (error.entity.reason === 'BAD_CREDENTIAL' && !error.entity.userClient.accountNonLocked)) {
                            if (error.entity.clientPasswordConfiguration.lockoutReset === 0){
                                $rootScope.infiniteLock = true;
                            } else {
                                $rootScope.temporaryLock = true;
                                $rootScope.lockExpirationDateTime = error.entity.userClient.lockExpirationDateTime;
                            }
                        } else {
                            error.link = arrays.convertToObject('rel', 'href', error.link);
                            $rootScope.$broadcast('event:auth-credentialsExpired', {
                                credentials: creds,
                                client: error
                            });
                        }
                    } else {
                        $rootScope.authenticationError = true;
                    }
                }

            };

        }])
;
