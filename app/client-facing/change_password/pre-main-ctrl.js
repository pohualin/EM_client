'use strict';

angular.module('emmiManager')

/**
 *
 */
.controller('PreChangePasswordController', ['$scope', '$location', '$alert', 'ChangePasswordService',
    function ($scope, $location, $alert, ChangePasswordService) {
        $scope.allowAnotherPasswordChange = function(){
            ChangePasswordService.loadPolicy($scope.account.clientResource).then(function (response){
                $scope.policy = response.data;
                if(ChangePasswordService.eligibleToChange($scope.policy, $scope.account)){
                    $location.path('/change_password').replace();
                } else {
                    if (!$scope.passwordAlert  && $scope.policy.daysBetweenPasswordChange > 1) {
                        $scope.passwordAlert = $alert({
                            content: 'A minimum of ' + $scope.policy.daysBetweenPasswordChange + ' days are required between password changes.',
                            type: 'warning',
                            placement: 'top',
                            duration: 5,
                            show: true,
                            dismissable: true
                        });
                    } else if (!$scope.passwordAlert && $scope.policy.daysBetweenPasswordChange === 1) {
                        $scope.passwordAlert = $alert({
                            content: 'A minimum of one day is required between password changes.',
                            type: 'warning',
                            placement: 'top',
                            duration: 5,
                            show: true,
                            dismissable: true
                        });
                    } else {
                        $scope.passwordAlert.show();
                    }
                }
            });
        };
    }
]);
