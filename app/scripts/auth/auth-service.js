'use strict';

angular.module('emmiManager')
    .factory('AuthSharedService', function ($rootScope, $http, authService, Session, API, $q) {

        return {
            login: function (creds, loginLink) {
                var self = this;
                var data = 'j_username=' + creds.username + '&j_password=' + creds.password + '&remember-me=' + creds.rememberMe + '&submit=Login';
                $http.post(loginLink, data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    ignoreAuthModule: 'ignoreAuthModule'
                }).success(function () {
                    self.currentUser().then(function (currentUser) {
                        authService.loginConfirmed(currentUser);
                    });
                }).error(function () {
                    $rootScope.authenticationError = true;
                    Session.destroy();
                });
            },
            currentUser: function () {
                var deferred = $q.defer();
                if (!Session.login) {
                    $http.get(API.authenticated, {
                        ignoreAuthModule: 'ignoreAuthModule'
                    }).success(function (user) {
                        $rootScope.account = Session.create(user.login, user.firstName, user.lastName, user.email, user.permission, user.link);
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
                            $rootScope.$broadcast('event:auth-loginRequired');
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
            logout: function (logoutLink) {
                var self = this;
                $http.get(logoutLink)
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
            }

        };

    })
;
