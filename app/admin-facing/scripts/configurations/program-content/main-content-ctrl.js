'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientProgramContentConfiguration page
 */
    .controller('MainContentConfigurationController', ['$alert', '$scope', '$controller', 'clientResource', 'Client', 'MainContentService', 'ContentSubscriptionConfigurationService',
        function ($alert, $scope, $controller, clientResource, Client, MainContentService, ContentSubscriptionConfigurationService) {
       
    	// Store the original content subscription list
        $scope.primaryContentList = [];
        $scope.sourceContentList = [];
        $scope.latestPrimaryContentList = [];
        $scope.listOfClientPrograms = [];
        
                        
        // Variables for the html to show or hide certain section
        $scope.faithBased = false;
        $scope.initialAddAnotherContentSubscription = false;
        $scope.noneSelected = false;
        $scope.showSelectList = false;
        $scope.isEmmiEngagePlus = false;
        $scope.contentSubscriptionFormSubmitted = false;
        $scope.dbEmmiEngagePlus = false;
        
        
        $scope.emmiEngagePlus = {};
        $scope.noneContent = {name:'None', id:0};
        $scope.selectedSourceContent = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.originalSourceContent = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.selectedContentSubscription = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.selectedContentList = [];
        $scope.showContentButton = false;
 
        
        /**
         * Cancel button clicked
         */
        $scope.cancel = function (contentSubscriptionForm) {
        	contentSubscriptionForm.$setPristine();
            $scope.contentSubscriptionFormSubmitted = false;
            $scope.initialAddAnotherContentSubscription = true;
            $scope.getClientContentList();
            $scope.$broadcast('event:remove-content-holder');
           	$scope.showButtons(false);
        };
  
        $scope.resetList = function(){
        	$scope.selectedContentList = [];
      	    $scope.latestPrimaryContentList = [];
      	    $scope.isEmmiEngagePlus = false;
        };
       /**
         * Show/hide cancel and save buttons
         */
        $scope.showButtons = function (showButton) {
         	return ($scope.showContentButton = showButton);
         };
         
         $scope.resetSubscriptionForm = function(newValue) {
        	 $scope.contentSubscriptionFormSubmitted = newValue;
         };
         
         /**
          * Reset selectedSourceContent
          */
         $scope.resetSelectedSourceContent = function (sourceContentToSave ) {
        	 $scope.selectedSourceContent = sourceContentToSave;
        	 $scope.originalSourceContent = sourceContentToSave;
        	 
          };
          
          /**
           * Reset selectedSourceContent
           */
          $scope.resetSelectedContentSubscription  = function (sourceContent) {
          	 $scope.selectedContentSubscription  = sourceContent;
          };
          
          $scope.resetIsEmmiEngage = function (newValue){
        	  $scope.isEmmiEngagePlus = newValue;
          };
          
          $scope.filterAgain = function (index) {
        	return function (item) {
        	if($scope.selectedContentList.length > 0){
        	 	if(($scope.selectedContentSubscription.entity.contentSubscription !== null) &&
        	 		($scope.selectedContentList[index].entity.contentSubscription !== null)){
        	    	 if ($scope.selectedContentList[index].entity.contentSubscription.name === item.name){
        	    			 return true;
        	    		}
        	    	 return false;
        	   	}  	
           }
           return true;
          };
       	};
        
        /**
         * Reset initialAddAnotherContentSubscription
         */
        $scope.setInitialAddAnotherContentSubscription = function (newValue) {
        	$scope.initialAddAnotherContentSubscription = newValue;
        };
        
        /**
         * Reset show select list or not
         */
        $scope.resetShowSelectList = function (newValue) {
        	 $scope.showSelectList = newValue;
        };
        
        /**
         * show faith based check box or not
         */
        $scope.resetFaithBased = function (newValue) {
        	 $scope.faithBased = newValue;
        };
        
        $scope.fetchLatestPrimaryContentList = function(contentHolder, lastestContent){
        	$scope.isEmmiEngagePlus = false;	  	
        	if(($scope.selectedContentList.length === 1) &&
        	   ($scope.selectedContentList[0].entity.contentSubscription === null)){
        		   if(((contentHolder.entity.contentSubscription === null)||
        	    	   (contentHolder.entity.contentSubscription === '')) ||
        	    	   ((lastestContent.entity.contentSubscription === null) ||
        	    	   (lastestContent.entity.contentSubscription === ''))){
        	    	    if(angular.isUndefined(contentHolder.entity.id)){
        	    		   $scope.resetList();
        	    		   angular.copy($scope.primaryContentList, $scope.latestPrimaryContentList);
        	    		   $scope.initialAddAnotherContentSubscription = false;
        	    		   $scope.showSelectList  = true;
        	    	   }
        	      }
        	      else{
        	    	  $scope.$broadcast('event:reset-add-another-content-true');
        	    	  $scope.showSelectList  = true;
        	     }
           }
           else{
        		 var checkEngagePlus = false;
        	     angular.forEach($scope.selectedContentList, function (aContent){
            		if(aContent.entity.contentSubscription !== null){
            			if($scope.dbEmmiEngagePlus){
            				if($scope.dbEngageId === aContent.entity.id){
 	    			          checkEngagePlus = true;
            				}
 	    			 }
 	    		  }
       	   	    });
	    	    $scope.isEmmiEngagePlus = checkEngagePlus;
           }
           if((contentHolder.entity.contentSubscription !== null) &&
     	    	(contentHolder.entity.contentSubscription !== '')){
        		if(contentHolder.entity.contentSubscription.name === 'EmmiEngage+') {
       				  $scope.isEmmiEngagePlus = true;
        		}
        	}
        	else if((lastestContent.entity.contentSubscription !== null) &&
          	    	   (lastestContent.entity.contentSubscription !== '')){
               	if(lastestContent.entity.contentSubscription.name === 'EmmiEngage+'){
               		  $scope.isEmmiEngagePlus = true;
              	}
           }
       };
        
        /*
         * update latest primary content list
         */
        $scope.updateLatestPrimaryContentList = function(aContent){
           	$scope.latestPrimaryContentList = 
        		ContentSubscriptionConfigurationService.filterLatestPrimaryContentList($scope.latestPrimaryContentList, aContent, $scope.selectedContentList.length);
        };

        /*
         *  set the noneSelected variable
         */
        $scope.noneSelectedForClient = function (newValue){
        	$scope.noneSelected = newValue;
        };
          
        /**
          * Create the primaryContentSubscription and sourceContentSubscription
          * drop down list
          */
        $scope.createLists = function(contentList){
        	angular.forEach(contentList, function (aContent){
                if(aContent.primarySubscription){
                   $scope.primaryContentList.push(aContent);
                }else if(aContent.sourceSubscription){
                   $scope.sourceContentList.push(aContent);
                }
            });
            angular.forEach($scope.primaryContentList, function (pContent){
                if(pContent.id === 128){
                    angular.copy(pContent, $scope.emmiEngagePlus);
                    $scope.emmiEngagePlus.name = 'EmmiEngage+';
                 }
            });
            $scope.primaryContentList.splice(1, 0, $scope.emmiEngagePlus);
            $scope.primaryContentList.push($scope.noneContent);
            angular.copy($scope.primaryContentList, $scope.latestPrimaryContentList);
            
         };
         
         $scope.initialAddSubscription = function(){
           $scope.setInitialAddAnotherContentSubscription(false);
      	   $scope.resetShowSelectList(true);
      	   angular.forEach($scope.selectedContentList, function (newContentSubscription){
      		  	 $scope.updateLatestPrimaryContentList(newContentSubscription);
  	       });
      	 
         };
         
         $scope.checkIfEmmiEngagePlus = function(newContent){
        	 $scope.isEmmiEngagePlus = false;
        	 if($scope.selectedContentList){
             	angular.forEach($scope.selectedContentList, function (aContent){
             		if(aContent.entity.contentSubscription !== null){
             			if(aContent.entity.contentSubscription.name === 'EmmiEngage+'){
             			  $scope.resetIsEmmiEngage(true);
             			}
             		}
          	    });
             }
        	 if((newContent.entity.contentSubscription !== null) &&
        		 (angular.isDefined(newContent.entity.contentSubscription.name))){
        	    if(newContent.entity.contentSubscription.name === 'EmmiEngage+'){
    			  $scope.resetIsEmmiEngage(true);
        	 }
  			}
         };
         
        /*
         * Separate the content subscription list 
         * that was selected from the database
         */
        $scope.separateSavedLists = function(contentList){
        	var emmiEngage = false;
            $scope.faithBased = true;
            angular.forEach(contentList, function (aContent){
                if(aContent.entity.contentSubscription.primarySubscription){
                	if(aContent.entity.contentSubscription.id === 128){
                    	angular.forEach(contentList, function (sourceContent){
                            if(sourceContent.entity.contentSubscription.sourceSubscription){
                            	angular.copy(sourceContent, $scope.selectedSourceContent);
                            	$scope.originalSourceContent = sourceContent;
                            	aContent.entity.contentSubscription.name = 'EmmiEngage+';
                            	$scope.dbEngageId = aContent.entity.id;
                            	emmiEngage = true;
                              }
                        });	
                    }
                    angular.copy(aContent, $scope.selectedContentSubscription);
                    $scope.selectedContentList.push(aContent);
                 }
            });
                angular.forEach($scope.selectedContentList, function (aContent){
            	$scope.updateLatestPrimaryContentList(aContent);
     	    });
            $scope.isEmmiEngagePlus = emmiEngage;
            $scope.dbEmmiEngagePlus = emmiEngage;
            $scope.loading = false;
      };

       $scope.getClientContentList = function(){
    	   $scope.resetList();
    	   angular.copy($scope.primaryContentList, $scope.latestPrimaryContentList);
    	   ContentSubscriptionConfigurationService.getClientContentSubscriptionConfiguration().then(function (response) {
               if(angular.isDefined(response.content)){
            	       if(response.content.length > 0){
                	   $scope.showSelectList  = false;
                	   $scope.initialAddAnotherContentSubscription = true;
                	   $scope.separateSavedLists(response.content);
                   }
               }
               else{
            	     $scope.selectedContentSubscription = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
            	     $scope.initialAddAnotherContentSubscription = false;
                     $scope.faithBased = false;
                     $scope.showSelectList  = true;
                     $scope.isEmmiEngagePlus = false;
                     $scope.loading = false;
               }
            });
        };
       
       $scope.$on('selectedContentList', function () {
    	   $scope.getClientContentList();
       });
       
       $scope.$on('startLoading', function () {
    	   $scope.loading = true;
       });
       
       /**
        * Listen on 'refreshClientProgramsPage' event
        */
       $scope.$on('refreshClientProgramsPage', function(){
           	$scope.$broadcast('refreshViewProgramsPage');
       });
     
        /**
         * init method called when page is loading
         */
       function init() {
    	    $scope.client = Client.getClient().entity;
            $scope.page.setTitle('Client Configurations - ' + $scope.client.name + ' | ClientManager');
            MainContentService.getContentSubscriptionList().then(function(response){
                $scope.createLists(response.content);
            });
            $scope.getClientContentList();
        }
        init();
    }]);

