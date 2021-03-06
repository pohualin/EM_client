'use strict';

angular.module('emmiManager')
    .controller('LoginCtrl', ['$scope', '$location', 'AuthSharedService', '$rootScope','LoginErrorMessageFactory',
        function ($scope, $location, AuthSharedService, $rootScope, LoginErrorMessageFactory) {

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
                LoginErrorMessageFactory.reset();
                if ($scope.loginForm.$valid) {
                    $scope.whenSaving = true;
                    AuthSharedService.login(credentials).finally(function () {
                        $scope.whenSaving = false;
                    });
                }
            };

            /**
             * When cancel is clicked on the form go back to home
             */
            $scope.cancel = function (){
                LoginErrorMessageFactory.reset();
                $location.path('/');
            };
        }])

    .controller('LogoutCtrl', ['AuthSharedService', '$scope', 'API', '$sce', '$window',
        function (AuthSharedService, $scope, API, $sce, $window) {

            // necessary for logout on the authentication server (e.g CAS)
            $scope.showAuthenticationServerResponse = false;
            $scope.authenticationServerUrl = $sce.trustAsResourceUrl(API.casServerLogoutUrl);

            AuthSharedService.logout().then(function (){
                if (API.redirectAfterLogoutUrl) {
                    $window.location.href = API.redirectAfterLogoutUrl;
                } else {
                    $scope.showLogoutPage = true;
                }
            });
        }])
;

