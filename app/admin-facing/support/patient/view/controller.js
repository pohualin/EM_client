(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Search users across all clients
     */
        .controller('PatientSupportViewController', ['$scope', '$alert', 'patient',
            'PatientSupportViewService', 'moment', '$modal', '$filter',
            function ($scope, $alert, patientResource, PatientSupportViewService, moment, $modal, $filter) {

                $scope.minDate = moment().subtract(125, 'years').calendar();

                $scope.save = function (form) {
                    $scope.formSubmitted = true;
                    if (form.$valid) {
                        $scope.saving = true;
                        PatientSupportViewService.save($scope.patientResource).then(
                            function ok(updatedPatientResource) {
                                $scope.master = updatedPatientResource;
                                $scope.cancel(form);
                                $alert({
                                    content: [
                                        'Patient <strong>',
                                        updatedPatientResource.entity.firstName,
                                        updatedPatientResource.entity.lastName,
                                        '</strong> has been successfully updated.'
                                    ].join(' ')
                                });
                            }).finally(
                            function () {
                                $scope.saving = false;
                            }
                        );
                    } else {
                        $scope.showError();
                    }
                };

                var salesforceCaseModal = $modal({
                    scope: $scope,
                    template: 'admin-facing/support/patient/view/salesforce_modal.html',
                    animation: 'none',
                    backdropAnimation: 'emmi-fade',
                    show: false,
                    backdrop: 'static'
                });

                var closeSalesForceModel = function (newId) {
                    salesforceCaseModal.$promise.then(salesforceCaseModal.hide);
                    if (newId) {
                        $alert({
                            content: ['Salesforce case <strong>',
                                newId, '</strong> has been successfully created.'].join('')
                        });
                    }
                };

                $scope.startSalesforceCase = function () {
                    $scope.caseForResource = $scope.patientResource;
                    $scope.onSaveSuccess = closeSalesForceModel;
                    $scope.onCancel = closeSalesForceModel;
                    var patient = $scope.patientResource.entity;
                    $scope.defaultCaseDescription = [
                        'Patient Information:', '\n',
                        '\t* Name: ', patient.firstName, ' ', patient.lastName, '\n',
                        '\t* DOB: ', $filter('date')(patient.dateOfBirth, 'MM/dd/yyyy')
                    ];
                    // add phone number when present
                    if (patient.phone) {
                        $scope.defaultCaseDescription.push(
                            '\n', '\t* Phone: ', patient.phone
                        );
                    }
                    // add email when present
                    if (patient.email) {
                        $scope.defaultCaseDescription.push(
                            '\n', '\t* Email: ', patient.email
                        );
                    }
                    // add access codes when present
                    if ($scope.scheduledPrograms && $scope.scheduledPrograms.length > 0) {
                        var accessCodes = [];
                        angular.forEach($scope.scheduledPrograms, function (scheduledProgram) {
                            accessCodes.push(scheduledProgram.entity.accessCode);
                        });
                        $scope.defaultCaseDescription.push(
                            '\n', '\t* Access Codes: ', accessCodes.join(', ')
                        );
                    }
                    $scope.defaultCaseDescription.push('\n');
                    $scope.defaultCaseDescription = $scope.defaultCaseDescription.join('');
                    salesforceCaseModal.$promise.then(salesforceCaseModal.show);
                };

                $scope.cancel = function (form) {
                    $scope.formSubmitted = false;
                    $scope.patientResource = angular.copy($scope.master);
                    if (form) {
                        form.$setPristine();
                    }
                };

                $scope.isPatientChanged = function () {
                    return !angular.equals($scope.master, $scope.patientResource);
                };

                $scope.showError = function () {
                    if (!$scope.errorAlert) {
                        $scope.errorAlert = $alert({
                            title: ' ',
                            content: 'Please correct the below information.',
                            container: '#alerts-container',
                            type: 'danger',
                            show: true,
                            duration: false,
                            dismissable: false
                        });
                    } else {
                        $scope.errorAlert.show();
                    }
                };

                (function init() {
                    $scope.master = patientResource;
                    $scope.patientResource = angular.copy(patientResource);
                    $scope.page.setTitle('Patient - ' +
                        patientResource.entity.firstName + ' ' +
                        patientResource.entity.lastName + ' | ClientManager');

                    // load reference data for the screen
                    PatientSupportViewService.loadReferenceData(patientResource).then(function (referenceData) {
                        $scope.optOutPreferences = referenceData.optOutPreference;
                    });

                    PatientSupportViewService.loadScheduledPrograms(patientResource).then(function (scheduledPrograms) {
                        $scope.scheduledProgramsLoaded = true;
                        $scope.scheduledPrograms = scheduledPrograms;
                    });
                    $scope.cancel();
                })();


            }]);

})(window.angular);
