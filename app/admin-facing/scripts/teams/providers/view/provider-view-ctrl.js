'use strict';
angular.module('emmiManager')

	.controller('ProviderListController', ['$scope', '$modal', 'ProviderView', 'TeamLocation', 'TeamProviderService', 'ProviderSearch', '$controller', 'arrays', 'ProviderCreate', 'ClientProviderService', 'Client', '$alert', '$q', 'ClientTeamSchedulingConfigurationService',
        function ($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderSearch, $controller, arrays, ProviderCreate, ClientProviderService, Client, $alert, $q, ClientTeamSchedulingConfigurationService) {

		$controller('CommonPagination', {$scope: $scope});

        $scope.provider = ProviderCreate.newProvider();

        $scope.noSearch = true;
        $scope.searchAll = {};

        $scope.teamProviderTeamLocationSaveRequest = [];

        var searchedProvidersList ='searchedProvidersList';

        $scope.locationsColumnCharLimit = 25;

        $scope.allLocationsForTeam = 'All Locations';

        $scope.$on('event:teamLocationSavedWithProvider', function () {
        	$scope.refreshLocationsAndProviders();
        });

        $scope.refreshLocationsAndProviders = function () {
            // need to return the promise
            return ClientTeamSchedulingConfigurationService.getTeamSchedulingConfiguration($scope.teamResource).then(function (schedulingConfiguration) {
                $scope.schedulingConfiguration = schedulingConfiguration;
                if($scope.schedulingConfiguration.entity.useProvider){
                    $scope.teamProviders = {};
                    var promises = [];
                    promises.push(ProviderView.paginatedProvidersForTeam($scope.teamResource));
                    promises.push(TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations));
                    return $q.all(promises).then(function (response) {
                        angular.forEach(response[0].content, function (teamProvider) {
                            $scope.teamProviders[teamProvider.entity.provider.id] = angular.copy(teamProvider.entity.provider);
                        });
                        $scope.handleResponse(response[0], 'listOfTeamProviders');
                        $scope.allTeamLocations = TeamProviderService.buildMultiSelectData(response[1]);
                    });
                }
            });
		};

		if ($scope.teamResource) {
		    $scope.client = $scope.teamResource.entity.client;
			$scope.refreshLocationsAndProviders();
		}

		var editProviderModal = $modal({
            scope: $scope,
            template: 'admin-facing/partials/team/provider/edit.html',
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
			TeamProviderService.findClientProviderByClientIdAndProviderId($scope.teamProviderToBeEdit.link.findClientProviderByClientIdProviderId).then(function (response) {
                $scope.originalClientProvider = response;
                $scope.clientProvider = angular.copy(response);

			});
			// get a list of team locations by team
			TeamLocation.getTeamLocations($scope.teamProvider.link.teamLocations).then(function (response) {
                $scope.potentialLocations = response;
                $scope.multiSelectData = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
				// get a list of existing team locations by team provider

				TeamProviderService.getTeamLocationsByTeamProvider($scope.teamProviderToBeEdit.link.findTeamLocationsByTeamProvider).then(function (response) {
					if (response.length > 0) {
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
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ProviderView.fetchPageLink(href).then(function (page) {
        		$scope.handleResponse(page, 'listOfTeamProviders');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.removeProvider = function (provider) {
            $scope.whenSaving = true;
        	ProviderView.removeProvider(provider, $scope.teamResource).then(function () {
                $scope.refreshLocationsAndProviders();
                $alert({
                    content: 'The provider <b>' + provider.entity.provider.fullName + '</b> has been successfully removed.'
                });
            }).finally(function () {
                $scope.whenSaving = false;
            });
            _paq.push(['trackEvent', 'Form Action', 'Team Provider', 'Remove']);
        };

        $scope.addProviders = function () {
            if ($scope.providerErrorAlertForCreate) {
                $scope.providerErrorAlertForCreate.hide();
            }
            $scope.associateRequestSubmitted = false;
        	TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations).then(function (response) {
                $scope.allTeamLocations = TeamProviderService.buildMultiSelectData(response);
            });
       		$scope.addProvidersModalOnScope = {};
       		return ClientProviderService.findForClient(Client.getClient()).then(function (clientProviders) {
       			var providerTemplate = clientProviders.content && clientProviders.content.length > 0 ? 'admin-facing/partials/team/provider/search-with-client-provider-tabs.html'
                                                                                                     : 'admin-facing/partials/team/provider/search-without-client-provider-tabs.html';
       			$scope.addProvidersModalOnScope = $modal({
       				                              scope: $scope,
                    template: providerTemplate,
       				                              animation: 'none',
       				                              backdropAnimation: 'emmi-fade',
       				                              show: true,
       				                              backdrop: 'static'});
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

        $scope.createNewProvider = function (searchForm) {
        	TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations).then(function (response) {
                $scope.potentialLocations = response;
                $scope.selectedItems = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
                $scope.multiSelectData = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
                $scope.title = 'New Provider';
                $scope.hideaddprovidermodal();
                $scope.resetCreateNewProviderModalState();
                newProviderModal.$promise.then(newProviderModal.show);
                if (searchForm.providerQuery) {
                    var strings = searchForm.providerQuery.$modelValue.split(',');
                    if (strings.length > 1) {
                        $scope.provider.firstName = strings[1].trim();
                    }
                    $scope.provider.lastName = strings[0].trim();
                }
            });
        };

            var newProviderModal = $modal({
                scope: $scope,
                template: 'admin-facing/partials/team/provider/new.html',
                animation: 'none',
                backdropAnimation: 'emmi-fade',
                show: false,
                backdrop: 'static'
            });

        $scope.hideNewProviderModal = function () {
        	newProviderModal.$promise.then(newProviderModal.hide);
        };

        $scope.resetCreateNewProviderModalState = function () {
			$scope.providerFormSubmitted = false;
            $scope.provider = ProviderCreate.newProvider();
        };

        $scope.search = function (isValid) {
        	if (isValid) {
	            $scope.noSearch = false;
	        	ProviderSearch.search($scope.teamResource, $scope.searchAll.providerQuery, $scope.status).then( function (providerPage) {
	        		$scope.handleResponse(providerPage, 'searchedProvidersList');
	        	});
        	}
        };

        $scope.statusChange = function () {
            $scope.loading = true;
            ProviderSearch.search($scope.teamResource, $scope.searchAll.providerQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then( function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
        	}, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ProviderSearch.fetchPageLink(href).then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.changePageSize = function (pageSize) {
            $scope.loading = true;
            ProviderSearch.search($scope.teamResource, $scope.searchAll.providerQuery, $scope.status, $scope.sortProperty, pageSize).then( function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
        	}, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.sortProperty = {
            property: null,
            ascending: null,
            resetOnNextSet: false,
            setProperty: function (property) {
                if (this.property === property) {
                    if (!this.resetOnNextSet) {
                        if (this.ascending !== null) {
                            // this property has already been sorted on once
                            // the next click after this one should turn off the sort
                            this.resetOnNextSet = true;
                        }
                        this.ascending = !this.ascending;
                    } else {
                        this.reset();
                    }
                } else {
                    this.property = property;
                    this.ascending = true;
                    this.resetOnNextSet = false;
                }
            },
            reset: function () {
                this.property = null;
                this.ascending = null;
                this.resetOnNextSet = false;
            }
        };

        // when a column header is clicked
        $scope.sort = function (property) {
        	var sort = $scope.sortProperty || {};
            if (sort && sort.property === property) {
                // same property was clicked
                if (!sort.ascending) {
                    // third click removes sort
                    sort = null;
                } else {
                    // switch to descending
                    sort.ascending = false;
                }
            } else {
                // change sort property
                sort.property = property;
                sort.ascending = true;
            }
            $scope.loading = true;
            ProviderSearch.search($scope.teamResource, $scope.searchAll.providerQuery, $scope.status, sort, $scope.currentPageSize).then( function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
        	}, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.resetState = function () {
    		$scope.teamProviderTeamLocationSaveRequest = [];
    		$scope.searchedProvidersList = [];
            $scope.noSearch = true;
        	$scope.links = [];
        };

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
                    $scope.hideNewProviderModal();
                    if (!addAnother) {
                        // refresh the parent scope providers in the background
                        $scope.refreshLocationsAndProviders();
                        $scope.successAlert(providersToAdd, '#messages-container');
                    } else {
                        $scope.refreshLocationsAndProviders().then(function () {
                            $scope.addProviders().then(function () {
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

        /**
         * Display success alert
         */
        $scope.successAlert = function (providersToAdd, container) {
            var message = (providersToAdd.length === 1) ?
                ' <b>' + providersToAdd[0].provider.fullName + '</b> has been successfully added.' :
                'The selected providers have been successfully added.';
            $alert({
                content: message,
                container: container
            });
        };

        if ($scope.teamResource) {
			ProviderView.specialtyRefData($scope.teamResource).then(function (response) {
	        	$scope.specialties = response;
	        });
        }

        $scope.allProvidersForTeam = function () {
        	ProviderView.allProvidersForTeam($scope.teamResource).then(function (response) {
        		$scope.handleResponse(response, 'listOfTeamProviders');
        	});
        };

        $scope.showError = function () {
            if (!$scope.providerErrorAlertForCreate) {
                $scope.providerErrorAlertForCreate = $alert({
                    content: 'Please correct the below information.',
                    container: '#modal-messages-container',
                    type: 'danger',
                    placement: '',
                    duration: false,
                    dismissable: false
                });
            } else {
                $scope.providerErrorAlertForCreate.show();
            }
        };
	}])
;
