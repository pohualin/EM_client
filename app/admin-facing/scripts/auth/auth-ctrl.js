'use strict';

angular.module('emmiManager')
    .controller('LoginCtrl', ['$scope', '$location', 'AuthSharedService', '$rootScope','LoginErrorMessageFactory',
        function ($scope, $location, AuthSharedService, $rootScope,LoginErrorMessageFactory) {
        
            $scope.credentials = {
                rememberMe: true,
                username: $rootScope.username
            };

            $rootScope.authenticationError = false;
            $scope.loginErrorMessageFactory = LoginErrorMessageFactory;

            /**
             * Called when login button is clicked
             *
             * @param credentials to authenticate
             */
            $scope.login = function (credentials) {
                $scope.loginForm.submitted = true;
                if ($scope.loginForm.$valid) {
                    AuthSharedService.login(credentials);
                }
            };
        }])

    .controller('LogoutCtrl', ['AuthSharedService', '$scope', 'API', '$sce',
        function (AuthSharedService, $scope, API, $sce) {

            // necessary for logout on the authentication server (e.g CAS)
            $scope.showAuthenticationServerResponse = false;
            $scope.authenticationServerUrl = $sce.trustAsResourceUrl(API.redirectOnLogout);

            AuthSharedService.logout().then(function (){
                $scope.showLogoutPage = true;
            });
        }])
;

