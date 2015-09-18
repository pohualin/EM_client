'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientProgramContentConfiguration page
 */
    .controller('AddProgramController', ['$alert', '$scope', '$controller', 'clientResource', 'Client', 'MainContentService', 'ContentSubscriptionConfigurationService',
        function ($alert, $scope, $controller, clientResource, Client, MainContentService, ContentSubscriptionConfigurationService) {
       
    	// Inclusion story EM-1646
    	$scope.faithBased = false;
        $scope.showContentButton = false;
        $scope.noneSelected = true;
        $scope.addPrograms = function(){
        	
        };
       
    }]);

