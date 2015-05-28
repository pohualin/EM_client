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
                    content: 'Please correct the below information.',
                    container: '#validation-container',
                    type: 'danger',
                    placement: '',
                    duration: false,
                    dismissable: false
                });
            } else {
                $scope.errorAlert.show();
            }
        };
    })

;
