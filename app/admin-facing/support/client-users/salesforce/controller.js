(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Controls the salesforce case window
     */
        .controller('ClientUserSupportSalesforceController', ['$scope', '$alert', '$modal',
            function ($scope, $alert, $modal) {

                var salesforceCaseModal = $modal({
                    scope: $scope,
                    template: 'admin-facing/support/client-users/salesforce/salesforce_modal.html',
                    animation: 'none',
                    backdropAnimation: 'emmi-fade',
                    show: false,
                    backdrop: 'static'
                });

                var closeSalesForceModel = function (newId) {
                    salesforceCaseModal.$promise.then(salesforceCaseModal.hide);
                    $scope.resetModalSize();
                    if (newId) {
                        $alert({
                            content: ['Salesforce case <strong>',
                                newId, '</strong> has been successfully created.'].join('')
                        });
                        _paq.push(['trackEvent', 'Form Action', 'Client User Salesforce', 'Complete']);
                    } else {
                        _paq.push(['trackEvent', 'Form Action', 'Client User Salesforce', 'Cancel']);
                    }
                };

                $scope.startSalesforceCase = function () {
                    $scope.caseForResource = $scope.originalUserClient;
                    $scope.onSaveSuccess = closeSalesForceModel;
                    $scope.onCancel = closeSalesForceModel;
                    $scope.webName = [
                        $scope.originalUserClient.entity.firstName,
                        $scope.originalUserClient.entity.lastName
                    ].join(' ');
                    salesforceCaseModal.$promise.then(salesforceCaseModal.show);
                    _paq.push(['trackEvent', 'Form Action', 'Client User Salesforce', 'Start']);
                };


                // BOOLEAN for controlling ngClass on modal container.
                $scope.largeModal = false;

                // Function to be passed to the salesforce-form directive.
                $scope.toggleModalSize = function () {
                    $scope.largeModal = !$scope.largeModal;
                };

                $scope.resetModalSize = function () {
                    $scope.largeModal = false;
                };


            }])
    ;
})(window.angular);
