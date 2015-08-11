'use strict';

angular.module('emmiManager')
    .controller('CreatePatientController', ['$scope', 'CreatePatientService', '$alert',
        '$location', 'ScheduledProgramFactory', '$q', 'moment',
        function ($scope, CreatePatientService, $alert, $location, ScheduledProgramFactory, $q, moment) {

            $scope.minDate = moment().subtract(125, 'years').calendar();

            /**
             * Loads reference data for genders dropdown for Patient
             */
            CreatePatientService.refData().then(function (response) {
                $scope.genders = response;
            });

            /**
             * Performs a save or update for Patient, sets the patient in the ScheduledProgramFactory upon save or update.
             * @param valid validity of the form
             * @returns {*}
             */
            $scope.saveOrUpdate = function (valid) {
                var deferred = $q.defer();
                $scope.formSubmitted = true;
                if (valid) {
                    $scope.whenSaving = true;
                    if ($scope.patient.id) {
                        CreatePatientService.update($scope.team, $scope.patient).then(function (response) {
                            $scope.patient = response.data.entity;
                            ScheduledProgramFactory.patient = response.data.entity;
                            deferred.resolve(ScheduledProgramFactory.patient);
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                    } else {
                        CreatePatientService.save($scope.team, $scope.patient).then(function (response) {
                            $alert({
                                content: 'The patient <b>' + response.data.entity.firstName + ' ' + response.data.entity.lastName + '</b> has been successfully added.'
                            });
                            $scope.editMode = false;
                            $scope.patient = response.data.entity;
                            ScheduledProgramFactory.patient = response.data.entity;
                            deferred.resolve(ScheduledProgramFactory.patient);
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                    }
                } else {
                    deferred.reject();
                    $scope.showError();
                }
                return deferred.promise;
            };

            /**
             * Error message alert if the form is submitted and is invalid
             */
            $scope.showError = function () {
                if (!$scope.errorAlert) {
                    $scope.errorAlert = $alert({
                        content: 'Please correct the below information.',
                        container: '#alerts-container',
                        type: 'danger',
                        show: true,
                        placement: '',
                        duration: false,
                        dismissable: false
                    });
                } else {
                    $scope.errorAlert.show();
                }
            };

            /**
             * On click of 'Finish Scheduling' button, kicks off the save of the patient.
             */
            $scope.$on('event:update-patient-and-programs', function () {
                $scope.saveOrUpdate($scope.newPatientForm.$valid).then(function () {
                    $scope.saveScheduledProgramForPatient();
                });
            });
        }
    ])
;
