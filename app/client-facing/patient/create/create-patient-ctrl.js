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
                        $alert({
                            title: ' ',
                            content: 'The patient <b>'+ response.data.entity.firstName + ' ' + response.data.entity.lastName +'</b> has been successfully added.',
                            container: '#modal-messages-container',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
                        $scope.clearForm();
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

            $scope.clearForm = function (){
                $scope.formSubmitted = false;
                $scope.patient = {};
            };
        }
    ])
;
