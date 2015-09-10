'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientProgramContentConfiguration page
 */
    .controller('ClientProgramContentConfigurationController', ['$alert', '$scope', '$controller', 'clientResource', 'Client', 'ContentSubscriptionConfigurationService',
        function ($alert, $scope, $controller, clientResource, Client, ContentSubscriptionConfigurationService) {
       
    	// Store the original content subscription list
        $scope.primaryContentList = [];
        $scope.sourceContentList = [];
        $scope.originalContentSubscriptionConfiguration = [];
                 
        // Variables for the html to show or hide certain section
        $scope.faithBased = false;
        $scope.showContentButton = false;
        $scope.addAnotherContentSubscription = false;
        $scope.initialAddAnotherContentSubscription = false;
        $scope.newSelectList = false;
        
        $scope.emmiEngagePlus = {};
        $scope.noneContent = {name:'None', id:0};
        $scope.selectedSourceContent = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.selectedContentSubscription = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.selectedContentList = [];
        $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        
               
        /**
         * Cancel any changes
         */
        $scope.cancel = function (contentSubscriptionForm) {
            contentSubscriptionForm.$setPristine();
            $scope.contentSubscriptionFormSubmitted = false;
            $scope.showButtons(false);
        };
        
        /**
         * Save content subscription configuration for the client
         */
        $scope.save = function(valid){
            $scope.contentSubscriptionFormSubmitted = true;          
            if(valid){
                $scope.whenSaving = true;
                $scope.filterSaveList();
                $scope.initialAddAnotherContentSubscription = true;
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
        
        $scope.filterSaveList = function(){
        	var notInList = true;
        	
            if((angular.isDefined($scope.contentSubscriptionHolder)) &&
               (angular.isDefined($scope.contentSubscriptionHolder.entity.contentSubscription))){
            	angular.forEach($scope.selectedContentList, function (aContent){
            		if(angular.equals(aContent.id, $scope.contentSubscriptionHolder.entity.contentSubscription.id)){
            			notInList = false; 			
            		}
            	});
            }
            if(notInList){
            	$scope.selectedContentList.push($scope.contentSubscriptionHolder);
            	
            	$scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
            }
       		angular.forEach($scope.selectedContentList, function (aNewContent){
       			if((angular.isDefined(aNewContent.entity.id)) &&
       			   (aNewContent.entity.contentSubscription === null)){
       				$scope.deleteContentSubscription(aNewContent);
       			}
      			else if(angular.isDefined(aNewContent.entity.id)){
   					$scope.updateContentSubscription(aNewContent);
   				}
       			else if(angular.isDefined(aNewContent.entity.contentSubscription.id)){
               		$scope.createContentSubscription(aNewContent);
               	} 
       		});
       };
        
        /**
         * Delete the Content Subscriptions for a Client
         */
        $scope.deleteContentSubscription = function(aContent){
        	ContentSubscriptionConfigurationService.deleteContent(aContent).then(function(response){
            $alert({
                content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
            });
            }).finally(function () {
            	$scope.reset();
            });
        };
        
        /**
         * Update a Content Subscription for a Client
         */
        $scope.updateContentSubscription = function(aContent){
            var toBeCreateContent = {};
            var emmiEngage = false;
            angular.copy(aContent, toBeCreateContent);
            if(toBeCreateContent.entity.contentSubscription.name === 'EmmiEngage+'){
                emmiEngage = true;
                toBeCreateContent.entity.contentSubscription.name = 'EmmiEngage';
                if(angular.isDefined($scope.selectedSourceContent)){
                     ContentSubscriptionConfigurationService.create($scope.selectedSourceContent).then(function(response){
                         angular.copy(response, $scope.selectedSourceContent);
                      });
                  }
            }
            ContentSubscriptionConfigurationService.update(toBeCreateContent).then(function(response){
            angular.copy(response, $scope.selectedContentSubscription);
            if(emmiEngage){
            	$scope.selectedContentSubscription.entity.contentSubscription.name = 'EmmiEngage+';
            }
            $alert({
            content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
            });
            }).finally(function () {
            	$scope.reset();
            });
        };
         
        /**
         * Create the Content Subscription for a Client
         */
        $scope.createContentSubscription = function(aContent){
            var toBeCreateContent = {};
            var emmiEngage = false;
            angular.copy(aContent, toBeCreateContent);
            if(toBeCreateContent.entity.contentSubscription.name === 'EmmiEngage+'){
            	emmiEngage = true;
                toBeCreateContent.entity.contentSubscription.name = 'EmmiEngage';
                if(angular.isDefined($scope.selectedSourceContent)){
                     ContentSubscriptionConfigurationService.create($scope.selectedSourceContent).then(function(response){
                          angular.copy(response, $scope.selectedSourceContent);
                      });
                  }
              }
              ContentSubscriptionConfigurationService.create(toBeCreateContent).then(function(response){
              angular.copy(response, $scope.selectedContentSubscription);
              if(emmiEngage){
                 	$scope.selectedContentSubscription.entity.contentSubscription.name = 'EmmiEngage+';
              }
              $alert({
                  content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
              });
              }).finally(function () {
            	 $scope.reset();
              });
        };
        
        $scope.reset = function(){
        	$scope.newSelectList = false;
       	  	$scope.whenSaving = false;
       	  	$scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
         	$scope.showButtons(false);
        };
       
        /**
         * Show/hide cancel and save buttons
         */
        $scope.showButtons = function (showButton) {
        	return ($scope.showContentButton = showButton);
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
            $scope.primaryContentList.splice(0, 0, $scope.emmiEngagePlus);
            $scope.primaryContentList.push($scope.noneContent);
            angular.copy($scope.primaryContentList, $scope.latestPrimaryContentList);
            
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
                	angular.copy(aContent, $scope.selectedContentSubscription);
                    if(aContent.entity.contentSubscription.id === 128){
                    	angular.forEach(contentList, function (sourceContent){
                            if(sourceContent.entity.contentSubscription.sourceSubscription){
                            	angular.copy(sourceContent, $scope.selectedSourceContent);
                            	aContent.entity.contentSubscription.name = 'EmmiEngage+';
                              }
                        });	
                    }
                    $scope.selectedContentList.push(aContent);
                    $scope.addNewContentSubscription = true;
                 }
            });
            $scope.initialAddAnotherContentSubscription = true;
            angular.forEach($scope.selectedContentList, function (aContent){
     		    $scope.filterLatestPrimaryContentList(aContent);
     	    });
        };
        
        $scope.onChangeSelectedPrimaryList = function(){
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
                   
        $scope.onChangePrimaryList = function(){
          	if(angular.isDefined($scope.contentSubscriptionHolder.entity.contentSubscription)){
          		if($scope.contentSubscriptionHolder.entity.contentSubscription.name === 'None'){
                	$scope.faithBased = false;
                	$scope.contentSubscriptionHolder.entity.faithBased = false;
                	$scope.showButtons(false);
                }
                else{
                	$scope.faithBased = true;
                    $scope.showButtons(true);
                    if($scope.latestPrimaryContentList.length > 0){
                    	$scope.addAnotherContentSubscription = true;
                    }
                }
         	}
        };
           
       /*
        * Filter the primary content list based from the requirement
        */    
       $scope.filterLatestPrimaryContentList = function(newContentSubscription){
    	   var newPrimaryList = [];
    	   if(newContentSubscription.entity.contentSubscription.name !== 'None'){
    		   angular.forEach($scope.latestPrimaryContentList, function (aContent, index){
    			   if(aContent.id === 0){
        			  $scope.latestPrimaryContentList.splice(index,1);
        			   
        		   }
    		   });
    	   }
    	   if(newContentSubscription.entity.contentSubscription.id === 128){
     		   angular.forEach($scope.latestPrimaryContentList, function (aContent){
    			   if(aContent.id === 124){
           		   	  newPrimaryList.push(aContent);
				   }
           	   });
    		   $scope.latestPrimaryContentList = [];
    		   angular.copy(newPrimaryList, $scope.latestPrimaryContentList);
     	   }
    	   else if((newContentSubscription.entity.contentSubscription.id !== 124) &&
        		   (newContentSubscription.entity.contentSubscription.id !== 128)){
        	 angular.forEach($scope.latestPrimaryContentList, function (aContent, index){
		   			if(aContent.id === 128){
		   				$scope.latestPrimaryContentList.splice(index,1);
		   			}
		   			if(angular.equals(aContent.id, newContentSubscription.entity.contentSubscription.id)){
		   				$scope.latestPrimaryContentList.splice(index,1);
		   			}
		   		});  
	   
	       } 
    	   else if((newContentSubscription.entity.contentSubscription.id === 124) &&
    			   ($scope.selectedContentList.length > 1)){
    		   angular.forEach($scope.latestPrimaryContentList, function (aContent, index){
    			   if(aContent.id === 128){
        			  $scope.latestPrimaryContentList.splice(index,1);
        			   
        		   }
    			   if(angular.equals(aContent.id, newContentSubscription.entity.contentSubscription.id)){
    				   $scope.latestPrimaryContentList.splice(index,1);
    			   }
        	   });  
       	   } 
    	   else{
    		   angular.forEach($scope.latestPrimaryContentList, function (aContent, index){
    			   if(angular.equals(aContent.id, newContentSubscription.entity.contentSubscription.id)){
    				  $scope.latestPrimaryContentList.splice(index,1);
    			   }
    		   });
    	   }
      };
       
       /* 
        * Added another content subscription for a client
        * push the new content subscription to the selectedContentList
        */
       $scope.addAnotherSubscription = function(newContentSubscription){
    	   $scope.initialAddAnotherContentSubscription = false;
    	   $scope.selectedContentList.push(newContentSubscription);
    	   $scope.filterLatestPrimaryContentList(newContentSubscription);
    	   $scope.addAnotherContentSubscription = false;
    	   $scope.newSelectList = true;
    	   $scope.showButtons(true);
           $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
       };
       
       $scope.initialAddSubscription = function(){
    	   $scope.initialAddAnotherContentSubscription = false;
    	   $scope.newSelectList = true;
           $scope.contentSubscriptionHolder = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
       };
       
       $scope.onChangeFaithBased = function(faithBased){
    	   angular.forEach($scope.selectedContentList, function (aContent){
    		   aContent.entity.faithBased = faithBased;
       	   });
    	   $scope.showButtons(true);
       };
       
        /**
         * init method called when page is loading
         */
       function init() {
    	    $scope.client = Client.getClient().entity;
            $scope.page.setTitle('Client Configurations - ' + $scope.client.name + ' | ClientManager');
            ContentSubscriptionConfigurationService.getContentSubscriptionList().then(function(response){
                $scope.primaryContentList = [];
                $scope.latestPrimaryContentList = [];
                $scope.sourceContentList = [];
                $scope.createLists(response.content);
            });
            ContentSubscriptionConfigurationService.getContentSubscriptionConfiguration().then(function (response) {
                if(angular.isDefined(response.content)){
                    if(response.content.length > 0){
                    	$scope.separateSavedLists(response.content);
                    }
                    angular.copy(response.content, $scope.originalContentSubscriptionConfiguration);
                }
                else{
                      $scope.selectedContentSubscription = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
                      $scope.newSelectList = true;
                }
             });
        }
        init();
    }]);

