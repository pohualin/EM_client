'use strict';

angular.module('emmiManager')

/**
 *  Edit a single client
 */
    .controller('ClientDetailCtrl', function ($scope, Client, $controller, Location, clientResource, Tag, $q, focus, $window) {

        $controller('ViewEditCommon', {$scope: $scope});

        if (clientResource) {
            $scope.client = clientResource.entity; //for the view state
            Client.setClient(clientResource);
        } else {
            Client.viewClientList();
        }

        function setTitle(){
            $scope.page.setTitle('Client ' + Client.getClient().entity.id + ' - ' + Client.getClient().entity.name);
        }

        setTitle();

        $scope.cancel = function () {
            $scope.hideError();
            $scope.editMode = false;
            $scope.metadataSubmitted = false;
            delete $scope.clientToEdit;
        };

        $scope.edit = function () {
            $scope.editMode = true;
            $scope.clientToEdit = angular.copy($scope.client);
            $scope.clientToEdit.origSalesForceAccount = $scope.clientToEdit.salesForceAccount.accountNumber;
            focus('clientName');
        };

        $scope.save = function (isValid) {
            $scope.metadataSubmitted = true;
            if (isValid && $scope.clientToEdit.salesForceAccount) {
                Client.updateClient($scope.clientToEdit).then(function () {
                    $scope.editMode = false;
                    setTitle();
                });
            } else {
                $scope.showError();
                // Loop through the form's validation errors and log to Piwik
                var formErrors = $scope.metadataForm.$error;
                for (var errorType in formErrors) {
                    if (formErrors.hasOwnProperty(errorType)) {
                        for (var i = 0; i < formErrors[errorType].length; i++) {
                            $window._paq.push(['trackEvent', 'Validation Error', 'Client Edit', formErrors[errorType][i].$name+' '+errorType]);
                        }
                    }
                }
            }
        };

    })
;
