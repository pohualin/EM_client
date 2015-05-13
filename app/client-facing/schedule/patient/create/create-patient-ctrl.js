'use strict';

angular.module('emmiManager')
    .controller('CreatePatientController', ['$scope', 'CreatePatientService', '$alert', '$location', '$rootScope',
        function ($scope, CreatePatientService, $alert, $location, $rootScope) {

            var today = new Date();
            $scope.minDate = new Date().setFullYear(today.getFullYear() - 125);

            CreatePatientService.refData().then(function (response) {
                $scope.genders = response;
            });

            $scope.saveOrUpdate = function (valid) {
                console.log('in save or update');
                console.log($scope);
                $scope.formSubmitted = true;
                if (valid) {
                    if ($scope.patientResource) {
                        //update
                    } else {
                        CreatePatientService.save($scope.client, $scope.patient).then(function (response) {
                            $alert({
                                title: ' ',
                                content: 'The patient <b>' + response.data.entity.firstName + ' ' + response.data.entity.lastName + '</b> has been successfully added.',
                                container: '#modal-messages-container',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                            //$scope.editMode = false; //switch to a view mode html
                            $scope.editMode = false;
                            $scope.patientResource = response.data.entity;
                        });
                    }
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
                $location.path('/teams/' + $scope.team.entity.id +'/schedule/patients/').replace();
            };

            $scope.clearForm = function (){
                $scope.formSubmitted = false;
                $scope.patient = {};
            };

            $rootScope.$on('event:update-patient-and-programs', function(){
                $scope.saveOrUpdate($scope.newPatientForm.$valid);
            });
        }
    ])
;
