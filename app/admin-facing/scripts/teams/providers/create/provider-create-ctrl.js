'use strict';
angular.module('emmiManager')

	.controller('ProviderCreateController', ['$scope', 'TeamProviderService', 'ProviderCreate',
        function ($scope, TeamProviderService, ProviderCreate) {

        $scope.provider = ProviderCreate.newProvider();
        $scope.selectedItems = TeamProviderService.buildMultiSelectData($scope.allTeamLocations);
        $scope.multiSelectData = TeamProviderService.buildMultiSelectData($scope.allTeamLocations);
        if ($scope.searchAll.providerQuery) {
            var strings = $scope.searchAll.providerQuery.split(',');
            if (strings.length > 1) {
                $scope.provider.firstName = strings[1].trim();
            }
            $scope.provider.lastName = strings[0].trim();
        }
        $scope.title = 'New Provider';

        $scope.saveAndAddAnotherProvider = function (isValid) {
            $scope.saveProvider(isValid, true);
        };

        $scope.saveProvider = function (isValid, addAnother) {
            $scope.providerFormSubmitted = true;
        	if (isValid && (($scope.allTeamLocations.length > 0 && $scope.selectedItems.length > 0) || $scope.allTeamLocations.length === 0)) {
                _paq.push(['trackEvent', 'Form Action', 'Team Provider Create', 'Save']);
                $scope.whenSaving = true;
                ProviderCreate.create($scope.provider, $scope.teamResource, $scope.selectedItems).then(function (response) {
                    var providerToAdd = {
                        provider: response.data.entity
                    };
                    var providersToAdd = [];
                    providersToAdd.push(providerToAdd);
	                ProviderCreate.associateTeamLocationsToProvider(providerToAdd.provider, $scope.teamResource, $scope.selectedItems);
                    $scope.$hide();
                    if (!addAnother) {
                        // refresh the parent scope providers in the background
                        $scope.refreshLocationsAndProviders();
                        $scope.successAlert(providersToAdd, '#messages-container');
                    } else {
                        $scope.refreshLocationsAndProviders().then(function () {
                            $scope.addProviders(1).then(function () {
                                $scope.successAlert(providersToAdd, '#modal-messages-container');
                            });
                        });
                    }
                }).finally(function () {
                    $scope.whenSaving = false;
                });
	        } else{
                $scope.showError();
            }
        };
	}]);
