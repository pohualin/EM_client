'use strict';

angular.module('emmiManager')
    .controller('LoginCtrl', ['$scope', '$location', 'AuthSharedService', '$rootScope',
        function ($scope, $location, AuthSharedService, $rootScope) {
            $scope.credentials = {
                rememberMe: true
            };

            $rootScope.authenticationError = false;

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

