'use strict';

angular.module('emmiManager')

    .controller('TeamErrorController', function ($scope, $alert) {
        $scope.hideError = function () {
            if ($scope.errorAlert) {
                $scope.errorAlert.hide();
            }
        };
        $scope.showError = function(){
            if (!$scope.errorAlert) {
                $scope.errorAlert = $alert({
                    title: ' ',
                    content: 'Please correct the below information.',
                    container: '#alerts-container',
                    type: 'danger',
                    show: true,
                    dismissable: false
                });
            }
        };
    })

;
