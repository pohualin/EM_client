'use strict';

angular.module('emmiManager')
    .controller('CreatePatientController', ['client', '$scope', 'CreatePatientService', '$alert', '$location',
        function (client, $scope, CreatePatientService, $alert, $location) {

            var today = new Date();
            $scope.minDate = new Date().setFullYear(today.getFullYear() - 125);

            CreatePatientService.refData().then(function (response) {
                $scope.genders = response;
            });

            $scope.save = function (valid) {
                $scope.formSubmitted = true;
                if (valid) {
                    CreatePatientService.save(client, $scope.patient).then(function (response) {
                        $location.path('/patients/' + response.data.entity.id).replace();
                    });
                } else {
                    $scope.showError();
                }
            };

            $scope.showError = function () {
                if (!$scope.errorAlert) {
                    $scope.errorAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#alerts-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                } else {
                    $scope.errorAlert.show();
                }
            };

            $scope.cancel = function () {
                $location.path('/patients/').replace();
            };
        }
    ])
;
