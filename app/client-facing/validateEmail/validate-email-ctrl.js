'use strict';

angular.module('emmiManager')
    .controller('validateEmail', ['$rootScope','$scope', 'ValidationService', '$alert', '$location',
        function ($rootScope, $scope, ValidationService, $alert, $location) {
            /**
             * Send an activation email to the user
             */
            $scope.sendActivationEmail = function () {
                ValidationService.sendValidationEmail($scope.account).then(function () {
                    $scope.goToProperURL();
                    //show confirmation banner
                    $alert({
                        content: 'Please check your email. A link has been sent to <strong>' + $scope.account.email +
                            '</strong> to finish setting up your account.',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                });
            };

            /**
             * not now functionality to delay having to validate email
             */
            $scope.notNow = function () {
                ValidationService.notNow();
                $scope.goToProperURL();
            };

            $scope.goToProperURL = function(){
                var priorRequestPath = $rootScope.locationBeforeLogin;
                if (priorRequestPath) {
                    //if user was trying to access a url
                    $location.path(priorRequestPath.path()).replace();
                } else {
                    //if user is just logging in
                    $location.path('/').replace();
                }
            };
        }])
;

