'use strict';

emmiManager.factory('AuthSharedService', function ($rootScope, $http, authService, Session) {

    return {
        login: function (creds, api) {
            // Make http or oAuth request here
//            var data ="j_username=" + creds.username +"&j_password=" + creds.password +"&_spring_security_remember_me=" + creds.rememberMe +"&submit=Login";
//            $http.post(api['authenticate-link'].href, data, {
//                headers: {
//                    "Content-Type": "application/x-www-form-urlencoded"
//                },
//                ignoreAuthModule: 'ignoreAuthModule'
//            }).success(function (data, status, headers, config) {
            $http.get(api['authenticated-link'].href).then(function (response) {
                var user = response.data.entity;
                user.roles = ['ROLE_ADMIN', 'ROLE_USER'];
                Session.create(user.login, user.firstName, user.lastName, user.email, user.roles);
                $rootScope.account = Session;
                authService.loginConfirmed(response.data);
            });
//            }).error(function (data, status, headers, config) {
//                $rootScope.authenticationError = true;
//                Session.invalidate();
//            });
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
