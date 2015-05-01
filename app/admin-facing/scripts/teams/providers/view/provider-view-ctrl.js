'use strict';
angular.module('emmiManager')

	.controller('ProviderListController', function($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderSearch, $controller, arrays, ProviderCreate, ClientProviderService, Client, $alert){

		$controller('CommonPagination', {$scope: $scope});

        $scope.provider = ProviderCreate.newProvider();

        $scope.invalidRequest = false;

        $scope.noSearch = true;

        $scope.teamProviderTeamLocationSaveRequest = [];

        var searchedProvidersList ='searchedProvidersList';

        $scope.locationsColumnCharLimit = 25;

        $scope.allLocationsForTeam = 'All Locations';

        $scope.$on('event:teamLocationSavedWithProvider', function () {
        	$scope.refreshLocationsAndProviders();
        });

        $scope.refreshLocationsAndProviders = function() {
            $scope.teamProviders = {};
        	ProviderView.paginatedProvidersForTeam($scope.teamResource).then(function(response){
        	    angular.forEach(response.content, function (teamProvider) {
                    $scope.teamProviders[teamProvider.entity.provider.id] = angular.copy(teamProvider.entity.provider);
                });
        		$scope.handleResponse(response, 'listOfTeamProviders');
        	});
        	TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations).then(function(response){
                $scope.allTeamLocations = TeamProviderService.buildMultiSelectData(response);
            });
		};

		if($scope.teamResource){
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
        	ProviderView.removeProvider(provider, $scope.teamResource).then(function (){
                $scope.refreshLocationsAndProviders();
                $alert({
                    title: ' ',
                    content: 'The provider <b>' + provider.entity.provider.fullName + '</b> has been successfully removed.',
                    container: '#messages-container',
                    type: 'success',
                    placement: 'top',
                    show: true,
                    duration: 5,
                    dismissable: true
                });
        	});
            _paq.push(['trackEvent', 'Form Action', 'Team Provider', 'Remove']);
        };

        $scope.addProviders = function (addAnother) {
            if($scope.providerErrorAlertForCreate){
                $scope.providerErrorAlertForCreate.hide();
            }
            $scope.associateRequestSubmitted = false;
        	TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations).then(function(response){
                $scope.allTeamLocations = TeamProviderService.buildMultiSelectData(response);
            });
       		$scope.addProvidersModalOnScope = {};
       		$scope.addAnother = addAnother;
       		ClientProviderService.findForClient(Client.getClient()).then(function (clientProviders) {
       			if(clientProviders.content && clientProviders.content.length > 0){
       				$scope.addProvidersModalOnScope =  $modal({
       					scope: $scope,
       					template: 'admin-facing/partials/team/provider/searchWCPTabs.html', animation: 'none', backdropAnimation: 'emmi-fade', show: true, backdrop: 'static'});
       			}
       			else{
        	       	$scope.addProvidersModalOnScope =  $modal({
        	       		scope: $scope,
        	       		template: 'admin-facing/partials/team/provider/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: true, backdrop: 'static'});
       			}
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
        	TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations).then(function(response){
                $scope.potentialLocations = response;
                $scope.selectedItems = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
                $scope.multiSelectData = TeamProviderService.buildMultiSelectData($scope.potentialLocations);
                $scope.title = 'New Provider';
                $scope.hideaddprovidermodal();
                $scope.resetCreateNewProviderModalState();
                newProviderModal.$promise.then(newProviderModal.show);
                
                if(searchForm.providerQuery){
                    var strings = searchForm.providerQuery.$modelValue.split(',');
                    if(strings.length > 1){
                        $scope.provider.firstName = strings[1].trim();
                    }
                    $scope.provider.lastName = strings[0].trim();
                }
            });
        };

        var newProviderModal = $modal({scope: $scope, template: 'admin-facing/partials/team/provider/new.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});

        $scope.hideNewProviderModal = function () {
        	newProviderModal.$promise.then(newProviderModal.hide);
        };

        $scope.resetCreateNewProviderModalState = function () {
			$scope.providerFormSubmitted = false;
            $scope.provider = ProviderCreate.newProvider();
        };

        $scope.search = function (isValid) {
        	if(isValid){
	            $scope.noSearch = false;
	        	ProviderSearch.search($scope.teamResource, $scope.providerQuery, $scope.status).then( function (providerPage){
	        		$scope.handleResponse(providerPage, 'searchedProvidersList');
	        	});
        	}
        };

        $scope.statusChange = function () {
            $scope.loading = true;
            ProviderSearch.search($scope.teamResource, $scope.providerQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then( function (providerPage){
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
            ProviderSearch.search($scope.teamResource, $scope.providerQuery, $scope.status, $scope.sortProperty, pageSize).then( function (providerPage){
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
            ProviderSearch.search($scope.teamResource, $scope.providerQuery, $scope.status, sort, $scope.currentPageSize).then( function (providerPage){
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

        $scope.saveAssociationAndAddAnotherProvider = function () {
        	$scope.associateSelectedProvidersToTeam(true);
        };

        $scope.associateSelectedProvidersToTeam = function (addAnother) {
        	$scope.associateRequestSubmitted = true;

        	if ($scope.teamProviderTeamLocationSaveRequest.length > 0) {
                $scope.invalidRequest = false;
        		angular.forEach($scope.teamProviderTeamLocationSaveRequest, function(req){
        			if ($scope.allTeamLocations.length > 0 && req.provider.selectedTeamLocations.length < 1) {
        				$scope.invalidRequest = true;
        			}
        		});
        		if (!$scope.invalidRequest) {
                    // copy the selected team locations when 'all' has not been chosen
                    angular.forEach($scope.teamProviderTeamLocationSaveRequest, function(req){
                        if (req.provider.selectedTeamLocations.length !== $scope.allTeamLocations.length) {
                            // user didn't choose all team locations
                            req.teamLocations = angular.copy(req.provider.selectedTeamLocations);
                        } else {
                            // user chose all, which is the same as not selecting any
                            req.teamLocations = [];
                        }
                    });

		        	ProviderSearch.updateProviderTeamAssociations($scope.teamProviderTeamLocationSaveRequest, $scope.teamResource).then(function (response) {
		        		$scope.refreshLocationsAndProviders();
                        var message;
                        if ($scope.teamProviderTeamLocationSaveRequest.length < 2) {
                            message = 'The provider <b>'+ $scope.teamProviderTeamLocationSaveRequest[0].provider.fullName +'</b> has been successfully added.';
                        } else {
                            message = 'The selected providers have been successfully added.';
                        }

	                    $scope.hideaddprovidermodal();

		        		if (addAnother) {
	        				$scope.addProviders(true);
	        				$scope.successAlert(message, '#modal-messages-container', addAnother);
		        		} else {
		        		    $scope.successAlert(message, '#messages-container');
		        		}
		        	});
        		}
        	}
        };

        $scope.onCheckboxChange = function (provider) {
   			 var request = {};
    		 request.teamLocations = [];
    		 provider.entity.teamLocations = [];

        	 if (provider.entity.checked) {
        		 provider.entity.selectedTeamLocations = angular.copy($scope.allTeamLocations);
        		 if(provider.entity.selectedTeamLocations.length > 0){
            		 provider.entity.showLocations = true;
        		 }
        		 request.provider = provider.entity;
        		 $scope.teamProviderTeamLocationSaveRequest.push(request);
        	 }
        	 else {
        		 provider.entity.showLocations=false;
        		 request.provider = provider.entity;
             	 $scope.teamProviderTeamLocationSaveRequest.splice(request.provider.entity, 1);
        	 }
        };

        $scope.setCheckboxesForChanged = function(providers) {
        	angular.forEach(providers, function(searchedTeamProvider){
            	angular.forEach($scope.teamProviderTeamLocationSaveRequest, function(teamProviderInRequest){
                	if(teamProviderInRequest.provider.id === searchedTeamProvider.provider.entity.id) {
                		searchedTeamProvider.provider.entity.checked = true;
					}
            	});
            });
        };

        $scope.saveAndAddAnotherProvider = function (isValid) {
            $scope.saveProvider(isValid, true);
        };

        $scope.saveProvider = function (isValid, addAnother) {
            $scope.providerFormSubmitted = true;
        	if (isValid && (($scope.allTeamLocations.length > 0 && $scope.selectedItems.length > 0) || $scope.allTeamLocations.length === 0)) {
	        	ProviderCreate.create($scope.provider, $scope.teamResource, $scope.selectedItems).then(function(response){
	                ProviderCreate.associateTeamLocationsToProvider(response.data.entity, $scope.teamResource, $scope.selectedItems);
	        		$scope.hideNewProviderModal();
	                $scope.refreshLocationsAndProviders();
	                var message = 'The provider <b>'+ response.data.entity.fullName +'</b> has been successfully added.';

                    if (addAnother) {
                        $scope.addProviders(true);
                        $scope.successAlert(message, '#modal-messages-container', addAnother);
                    } else {
                        $scope.successAlert(message, '#messages-container');
                    }
	        	});
                _paq.push(['trackEvent', 'Form Action', 'Team Provider Create', 'Save']);
	        } else{
                $scope.showError();
            }
        };

        /**
         * Display success alert
         */
        $scope.successAlert = function(message, container, addAnother){
            var placement = addAnother ? '': 'top';
            $alert({
                title: '',
                content: message,
                container: container,
                type: 'success',
                placement: placement,
                show: true,
                duration: 5,
                dismissable: true
            });
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

        $scope.showError = function () {
            if (!$scope.providerErrorAlertForCreate) {
                $scope.providerErrorAlertForCreate = $alert({
                    title: ' ',
                    content: 'Please correct the below information.',
                    container: '#modal-messages-container',
                    type: 'danger',
                    show: true,
                    dismissable: false
                });
            } else {
                $scope.providerErrorAlertForCreate.show();
            }
        };
	})
;
