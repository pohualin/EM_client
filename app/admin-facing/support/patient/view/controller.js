(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Search users across all clients
     */
        .controller('PatientSupportViewController', ['$scope', '$alert', 'patient', 'PatientSupportViewService', 'moment',
            function ($scope, $alert, patientResource, PatientSupportViewService, moment) {

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
                    $scope.cancel();
                })();


            }]);

})(window.angular);
