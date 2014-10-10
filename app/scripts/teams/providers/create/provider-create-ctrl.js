'use strict';
angular.module('emmiManager')
	.controller('TeamAddProvidersController', function ($scope, $modal) {
		
		   var addNewProviderModal = $modal({scope: $scope, template: 'partials/team/provider/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

	        $scope.addProviders = function () {
	        	addNewProviderModal.$promise.then(addNewProviderModal.show);
	        };
	        
	        $scope.hideProviderSearchModal = function(){
	        	addNewProviderModal.hide();
	        };
	        
	        var newProviderModal = $modal({scope: $scope, template: 'partials/team/provider/new.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

	        $scope.createNewProvider = function () {
	            $scope.hideProviderSearchModal();
	            newProviderModal.$promise.then(newProviderModal.show);
	        };

	        $scope.hideNewProviderModal = function () {
	        	newProviderModal.$promise.then(newProviderModal.destroy);
	        };
	})
	
	.controller('ProviderCreateController', function($scope, ProviderCreate, $route){

        $scope.title = 'New Provider';
        $scope.provider = ProviderCreate.newProvider();

        ProviderCreate.specialtyRefData($scope.teamResource).then(function(response){
        	$scope.specialties = response;
        });
        
        ProviderCreate.allProvidersForTeam($scope.teamResource).then(function(response){
        	$scope.providers = response.data.content;
        });
        
        $scope.saveProvider = function(isValid){
            $scope.providerFormSubmitted = true;
        	ProviderCreate.create($scope.provider, $scope.teamResource).then(function(response){
            	$scope.providers = {};
            	console.log('response =' + JSON.stringify($scope.providers));

//                $route.reload();
                ProviderCreate.allProvidersForTeam($scope.teamResource).then(function(response1){
                	console.log('response =' + JSON.stringify(response1));
                	$scope.providers = response1.data.content;
                	$scope.newList = response1.data.content;
                    $scope.hideNewProviderModal();

                });

                
        	});
        };
	})
;