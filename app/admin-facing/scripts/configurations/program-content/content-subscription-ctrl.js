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
        $scope.save = function(form){
        	$scope.resetSubscriptionForm(true);  
            if(form.$valid){
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
        	$scope.$emit('startLoading');
        	var EmmiEngageExist = false;
        	if((angular.isDefined($scope.contentSubscriptionHolder)) &&
               (angular.isDefined($scope.contentSubscriptionHolder.entity.contentSubscription))){
            	angular.forEach($scope.selectedContentList, function (aContent){
            		if((angular.isDefined(aContent.id)) &&
            		   (angular.equals(aContent.id, $scope.contentSubscriptionHolder.entity.contentSubscription.id))){
            			notInList = false;
                	}
            	});
            }
            
        	if(notInList &&
               (angular.isDefined($scope.contentSubscriptionHolder.entity.contentSubscription.id))){
        		$scope.selectedContentList.push($scope.contentSubscriptionHolder);
                $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
            }
        
           if($scope.selectedContentList.length < 1){
              if(angular.isDefined($scope.selectedContentSubscription.entity.id)){
             	 $scope.selectedContentList.push($scope.selectedContentSubscription);
              }
           }
          
            angular.forEach($scope.selectedContentList, function (aContent){
             if(aContent.entity.contentSubscription !== null){
               if((aContent.entity.contentSubscription.id === 128) &&
            	   (aContent.entity.contentSubscription.name === 'EmmiEngage+')){
            	     EmmiEngageExist = true;
            	     aContent.entity.contentSubscription.name = 'EmmiEngage';
                     if(($scope.sourceContentToSave.entity.contentSubscription !== null) &&
                        (angular.isDefined($scope.sourceContentToSave.entity.contentSubscription.id))){
                    	 $scope.selectedContentList.push($scope.sourceContentToSave);
                     }
                     else if(($scope.originalSourceContent.entity.contentSubscription !== null)&&
                    		   (angular.isDefined($scope.originalSourceContent.entity.id))){
                    	 $scope.selectedContentList.push($scope.originalSourceContent);
                     }
               }
             }
           });  
            if(!EmmiEngageExist){
               	   if(($scope.originalSourceContent.entity.contentSubscription !== null)&&
              		   (angular.isDefined($scope.originalSourceContent.entity.id))){ 
              		 $scope.originalSourceContent.entity.contentSubscription = null;
                   	 $scope.selectedContentList.push($scope.originalSourceContent);
                     }
             }
                   ContentSubscriptionConfigurationService.saveAll($scope.selectedContentList, $scope.selectedContentSubscription.entity.faithBased).then(function(response){
               	$scope.$emit('selectedContentList');
            	$alert({
                    content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                });
                }).finally(function () {
                	$scope.whenSaving = false;
                	 $scope.$emit('finishLoading');
                   	$scope.showButtons(false);
                    $scope.resetSubscriptionForm(false);
                    $scope.resetContentHolders();
                });
       
       };
       
       $scope.$on('event:remove-content-holder', function () {
    	   $scope.resetContentHolders();
       });
       
       $scope.resetContentHolders = function () {
    	   $scope.addAnotherContentSubscription = false;
    	   $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
           $scope.sourceContentHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
           $scope.sourceContentToSave = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
       };
       
       $scope.$on('event:reset-add-another-content', function () {
    	   $scope.addAnotherContentSubscription = false;
       });
       
       $scope.onChangePrimaryList = function(newSubscriptionHolder){
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
                		   $scope.checkIfEmmiEngagePlus(newSubscriptionHolder);
                		   $scope.sourceContentHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();  	        
                	   }
                	   else{
                		   if($scope.sourceContentHolder.entity.contentSubscription !== null){
                			   $scope.resetIsEmmiEngage(true);
                			   $scope.sourceContentToSave = $scope.sourceContentHolder;
                			   $scope.sourceContentHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
                			   
                   		   }
                	   }
                	   $scope.noneSelectedForClient(false);
                	   $scope.resetFaithBased(true);
                       $scope.showButtons(true);
                    }
               	}else{
               	    $scope.checkIfEmmiEngagePlus(newSubscriptionHolder);
               		$scope.resetFaithBased(false);
               		$scope.showButtons(false);
               		$scope.addAnotherContentSubscription = false;
               	}
    	      
         };
         
         $scope.onChangeSourceContent = function(newSourceContentHolder){
        	   $scope.sourceContentToSave = newSourceContentHolder;
        	   $scope.sourceContentHolder = newSourceContentHolder;
        	   $scope.resetSelectedSourceContent(newSourceContentHolder);
               $scope.showButtons(true);
         };
         $scope.onChangeSelectedPrimaryList = function(newSourceSubscriptionHolder){ 
        	   $scope.addAnotherContentSubscription = true;
        	   $scope.setInitialAddAnotherContentSubscription(true);
        	   $scope.resetFaithBased(true);
        	   $scope.resetSelectedContentSubscription(newSourceSubscriptionHolder);
        	   $scope.showButtons(true);
               $scope.fetchLatestPrimaryContentList();
        };
                   
       /* 
        * Added another content subscription for a client
        * push the new content subscription to the selectedContentList
        */
       $scope.addAnotherSubscription = function(newContentSubscription, newSourceContent){
    	   $scope.setInitialAddAnotherContentSubscription(false);
    	   $scope.resetShowSelectList(true);
    	   $scope.addAnotherContentSubscription = false;
    	   $scope.showButtons(true);
    	   if(newSourceContent.entity.contentSubscription !== null){
    		     $scope.sourceContentToSave = newSourceContent;
    		     $scope.sourceContentHolder = newSourceContent;
    		     $scope.resetSelectedSourceContent(newSourceContent);
    	   }
    	   $scope.selectedContentList.push(newContentSubscription);
    	   $scope.updateLatestPrimaryContentList(newContentSubscription);
    	   $scope.checkIfEmmiEngagePlus(newContentSubscription);
    	   $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
       };

       $scope.onChangeFaithBased = function(faithBased){
    	   angular.forEach($scope.selectedContentList, function (aContent){
    		   aContent.entity.faithBased = faithBased;
       	   });
    	   $scope.showButtons(true);
       };
        
    }]);

