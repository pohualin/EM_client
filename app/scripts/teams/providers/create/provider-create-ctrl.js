'use strict';
angular.module('emmiManager')

	.controller('TeamProviderCommon', function($scope, ProviderCreate){
		
		ProviderCreate.specialtyRefData($scope.teamResource).then(function(response){
        	$scope.specialties = response;
        });

        $scope.allProvidersForTeam = function() {
        	ProviderCreate.allProvidersForTeam($scope.teamResource).then(function(response){
        		$scope.teamResource.providers = response.data.content;
        	});
        };
	})

	.controller('TeamAddProvidersController', function ($scope, $modal, $controller) {
        $controller('TeamProviderCommon', {$scope: $scope});

		   var addNewProviderModal = $modal({scope: $scope, template: 'partials/team/provider/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

	        $scope.addProviders = function () {
	        	addNewProviderModal.$promise.then(addNewProviderModal.show);
	        };
	        
	        $scope.hideProviderSearchModal = function(){
	        	addNewProviderModal.hide();
	        };
	})
	
	.controller('ProviderCreateController', function($scope, ProviderCreate, $route, $controller, $modal){
        $controller('TeamProviderCommon', {$scope: $scope});

        $scope.title = 'New Provider';
        
        $scope.provider = ProviderCreate.newProvider();
       
        $scope.teamResource.providers = $scope.allProvidersForTeam();
        
        $scope.saveProvider = function(isValid){
            $scope.providerFormSubmitted = true;
        	ProviderCreate.create($scope.provider, $scope.teamResource).then(function(response){
                $scope.hideNewProviderModal();
    	        ProviderCreate.allProvidersForTeam($scope.teamResource).then(function(response){
    	        	$scope.teamResource.providers = response.data.content;
    	        });
        	});
        };
	})
	
	.controller('ProviderSearchController', function($scope, $modal, $controller){
        $controller('TeamProviderCommon', {$scope: $scope});

        $scope.cancel = function () {
            $scope.$hide();
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
;