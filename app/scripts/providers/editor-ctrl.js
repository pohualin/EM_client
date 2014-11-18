'use strict';

angular.module('emmiManager').controller(
    'ProviderEditorController',
    function($scope, $location, $alert, Client, $controller, providerResource, Tag, $q,
        focus, ProviderService) {

        $scope.cancel = function() {
            $scope.hideError();
            $scope.editMode = false;
            $scope.metadataSubmitted = false;
            delete $scope.providerToEdit;
        };
        
        $scope.doNotDeactivateProvider = function(){
            $scope.providerToEdit.active = true;
        };

        $scope.edit = function() {
            $scope.editMode = true;
            $scope.providerToEdit = angular.copy($scope.provider);
            focus('providerFirstName');
        };

        $scope.saveProvider = function(isValid) {
            $scope.providerFormSubmitted = true;
            if (isValid) {
                ProviderService.updateProvider($scope.providerToEdit).then(function(response) {
                    angular.copy(response.data, $scope.providerResource);
                    angular.copy(response.data.entity, $scope.provider);
                    $scope.cancel();
                });
            } else {
                if (!$scope.providerErrorAlert) {
                    $scope.providerErrorAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#message-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                }
            }
        };

        function init() {
            $controller('ViewEditCommon', {
                $scope: $scope
            });

            if (providerResource) {
                ProviderService.specialtyRefData(providerResource).then(function(response) {
                    $scope.specialties = response;
                });
                $scope.providerResource = providerResource;
                $scope.provider = providerResource.entity; // for the view state
            } else {
                $location.path('/providers');
            }
        }

        init();
    });
