'use strict';

/* Services */

var emAuthServices = angular.module('emAuthServices', ['http-auth-interceptor', 'emSessionServices']);

emAuthServices.factory('AuthSharedService', function ($rootScope, $http, authService, Session) {

    return {
        login: function (creds) {
            // Make http or oAuth request here
            if (creds.username === 'evan' && creds.password === 'emmi') {
                Session.create('1234567890', 'evan', '1', 'ROLE_ADMIN');
                $rootScope.currentUser = Session;
                authService.loginConfirmed();
            } else {
                $rootScope.authenticationError = true;
                $rootScope.authenticated = false;
                Session.destroy();
            }
        },
        valid: function (authorizedRoles) {
            $rootScope.currentUser = Session;
            if (!$rootScope.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                // user is not allowed
                $rootScope.$broadcast('event:auth-notAuthorized');
            }
            //$rootScope.authenticated = !!Session.login;
        },
        isAuthenticated: function () {
          return !!Session.userId;
        },
        isAuthorized: function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                if (authorizedRoles === '*') {
                    return true;
                }
                authorizedRoles = [authorizedRoles];
            }

            var isAuthorized = false;
            angular.forEach(authorizedRoles, function(authorizedRole) {
                var authorized = (!!Session.login &&
                    Session.userRoles.indexOf(authorizedRole) !== -1);

                if (authorized || authorizedRole === '*') {
                    isAuthorized = true;
                }
            });

            return isAuthorized;
        },
        logout: function () {
            $rootScope.authenticated = false;
            $rootScope.currentUser = null;
            //$http.get('app/logout');
            Session.destroy();
            authService.loginCancelled();
        }
    };

});
