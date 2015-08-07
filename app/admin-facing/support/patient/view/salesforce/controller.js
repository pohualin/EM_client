(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Controls the salesforce case window
     */
        .controller('PatientSupportViewSalesforceController', ['$scope', '$alert', '$modal', '$filter',
            'PatientSupportDataHolder',
            function ($scope, $alert, $modal, $filter, holder) {

                $scope.$on('scheduled-programs-loaded', function () {
                    $scope.scheduledProgramsLoaded = true;
                });

                // create the modal for showing later
                var salesforceCaseModal = $modal({
                    scope: $scope,
                    template: 'admin-facing/support/patient/view/salesforce/salesforce_modal.html',
                    animation: 'none',
                    backdropAnimation: 'emmi-fade',
                    show: false,
                    backdrop: 'static'
                });

                /**
                 * Closes the modal and pops an alert if a newId is present
                 *
                 * @param newId of the created case, optional
                 */
                var closeSalesForceModel = function (newId) {
                    salesforceCaseModal.$promise.then(salesforceCaseModal.hide);
                    if (newId) {
                        $alert({
                            content: ['Salesforce case <strong>',
                                newId, '</strong> has been successfully created.'].join('')
                        });
                        _paq.push(['trackEvent', 'Form Action', 'Patient Salesforce', 'Complete']);
                    } else {
                        _paq.push(['trackEvent', 'Form Action', 'Patient Salesforce', 'Cancel']);
                    }
                };

                /**
                 * Opens the modal and sets default information for the case.
                 */
                $scope.startSalesforceCase = function () {
                    $scope.caseForResource = holder.patient();
                    $scope.onSaveSuccess = closeSalesForceModel;
                    $scope.onCancel = closeSalesForceModel;
                    var patient = holder.patient().entity;
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
                    if (holder.scheduledPrograms() && holder.scheduledPrograms().length > 0) {
                        var accessCodes = [];
                        angular.forEach(holder.scheduledPrograms(), function (scheduledProgram) {
                            accessCodes.push(scheduledProgram.entity.accessCode);
                        });
                        $scope.defaultCaseDescription.push(
                            '\n', '\t* Access Codes: ', accessCodes.join(', ')
                        );
                    }
                    $scope.defaultCaseDescription.push('\n');
                    $scope.defaultCaseDescription = $scope.defaultCaseDescription.join('');
                    salesforceCaseModal.$promise.then(salesforceCaseModal.show);
                    _paq.push(['trackEvent', 'Form Action', 'Patient Salesforce', 'Start']);
                };
            }
        ])
    ;
})(window.angular);
