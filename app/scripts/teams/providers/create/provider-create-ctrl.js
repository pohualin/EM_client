'use strict';
angular.module('emmiManager')

	.controller('TeamAddProvidersController', function ($scope, $modal, $controller) {
        $controller('TeamProviderCommon', {$scope: $scope});

	        $scope.addProviders = function () {
			   $modal({scope: $scope, template: 'partials/team/provider/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: true, backdrop: 'static'});
	        };
	})
	
	.controller('ProviderCreateController', function($scope, ProviderCreate, $controller, ProviderView){
        $controller('TeamProviderCommon', {$scope: $scope});

        $scope.title = 'New Provider';
        
        $scope.provider = ProviderCreate.newProvider();
        
        $scope.saveAndAddAnotherProvider = function (isValid) {
            $scope.saveProvider(isValid, true);
        };
               
        $scope.saveProvider = function (isValid, addAnother) {
            $scope.providerFormSubmitted = true;
        	if (isValid) {
	        	ProviderCreate.create($scope.provider, $scope.teamResource).then(function(response){
	                $scope.$hide();
	                ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
	    	        	$scope.teamResource.teamProviders = response;
	    	        	if (addAnother) {
	                        $scope.addProviders();
	                    } 
	                });
	        	});
	        }
        };
	})
;