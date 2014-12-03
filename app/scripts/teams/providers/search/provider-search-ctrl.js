'use strict';
angular.module('emmiManager')

	.controller('ProviderSearchController', function($scope, $modal, $controller, ProviderSearch, ProviderView){
		
        $controller('TeamProviderCommon', {$scope: $scope});
        
		$controller('CommonPagination', {$scope: $scope});

        $scope.teamProviderTeamLocationSaveRequest = [];

        ProviderSearch.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });
        
        $scope.cancel = function () {
            $scope.$hide();
        };

        ProviderSearch.fetchLocationsForTeam($scope.teamResource).then( function (response){
        	$scope.teamLocations = response.data.content;
    	});

        $scope.createNewProvider = function () {
        	$scope.$hide();
        	$modal({scope: $scope, template: 'partials/team/provider/new.html', animation: 'none', backdropAnimation: 'emmi-fade', backdrop: 'static'});
        };

        $scope.hideNewProviderModal = function () {
        	$scope.$hide();
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
        	}, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ProviderSearch.fetchPageLink(href).then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.changePageSize = function (pageSize) {
            $scope.loading = true;
            ProviderSearch.search($scope.teamResource, $scope.providerQuery, $scope.status, $scope.sortProperty, pageSize).then( function (providerPage){
                $scope.handleResponse(providerPage, 'searchedProvidersList');
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
        	}, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.saveAssociationAndAddAnotherProvider = function () {
        	$scope.associateSelectedProvidersToTeam (true);
        };
        
        $scope.associateSelectedProvidersToTeam = function (addAnother) {
        	if ($scope.teamProviderTeamLocationSaveRequest.length > 0) {
	        	ProviderSearch.updateProviderTeamAssociations($scope.teamProviderTeamLocationSaveRequest, $scope.teamResource).then(function () {
	        		$scope.$hide();
	        		ProviderSearch.fetchLocationsForTeam($scope.teamResource).then( function (locationResponse){
	    				var locationsArray=[];
	    	        	var allLocations = locationResponse.data.content;
	    	        	angular.forEach(locationResponse.data.content, function(location){
	    	        		locationsArray.push(' '+ location.entity.location.name);
	    	        	});
	    	        	ProviderView.allProvidersForTeam($scope.teamResource, locationsArray).then(function(response){
	    	        		$scope.teamResource.teamProviders = response.content;
	    	        		$scope.handleResponse(response, 'teamProviders');      
		    	        	if (addAnother) {
		        				$scope.addProviders();   
			        		}
	    	        	});
	        		});
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
        
        
	})
;