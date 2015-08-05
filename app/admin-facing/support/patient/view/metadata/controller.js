(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Controls the meta-data form for the patient
     */
        .controller('PatientSupportViewMetadataController', ['$scope', '$alert', 'PatientSupportViewService', 'moment',
            'PatientSupportDataHolder',
            function ($scope, $alert, PatientSupportViewService, moment, holder) {

                $scope.master = holder.patient();

                // the minimum date for birthdates is 125 years ago
                $scope.minDate = moment().subtract(125, 'years').calendar();

                // load the opt out preference choices
                PatientSupportViewService.loadReferenceData(holder.patient()).then(function (referenceData) {
                    $scope.optOutPreferences = referenceData.optOutPreference;
                });

                /**
                 * Saves the form when valid, when not valid show an error alert
                 *
                 * @param form to save
                 */
                $scope.save = function (form) {
                    $scope.formSubmitted = true;
                    if (form.$valid) {
                        $scope.saving = true;
                        PatientSupportViewService.save($scope.patientResource).then(
                            function ok(updatedPatientResource) {
                                $scope.master = updatedPatientResource;
                                $scope.cancel();
                                $alert({
                                    content: [
                                        'Patient <strong>',
                                        updatedPatientResource.entity.firstName,
                                        updatedPatientResource.entity.lastName,
                                        '</strong> has been successfully updated.'
                                    ].join(' ')
                                });
                                // let anyone listening know about the update
                                $scope.$emit('patient-updated', updatedPatientResource);
                                _paq.push(['trackEvent', 'Form Action', 'Patient Support Edit', 'Save']);
                            }).finally(
                            function () {
                                $scope.saving = false;
                            }
                        );
                    } else {
                        $scope.showError();
                    }
                };

                /**
                 * Resets the scope to the pristine state
                 */
                $scope.cancel = function () {
                    $scope.formSubmitted = false;
                    $scope.patientResource = angular.copy($scope.master);
                    _paq.push(['trackEvent', 'Form Action', 'Patient Support Edit', 'Cancel']);
                };

                /**
                 * Determines if the patient in scope has changed.
                 *
                 * @param form set to dirty or pristine based upon the result
                 * @returns {boolean} true when changed
                 */
                $scope.isPatientChanged = function (form) {
                    var changed = !angular.equals($scope.master, $scope.patientResource);
                    if (changed) {
                        form.$setDirty();
                    } else {
                        form.$setPristine();
                    }
                    return changed;
                };

                /**
                 * Shows the form error message
                 */
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

                $scope.cancel();
            }]);

})(window.angular);
