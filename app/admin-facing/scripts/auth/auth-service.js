'use strict';

angular.module('emmiManager')
    .factory('AuthSharedService', ['$rootScope', '$http', 'authService', 'Session', 'API', '$q', '$location', '$window',
        function ($rootScope, $http, authService, Session, API, $q, $location, $window) {
            var makingCurrentUserCall = false, currentUserCallQueue = [];

            return {
                /**
                 * This is the form login method
                 *
                 * @param creds the credentials
                 */
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
                        self.currentUser().then(function (currentUser) {
                            authService.loginConfirmed(currentUser);
                        });
                    }).error(function (response) {
                        if (angular.isObject(response)) {
                            if (response.entity.reason === 'XSRF_MISSING') {
                                $rootScope.$broadcast('event:auth-xsrf-token-missing');
                            }
                        } else {
                            $rootScope.authenticationError = true;
                        }
                        Session.destroy();
                    });
                },

                /**
                 * Retrieves the current user from the backend
                 * and caches it. This method will only allow
                 * one call to the backend to happen at a time.
                 *
                 * @returns {*}
                 */
                currentUser: function () {
                    var deferred = $q.defer();
                    var me = this;
                    if (makingCurrentUserCall) {
                        currentUserCallQueue.push(deferred);
                    } else {
                        me._requestUser(deferred, me);
                    }
                    return deferred.promise;
                },

                /**
                 * 'Private' method that actually calls the backend.
                 * This method will clear out the backlog of current
                 * user calls by recursively calling itself when the
                 * first response comes back. Note that if the first
                 * response does not find an authenticated person
                 * subsequent calls are not made. This is because the
                 * user needs to login anyways so why make unncessary
                 * calls.
                 *
                 * @private
                 * @param deferred to resolve upon completion
                 * @param me this class, to allow for recursion
                 */
                _requestUser: function (deferred, me) {
                    if (!Session.login) {
                        makingCurrentUserCall = true;
                        $http.get(API.authenticated, {
                            ignoreAuthModule: 'ignoreAuthModule'
                        }).success(function (user) {
                            $rootScope.account = Session.create(user);
                            $rootScope.authenticated = true;
                            deferred.resolve($rootScope.account);
                            $rootScope.$broadcast('event:auth-loginConfirmed');
                        }).error(function (data) {
                            $rootScope.authenticated = false;
                            if (data.url) {
                                $window.location.href = data.url;
                            } else {
                                $rootScope.$broadcast('event:auth-loginRequired', {location: angular.copy($location)});
                                deferred.resolve(data);
                            }
                        }).finally(function () {
                            makingCurrentUserCall = false;
                            var nextCall = currentUserCallQueue.shift();
                            if (nextCall && $rootScope.authenticated) {
                                me._requestUser(nextCall, me);
                            }
                        });
                    } else {
                        deferred.resolve($rootScope.account);
                        var nextCall = currentUserCallQueue.shift();
                        if (nextCall) {
                            me._requestUser(nextCall, me);
                        }
                    }
                },

                /**
                 * Ensures that the current user has one of the
                 * authorized roles. If not the event:auth-notAuthorized
                 * event is broadcast to root scope
                 *
                 * @param authorizedRoles to ensure that the user has one
                 */
                authorizedRoute: function (authorizedRoles) {
                    var self = this;
                    self.currentUser().then(function (user) {
                        if (!self.isAuthorized(authorizedRoles)) {
                            if (user === null || user.url) {
                                if (user.url) {
                                    $window.location.href = user.url;
                                } else {
                                    // user needs to go to login form
                                    $rootScope.$broadcast('event:auth-loginRequired', {location: angular.copy($location)});
                                }
                            } else {
                                // user is not allowed
                                $rootScope.$broadcast('event:auth-notAuthorized');
                            }
                        }
                    });
                },

                /**
                 * Method that Looks over the logged in user's roles
                 *
                 *
                 * @param authorizedRoles that are necessary
                 * @returns {boolean} true if user has role, false if none match
                 */
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

                /**
                 * Public logout method. Calls the
                 * logout link
                 */
                logout: function () {
                    var deferred = $q.defer();
                    var self = this;
                    if ($rootScope.authenticated) {
                        $http.post(API.logout, {});
                        self._localLogout();
                        deferred.resolve('ok');
                    } else {
                        deferred.resolve('ok');
                    }
                    return deferred.promise;
                },

                /**
                 * Handles cleanup of the javascript session and
                 * user variables
                 *
                 * @private
                 */
                _localLogout: function () {
                    $rootScope.authenticated = false;
                    $rootScope.account = null;
                    Session.destroy();
                    authService.loginCancelled();
                }

            };

        }])
;
