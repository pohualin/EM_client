'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientProgramContentConfiguration page
 */
    .controller('ClientProgramContentConfigurationController', ['$alert', '$scope', '$controller', 'Client', 'ContentSubscriptionConfigurationService',
        function ($alert, $scope, $controller, Client, ContentSubscriptionConfigurationService) {
       
    	$scope.showContentButton = false;
        $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
                
        /**
         * Save content subscription configuration for the client
         */
        $scope.save = function(valid){
            $scope.contentSubscriptionFormSubmitted = true;          
            if(valid){
                $scope.whenSaving = true;
                $scope.filterSaveListAndSave();
                
            }else {
                if (!$scope.formAlert) {
                    $scope.formAlert = $alert({
                        content: 'Please correct the below information.',
                        container: '#message-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                }
            }
        };
        
        /*
         * Make sure all the selected content got push to the list and 
         * Call the saveAll method in the service to create/update/delete
         */
        $scope.filterSaveListAndSave = function(){
        	var notInList = true;
        	if((angular.isDefined($scope.contentSubscriptionHolder)) &&
               (angular.isDefined($scope.contentSubscriptionHolder.entity.contentSubscription))){
            	angular.forEach($scope.selectedContentList, function (aContent){
            		if(angular.equals(aContent.id, $scope.contentSubscriptionHolder.entity.contentSubscription.id)){
            			notInList = false;
                	}
            	});
            }
            if(notInList &&
               (angular.isDefined($scope.contentSubscriptionHolder))){
               	$scope.selectedContentList.push($scope.contentSubscriptionHolder);
               	$scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
             }
            ContentSubscriptionConfigurationService.saveAll($scope.selectedContentList, $scope.selectedContentSubscription.entity.faithBased).then(function(response){
            	angular.copy(response, $scope.selectedContentList);
            	//$scope.separateSavedLists($scope.selectedContentList);
            	$scope.$emit('selectedContentList');
            	$alert({
                    content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                });
                }).finally(function () {
                	$scope.reset();
                });
           
           
       };
       $scope.$on('refreshSelectedContentList', function () {
    	   $scope.getClientContentList();
       });
        
       /**
         * Show/hide cancel and save buttons
         */
        $scope.showButtons = function (showButton) {
         	return ($scope.showContentButton = showButton);
         };
         
         /**
          * Reset some scope variables when it needs to
          */
        $scope.reset = function(){
        	$scope.initialAddAnotherContentSubscription = true;
        	$scope.contentSubscriptionExist = false;
       	  	$scope.whenSaving = false;
       	   	$scope.showButtons(false);
        };
        
               
        $scope.onChangePrimaryList = function(){
        	   if(angular.isDefined($scope.selectedContentSubscription.entity.contentSubscription)){
                	if($scope.selectedContentSubscription.entity.contentSubscription.name === 'None'){
                    	$scope.faithBased = false;
                       	$scope.selectedContentSubscription.entity.faithBased = false;
                    	$scope.showButtons(false);
                    }
                    else{
                       $scope.faithBased = true;
                       $scope.showButtons(true);
                    }
               	}
         };
                   
       /* 
        * Added another content subscription for a client
        * push the new content subscription to the selectedContentList
        */
       $scope.addAnotherSubscription = function(newContentSubscription){
    	   $scope.initialAddAnotherContentSubscription = false;
    	   $scope.selectedContentList.push(newContentSubscription);
    	   $scope.latestPrimaryContentList = ContentSubscriptionConfigurationService.filterLatestPrimaryContentList($scope.latestPrimaryContentList, newContentSubscription, $scope.selectedContentList.length);
    	   $scope.addAnotherContentSubscription = false;
    	   $scope.showButtons(true);
           $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
       };
       
       $scope.initialAddSubscription = function(){
    	   $scope.initialAddAnotherContentSubscription = false;
    	   $scope.addAnotherContentSubscription = false;
    	   $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
       };
       
       $scope.onChangeFaithBased = function(faithBased){
    	   angular.forEach($scope.selectedContentList, function (aContent){
    		   aContent.entity.faithBased = faithBased;
       	   });
    	   $scope.showButtons(true);
       };
        
    }]);

