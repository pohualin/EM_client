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
                    if (newId) {
                        $alert({
                            content: ['Salesforce case <strong>',
                                newId, '</strong> has been successfully created.'].join('')
                        });
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
                    var client = $scope.originalUserClient.entity;
                    $scope.defaultCaseDescription = [
                        'Client User Information:', '\n',
                        '\t* Login: ', client.login, '\n',
                        '\t* Name: ', client.firstName, ' ', client.lastName];
                    if (client.email) {
                        $scope.defaultCaseDescription.push(
                            '\n', '\t* Email: ', client.email
                        );
                    }
                    $scope.defaultCaseDescription.push('\n');
                    $scope.defaultCaseDescription = $scope.defaultCaseDescription.join('');
                    salesforceCaseModal.$promise.then(salesforceCaseModal.show);
                };
            }])
    ;
})(window.angular);
