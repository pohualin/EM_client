'use strict';
angular.module('emmiManager')

	.controller('TeamProviderCommon', function($scope, ProviderView){
        $scope.noSearch = true;

        if($scope.teamResource){
			ProviderView.specialtyRefData($scope.teamResource).then(function(response){
	        	$scope.specialties = response;
	        });
        }
        $scope.allProvidersForTeam = function() {
        	ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
        		$scope.teamResource.providers = response;

        	});
        };
	})
	
	.controller('ProviderListController', function($scope, ProviderView){
        if($scope.teamResource){
	    	ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
	    		$scope.teamResource.providers = response;
	    	});
        }
	})
;