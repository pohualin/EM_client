'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientProgramContentConfiguration page
 */
    .controller('ClientProgramContentConfigurationController', ['$alert', '$scope', '$controller', 'Client', 'ContentSubscriptionConfigurationService',
        function ($alert, $scope, $controller, Client, ContentSubscriptionConfigurationService) {
       
    	$scope.addAnotherContentSubscription = false;
        $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.sourceContentHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.sourceContentToSave = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        
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
            angular.forEach($scope.selectedContentList, function (aContent){
              if(aContent.entity.contentSubscription !== null){
               if(aContent.entity.contentSubscription.id === 128){
                  aContent.entity.contentSubscription.name = 'EmmiEngage';
                  if($scope.sourceContentToSave.entity.contentSubscription !== null){ 
                	  console.log('rerererrerrrrre');
                	  console.log($scope.sourceContentToSave);
                	 $scope.selectedContentList.push($scope.sourceContentToSave);
                  }
               }
            }
            });
            ContentSubscriptionConfigurationService.saveAll($scope.selectedContentList, $scope.selectedContentSubscription.entity.faithBased).then(function(response){
            	//angular.copy(response, $scope.selectedContentList);
            	$scope.$emit('selectedContentList');
            	$alert({
                    content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                });
                }).finally(function () {
                   	$scope.whenSaving = false;
                	$scope.cancel();
                });
           
           
       };
       
       $scope.$on('event:remove-content-holder', function () {
    	   $scope.addAnotherContentSubscription = false;
    	   $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
    	   
       });

       $scope.onChangePrimaryList = function(newSubscriptionHolder){
    	   console.log('chnage primare');
    	   console.log(newSubscriptionHolder);
    	   if((angular.isDefined($scope.contentSubscriptionHolder.entity.contentSubscription)) &&
                  ($scope.contentSubscriptionHolder.entity.contentSubscription !== null)){
                	if($scope.contentSubscriptionHolder.entity.contentSubscription.name === 'None'){
                		$scope.noneSelectedForClient(true);
                		$scope.resetFaithBased(false);
                       	$scope.selectedContentSubscription.entity.faithBased = false;
                    	$scope.showButtons(false);
                    }
                	else{
                	   if($scope.latestPrimaryContentList.length > 1){
                		   $scope.addAnotherContentSubscription = true;
                	   }
                	   if(newSubscriptionHolder.entity.contentSubscription.name !== 'EmmiEngage+'){
                		   $scope.sourceContentHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();   	        
                	   }
                	   else{
                		   console.log('emmiemnfdage+');
                		   if($scope.sourceContentHolder.entity.contentSubscription !== null){
                			   console.log($scope.sourceContentHolder);
                			   angular.copy($scope.sourceContentHolder,$scope.sourceContentToSave);
                			   console.log($scope.sourceContentToSave);
                		   }
                	   }
                	   $scope.noneSelectedForClient(false);
                	   $scope.resetFaithBased(true);
                       $scope.showButtons(true);
                    }
               	}
         };
  
         $scope.onChangeSelectedPrimaryList = function(){
        	    $scope.addAnotherContentSubscription = true;
        	    $scope.setInitialAddAnotherContentSubscription(true);
        	    $scope.resetFaithBased(true);
                $scope.showButtons(true);
         };
         
         $scope.viewAndEditSubscription = function(){
        	// EM-1521
         };
         
                  
       /* 
        * Added another content subscription for a client
        * push the new content subscription to the selectedContentList
        */
       $scope.addAnotherSubscription = function(newContentSubscription, newSourceContent){
    	   console.log('change another');
    	   console.log(newContentSubscription);
    	   $scope.setInitialAddAnotherContentSubscription(false);
    	   $scope.resetShowSelectList(true);
    	   $scope.addAnotherContentSubscription = false;
    	   $scope.showButtons(true);
    	   if(newSourceContent.entity.contentSubscription !== null){
    		   console.log('not nulllllll');
    		   angular.copy(newSourceContent, $scope.sourceContentToSave);
    	   }
    	   console.log($scope.sourceContentToSave);
    	   $scope.selectedContentList.push(newContentSubscription);
    	   $scope.updateLatestPrimaryContentList(newContentSubscription);
    	   $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
       };

       $scope.onChangeFaithBased = function(faithBased){
    	   angular.forEach($scope.selectedContentList, function (aContent){
    		   aContent.entity.faithBased = faithBased;
       	   });
    	   $scope.showButtons(true);
       };
        
    }]);

