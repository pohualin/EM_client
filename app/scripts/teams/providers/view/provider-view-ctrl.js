'use strict';
angular.module('emmiManager')

	.controller('ProviderListController', function($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderSearch, $controller, arrays, ProviderCreate,  $alert){

		$controller('CommonPagination', {$scope: $scope});

        $scope.provider = ProviderCreate.newProvider();

        $scope.noSearch = true;

        $scope.teamProviderTeamLocationSaveRequest = [];

        $scope.locationsColumnCharLimit = 25;

        $scope.allLocationsForTeam = 'Default: All Locations';

        $scope.refreshLocationsAndProviders = function() {
        	ProviderView.paginatedProvidersForTeam($scope.teamResource).then(function(response){
        		$scope.handleResponse(response, 'listOfTeamProviders');
        	});
		};

		if($scope.teamResource){
			$scope.refreshLocationsAndProviders();
		}

		var editProviderModal = $modal({
            scope: $scope,
            template: 'partials/team/provider/edit.html',
            animation: 'none',
            backdropAnimation: 'emmi-fade',
            show: false,
            backdrop: 'static'
        });

		$scope.editProvider = function (teamProvider) {
            $scope.title = '';
			// create a copy for editing
			$scope.teamProviderToBeEdit = angular.copy(teamProvider);
			// save the original for overlay if save is clicked
			$scope.teamProvider = teamProvider;
			// get ClientProvider for external provider id and active status
			TeamProviderService.findClientProviderByClientIdAndProviderId($scope.teamProviderToBeEdit.link.findClientProviderByClientIdProviderId).then(function(response){
                $scope.originalClientProvider = response;
                $scope.clientProvider = angular.copy(response);

			});
			// get a list of team locations by team
			TeamLocation.getTeamLocations($scope.teamProvider.link.teamLocations).then(function(response){
                $scope.potentialLocations = response;
                $scope.multiSelectData = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
				// get a list of existing team locations by team provider

				TeamProviderService.getTeamLocationsByTeamProvider($scope.teamProviderToBeEdit.link.findTeamLocationsByTeamProvider).then(function(response){
					if(response.length > 0){
						$scope.selectedItems = TeamProviderService.buildSelectedItem(response);
					} else {
                        $scope.selectedItems = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
					}
					// show the dialog box
					editProviderModal.$promise.then(editProviderModal.show);
				});
			});
			_paq.push(['trackEvent', 'Form Action', 'Team Provider', 'Edit']);
		};

		// when a pagination link is used
        $scope.fetchPaginationLink = function (href) {
            $scope.loading = true;
            ProviderView.fetchPageLink(href).then(function (page) {
        		$scope.handleResponse(page, 'listOfTeamProviders');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.removeProvider = function (provider) {
        	ProviderView.removeProvider(provider, $scope.teamResource).then(function (){
                $scope.refreshLocationsAndProviders();
                $alert({
                    title: ' ',
                    content: 'The provider <b>' + provider.entity.provider.firstName + ' ' + provider.entity.provider.lastName + '</b> has been successfully removed.',
                    container: 'body',
                    type: 'success',
                    placement: 'top',
                    show: true,
                    duration: 5,
                    dismissable: true
                });
        	});
            _paq.push(['trackEvent', 'Form Action', 'Team Provider', 'Remove']);
        };

        $scope.addProviders = function () {
        	TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations).then(function(response){
                $scope.allTeamLocations = TeamProviderService.buildMultiSelectData(response);
                $scope.addProvidersModalOnScope = {};
                $scope.addProvidersModalOnScope = $modal({
                    scope: $scope,
                    template: 'partials/team/provider/search.html',
                    animation: 'none',
                    backdropAnimation: 'emmi-fade',
                    show: true,
                    backdrop: 'static'
                });
            });
        };

        $scope.hideaddprovidermodal = function () {
        	$scope.addProvidersModalOnScope.hide();
    		$scope.resetState();
        };

        ProviderSearch.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });

        $scope.cancel = function () {
        	$scope.hideaddprovidermodal();
        };

        $scope.createNewProvider = function () {
        	TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations).then(function(response){
                $scope.potentialLocations = response;
                $scope.selectedItems = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
                $scope.multiSelectData = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
                $scope.title = 'New Provider';
                $scope.hideaddprovidermodal();
                $scope.resetCreateNewProviderModalState();
                newProviderModal.$promise.then(newProviderModal.show);
            });
        };

        var newProviderModal = $modal({scope: $scope, template: 'partials/team/provider/new.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});

        $scope.hideNewProviderModal = function () {
        	newProviderModal.$promise.then(newProviderModal.hide);
        };

        $scope.resetCreateNewProviderModalState = function () {
			$scope.providerFormSubmitted = false;
            $scope.provider = {};
        };

        $scope.resetState = function () {
    		$scope.teamProviderTeamLocationSaveRequest = [];
    		$scope.searchedProvidersList = [];
            $scope.noSearch = true;
        	$scope.links = [];
        };

        $scope.saveAssociationAndAddAnotherProvider = function () {
        	$scope.associateSelectedProvidersToTeam(true);
        };

        $scope.associateSelectedProvidersToTeam = function (addAnother) {
        	if ($scope.teamProviderTeamLocationSaveRequest.length > 0) {

                angular.forEach($scope.teamProviderTeamLocationSaveRequest, function(req){
        			if (req.provider.selectedTeamLocations.length !== $scope.allTeamLocations.length) {
        				req.teamLocations = angular.copy(req.provider.selectedTeamLocations);
        			}
        		});

                ProviderSearch.updateProviderTeamAssociations($scope.teamProviderTeamLocationSaveRequest, $scope.teamResource).then(function (response) {
	        		$scope.refreshLocationsAndProviders();
	        		var message = $scope.teamProviderTeamLocationSaveRequest.length > 1 ? 'The selected providers have been successfully added.' : 'The provider <b>'+ $scope.teamProviderTeamLocationSaveRequest[0].provider.firstName + ' ' + $scope.teamProviderTeamLocationSaveRequest[0].provider.lastName +'</b> has been successfully added.';

                    $scope.hideaddprovidermodal();

	        		if (addAnother) {
        				$scope.addProviders();
	        		}
	        		$alert({
						title: ' ',
						content: message,
						container: 'body',
						type: 'success',
						placement: 'top',
					    show: true,
					    duration: 5,
					    dismissable: true
					});
	        	});
        	}
        };

        $scope.saveAndAddAnotherProvider = function (isValid) {
            $scope.saveProvider(isValid, true);
        };

        $scope.saveProvider = function (isValid, addAnother) {
            $scope.providerFormSubmitted = true;
            if (isValid && $scope.selectedItems.length > 0) {
	        	ProviderCreate.create($scope.provider, $scope.teamResource, $scope.selectedItems).then(function(response){
	                ProviderCreate.associateTeamLocationsToProvider(response.data.entity, $scope.teamResource, $scope.selectedItems);
	        		$scope.hideNewProviderModal();
	                $scope.refreshLocationsAndProviders();
                    if (addAnother) {
                        $scope.addProviders();
                    }
	                $alert({
						title: ' ',
						content: 'The provider <b>'+ response.data.entity.firstName + ' ' + response.data.entity.lastName +'</b> has been successfully added.',
						container: 'body',
						type: 'success',
						placement: 'top',
					    show: true,
					    duration: 5,
					    dismissable: true
					});
	        	});
                _paq.push(['trackEvent', 'Form Action', 'Team Provider Create', 'Save']);
	        }
        };

        if($scope.teamResource){
			ProviderView.specialtyRefData($scope.teamResource).then(function(response){
	        	$scope.specialties = response;
	        });
        }
        $scope.allProvidersForTeam = function() {
        	ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
        		$scope.handleResponse(response, 'listOfTeamProviders');
        	});
        };
	})
;
