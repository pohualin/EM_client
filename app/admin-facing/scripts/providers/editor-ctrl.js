'use strict';

angular.module('emmiManager').controller(
    'ProviderEditorController',
    function($scope, $location, $alert, Client, $controller, providerResource, Tag, $q,
        focus, ProviderService) {

        $scope.cancel = function(providerForm) {
            $scope.providerFormSubmitted = false;
            providerForm.$setPristine();
            $scope.edit();
            _paq.push(['trackEvent', 'Form Action', 'Provider Edit', 'Cancel']);
        };

        $scope.doNotDeactivateProvider = function(){
            $scope.providerToEdit.active = true;
        };

        $scope.edit = function() {
            $scope.editMode = true;
            $scope.providerToEdit = angular.copy($scope.provider);
            focus('providerFirstName');
            _paq.push(['trackEvent', 'Form Action', 'Provider Edit', 'Edit']);
        };

        $scope.saveProvider = function(providerForm) {
            var isValid = providerForm.$valid;
            $scope.providerFormSubmitted = true;
            if (isValid) {
                providerForm.$setPristine();
                ProviderService.updateProvider($scope.providerToEdit).then(function(response) {
                    angular.copy(response.data, $scope.providerResource);
                    angular.copy(response.data.entity, $scope.provider);
                    $scope.cancel(providerForm);
                });
                _paq.push(['trackEvent', 'Form Action', 'Provider Edit', 'Save']);
            }
        };

        $scope.showCancelSave = function(){
        	return !angular.equals($scope.provider, $scope.providerToEdit);
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
                $scope.edit();
            } else {
                $location.path('/providers');
            }
        }

        init();
    });
