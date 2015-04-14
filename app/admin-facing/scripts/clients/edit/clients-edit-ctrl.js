'use strict';

angular.module('emmiManager')

/**
 *  Edit a single client
 */
    .controller('ClientDetailCtrl', function ($scope, Client, $controller, Location, clientResource, Tag, $q, focus, ManageUserRolesService, ManageUserTeamRolesService) {

        $controller('ViewEditCommon', {$scope: $scope});

        if (clientResource) {
            $scope.client = clientResource.entity; //for the view state
            Client.setClient(clientResource);
            //need to have at this point if the client has roles in order to define the correct redirect for users links at the bottom page
            ManageUserRolesService.loadClientRoles(clientResource).then(function (rolesResources) {
                $scope.existingClientRoles = rolesResources;
            });

            ManageUserTeamRolesService.loadClientTeamRoles(clientResource).then(function (rolesResources) {
                $scope.existingClientTeamRoles = rolesResources;
            });

        } else {
            Client.viewClientList();
        }

        function setTitle(){
            $scope.page.setTitle('Client ' + Client.getClient().entity.id + ' - ' + Client.getClient().entity.name);
        }

        setTitle();

        $scope.clientEditCancel = function (metadataForm) {
            $scope.hideError();
            metadataForm.$setPristine();
            $scope.editMode = false;
            $scope.metadataSubmitted = false;
            delete $scope.clientToEdit;
            _paq.push(['trackEvent', 'Form Action', 'Client Edit', 'Cancel']);
        };

        $scope.clientEdit = function () {
            $scope.editMode = true;
            $scope.clientToEdit = angular.copy($scope.client);
            $scope.clientToEdit.origSalesForceAccount = $scope.clientToEdit.salesForceAccount.accountNumber;
            focus('clientName');
            _paq.push(['trackEvent', 'Form Action', 'Client Edit', 'Edit']);
        };

        $scope.clientSave = function (metadataForm) {
            var isValid = metadataForm.$valid;
            $scope.metadataSubmitted = true;
            if (isValid && $scope.clientToEdit.salesForceAccount) {
                metadataForm.$setPristine();
                Client.updateClient($scope.clientToEdit).then(function () {
                    $scope.editMode = false;
                    setTitle();
                });
                _paq.push(['trackEvent', 'Form Action', 'Client Edit', 'Save']);
            } else {
                $scope.showError();
                // Loop through the form's validation errors and log to Piwik
                var formErrors = metadataForm.$error;
                for (var errorType in formErrors) {
                    if (formErrors.hasOwnProperty(errorType)) {
                        for (var i = 0; i < formErrors[errorType].length; i++) {
                            _paq.push(['trackEvent', 'Validation Error', 'Client Edit', formErrors[errorType][i].$name+' '+errorType]);
                        }
                    }
                }
            }
        };

    })
;
