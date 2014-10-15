'use strict';
angular.module('emmiManager')

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
	
	.controller('ProviderCreateController', function($scope, ProviderCreate, $controller, ProviderView){
        $controller('TeamProviderCommon', {$scope: $scope});

        $scope.title = 'New Provider';
        
        $scope.provider = ProviderCreate.newProvider();
               
        $scope.saveProvider = function(isValid){
            $scope.providerFormSubmitted = true;
	        	ProviderCreate.create($scope.provider, $scope.teamResource).then(function(response){
	                $scope.hideNewProviderModal();
	                ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
	    	        	$scope.teamResource.providers = response;
	    	        });
	        	});
        };
	})
;