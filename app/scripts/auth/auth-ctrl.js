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

    .controller('LogoutCtrl', ['AuthSharedService', '$scope',
        function (AuthSharedService, $scope) {
            AuthSharedService.logout().then(function (){
                $scope.showLogoutPage = true;
            });
        }])
;

