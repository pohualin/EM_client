'use strict';
angular.module('emmiManager')

	.controller('ProviderListController', function($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderSearch, $controller, arrays, ProviderCreate){
		
		$controller('CommonPagination', {$scope: $scope}); 
        
		$scope.title = 'New Provider';

        $scope.provider = ProviderCreate.newProvider();		

        $scope.noSearch = true;

        $scope.teamProviderTeamLocationSaveRequest = [];
        
        var searchedProvidersList ='searchedProvidersList';
        
        $scope.refreshLocationsAndProviders = function() {
			ProviderSearch.fetchAllLocationsForTeam($scope.teamResource).then(function(locationResponse){
				var locationsArray=[];
	        	angular.forEach(locationResponse, function(location){
	        		locationsArray.push(' '+ location.name);
	        	});
	        	$scope.allLocationsForTeam = locationsArray.sort().toString();
	        	ProviderView.paginatedProvidersForTeam($scope.teamResource).then(function(response){
	        		$scope.handleResponse(response, 'listOfTeamProviders');
	        	});      	
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
			// create a copy for editing
			$scope.teamProviderToBeEdit = angular.copy(teamProvider);
			// save the original for overlay if save is clicked
			$scope.teamProvider = teamProvider;
			// get ClientProvider for external provider id
			TeamProviderService.findClientProviderByClientIdAndProviderId($scope.teamProviderToBeEdit.link.findClientProviderByClientIdProviderId).then(function(response){
				$scope.clientProvider = response;
			});
			// get a list of team locations by team
			TeamLocation.getTeamLocations($scope.teamProvider.link.teamLocations).then(function(response){
				var potential = response;
				$scope.multiSelectData = TeamProviderService.buildMultiSelectData(potential);
				// get a list of existing team locations by team provider
				TeamProviderService.getTeamLocationsByTeamProvider($scope.teamProviderToBeEdit.link.findTeamLocationsByTeamProvider).then(function(response){
					if(response.length > 0){
						$scope.selectedItems = TeamProviderService.buildSelectedItem(response);
					} else {
						$scope.selectedItems = TeamProviderService.buildMultiSelectData(potential);
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
        	});
            _paq.push(['trackEvent', 'Form Action', 'Team Provider', 'Remove']);
        };
        
        $scope.addProviders = function () {
        	addproviderModal.$promise.then(addproviderModal.show);
        };
	        
    	var addproviderModal =	   $modal({
			   scope: $scope, 
			   template: 'partials/team/provider/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});

        $scope.hideaddprovidermodal = function () {
        	addproviderModal.$promise.then(addproviderModal.hide);
    		$scope.resetState();
        };

        ProviderSearch.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });
	        
        $scope.cancel = function () {
        	$scope.hideaddprovidermodal();
        };

        ProviderSearch.fetchLocationsForTeam($scope.teamResource).then( function (response){
        	$scope.teamLocations = response.data.content;
    	});

        $scope.createNewProvider = function () {
        	$scope.hideaddprovidermodal();
        	newProviderModal.$promise.then(newProviderModal.show);
        };
        
        var newProviderModal = $modal({scope: $scope, template: 'partials/team/provider/new.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});

        $scope.hideNewProviderModal = function () {
        	newProviderModal.$promise.then(newProviderModal.hide);
        };
	        
       $scope.search = function (isValid){
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
            $scope.sortProperty.setProperty(property);
            $scope.loading = true;
            ProviderSearch.search($scope.teamResource, $scope.providerQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then( function (providerPage){
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
        	if ($scope.teamProviderTeamLocationSaveRequest.length > 0) {
	        	ProviderSearch.updateProviderTeamAssociations($scope.teamProviderTeamLocationSaveRequest, $scope.teamResource).then(function (response) {
	        		$scope.refreshLocationsAndProviders();
	        		$scope.hideaddprovidermodal();
	        		if (addAnother) {
        				$scope.addProviders();   
	        		}
	        	});
        	}
        };
        
        $scope.associateSelectedProvidersToTeam = function (addAnother) {
        	if ($scope.teamProviderTeamLocationSaveRequest.length > 0) {
	        	ProviderSearch.updateProviderTeamAssociations($scope.teamProviderTeamLocationSaveRequest, $scope.teamResource).then(function (response) {
	        		$scope.hideaddprovidermodal();
	        		if (addAnother) {
        				$scope.addProviders();   
	        		}
	        		$scope.refreshLocationsAndProviders();

	        	});
        	}
        };

        $scope.onCheckboxChange = function (provider) {
   			 var request = {};
    		 request.teamLocations = [];
    		 provider.entity.teamLocations = [];
    		 
        	 if (provider.entity.checked) {
        		 angular.forEach($scope.teamLocations, function (teamLocation){
        			provider.entity.teamLocations.push(teamLocation.entity); 
        		 });
        		 if(provider.entity.teamLocations.length > 0){
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

        $scope.updateTeamLocationsForProvider = function (provider) {
        	var request = {};
        	request.teamLocations = [];
        	request.provider = provider.entity;
        	
        	angular.forEach(provider.entity.teamLocations, function (teamLocation){
				   request.teamLocations.push(teamLocation.entity);
			});
        	
         	angular.forEach($scope.teamProviderTeamLocationSaveRequest, function (requestFromScope){
	         	if (requestFromScope.provider.id === request.provider.id) {
	         		requestFromScope.teamLocations = request.teamLocations;
	         	}
         	});
        };
        
        $scope.saveAndAddAnotherProvider = function (isValid) {
            $scope.saveProvider(isValid, true);
        };

        $scope.saveProvider = function (isValid, addAnother) {
            $scope.providerFormSubmitted = true;
        	if (isValid) {
	        	ProviderCreate.create($scope.provider, $scope.teamResource).then(function(response){
	                $scope.hideNewProviderModal();
	                $scope.refreshLocationsAndProviders();
	                if (addAnother) {
        				$scope.addProviders();   
	        		}
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