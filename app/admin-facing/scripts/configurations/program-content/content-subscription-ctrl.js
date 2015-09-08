'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientProgramContentConfiguration page
 */
    .controller('ClientProgramContentConfigurationController', ['$alert', '$scope', '$controller', 'clientResource', 'Client', 'ContentSubscriptionConfigurationService',
        function ($alert, $scope, $controller, clientResource, Client, ContentSubscriptionConfigurationService) {
        $scope.faithBased = false;
        $scope.sourceProgram = false;
        $scope.selectedSourceProgram = false;
        $scope.primaryContentList = [];
        $scope.sourceContentList = [];
        $scope.showContentButton = false;
        $scope.selectedSourceContent = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.emmiEngagePlus = {};
        $scope.noneContent = {name:'None', id:0};
        $scope.selectedContentSubscription = {};
        $scope.selectedContentList = [];
        $scope.selectedSourceContentList = [];
        $scope.contentSubscriptionHolder = {};
        $scope.sourceContentSubscriptionHolder = {};
        $scope.addAnotherContentSubscription = false;
               
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
            console.log($scope.contentSubscriptionHolder);
            if(angular.isDefined($scope.contentSubscriptionHolder)){
            	$scope.selectedContentList.push($scope.contentSubscriptionHolder);
            }
            if(angular.isDefined($scope.sourceContentSubscriptionHolder)){
            	console.log($scope.sourceContentSubscriptionHolder);
            	console.log('there is spurcrerw');
            	$scope.selectedContentList.push($scope.sourceContentSubscriptionHolder);
            }
            if(valid){
                $scope.whenSaving = true;
                angular.forEach($scope.selectedContentList, function (aContent){
                	if(aContent.entity.contentSubscription.name === 'None'){
                		$scope.deleteContentSubscription(aContent);
                	}
                   	else if(angular.isDefined(aContent.entity.id)){
                		$scope.updateContentSubscription(aContent);
                	}
                	else{
                		$scope.createContentSubscription(aContent);    
                	}
                });
                $scope.addAnotherContentSubscription = false;
                $scope.contentSubscriptionHolder = {};
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
        
        /**
         * Delete the Content Subscriptions for a Client
         */
        $scope.deleteContentSubscription = function(aContent){
            ContentSubscriptionConfigurationService.deleteContent().then(function(response){
            init();
            $alert({
                content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
            });
            }).finally(function () {
                $scope.whenSaving = false;
                $scope.showButtons(false);
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
                $scope.whenSaving = false;
                emmiEngage = false;
                $scope.showButtons(false);
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
                  $scope.whenSaving = false;
                  $scope.showButtons(false);
              });
        };
       
        /**
         * Show/hide cancel and save buttons
         */
        $scope.showButtons = function (showButton) {
            return ($scope.showContentButton = showButton);
         };
        
        $scope.createLists = function(contentList){
        	console.log('at create list +++++++');
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
        
        $scope.seperateSavedLists = function(contentList){
        	console.log('separate save list ++++++++++++');
            var emmiEngage = false;
            $scope.faithBased = true;
            angular.forEach(contentList, function (aContent){
                if(aContent.entity.contentSubscription.primarySubscription){
                	console.log('addind the list ');
                	console.log(aContent);
                	angular.copy(aContent, $scope.selectedContentSubscription);
                	
                    if(aContent.entity.contentSubscription.id === 128){
                    	angular.forEach(contentList, function (sourceContent){
                            if(sourceContent.entity.contentSubscription.sourceSubscription){
                            	angular.copy(sourceContent, $scope.selectedSourceContent);
                            	console.log(sourceContent);
                            	console.log($scope.selectedSourceContent);
                            	$scope.selectedSourceProgram = true;
                            	aContent.entity.contentSubscription.name = 'EmmiEngage+';
                            	$scope.selectedSourceContentList.push(sourceContent);
                            }
                        });	
                      
                    }
                    
                    $scope.selectedContentList.push(aContent);
                    $scope.addNewContentSubscription = true;
                 }
            });
            console.log($scope.selectedSourceProgram );
            console.log($scope.selectedSourceContentList);
            console.log($scope.selectedContentSubscription);
     	   console.log($scope.selectedContentList);  
        };
        
        $scope.onChangeSelectedPrimaryList = function(){
                      	console.log('change selected list');
            	if(angular.isDefined($scope.selectedContentSubscription.entity.contentSubscription)){
            		if($scope.selectedContentSubscription.entity.contentSubscription.name === 'None'){
                    	$scope.faithBased = false;
                    	$scope.selectedSourceProgram = false;
                    	$scope.selectedContentSubscription.entity.faithBased = false;
                    	$scope.showButtons(false);
                    }
                    else if($scope.selectedContentSubscription.entity.contentSubscription.name === 'EmmiEngage+'){
                       $scope.faithBased = true;
                       $scope.selectedSourceProgram = true;
                       $scope.showButtons(true);
                    }
                    else{
                    	$scope.faithBased = true;
                        $scope.selectedSourceProgram = false;
                        $scope.showButtons(true);
                    }
            	}
         };
                   
        $scope.onChangePrimaryList = function(){
        	console.log('change primary list');
        	         	
        	if(angular.isDefined($scope.contentSubscriptionHolder.entity.contentSubscription)){
        		if($scope.contentSubscriptionHolder.entity.contentSubscription.name === 'None'){
                	$scope.faithBased = false;
                	$scope.sourceProgram = false;
                	$scope.contentSubscriptionHolder.entity.faithBased = false;
                	$scope.showButtons(false);
                }
                else if($scope.contentSubscriptionHolder.entity.contentSubscription.name === 'EmmiEngage+'){
                   $scope.faithBased = true;
                   $scope.sourceProgram = true;
                   $scope.showButtons(true);
                   $scope.addAnotherContentSubscription = true;
                }
                else{
                	$scope.faithBased = true;
                    $scope.sourceProgram = false;
                    $scope.showButtons(true);
                    $scope.addAnotherContentSubscription = true;
                }
        	}
         	  /* angular.forEach($scope.latestPrimaryContentList, function (aContent, index){
         		   if(angular.equals(aContent.name, $scope.contentSubscriptionHolder.entity.contentSubscription.name)){
         			   console.log('equal++++++++++++++++++++++ ');
            		   $scope.latestPrimaryContentList.splice(index,1);
            	   }
         	   });*/
         	   console.log($scope.contentSubscriptionHolder);
         	console.log($scope.selectedContentSubscription);
      	   console.log($scope.selectedContentList);
      	   
      	
 
       };
       
       $scope.onChange = function(){
    	   $scope.showButtons(true);
           
       };
       
       // Will implement for story 1307 multiple content subscriptions
       $scope.addAnotherSubscription = function(newContent){
    	   console.log(newContent);
    	   console.log($scope.contentSubscriptionHolder);
    	   $scope.selectedContentList.push(newContent);
       	   angular.forEach($scope.latestPrimaryContentList, function (aContent, index){
       		   if(angular.equals(aContent.name, newContent.entity.contentSubscription.name)){
       			   console.log('equal++++++++++++++++++++++ ');
          		   $scope.latestPrimaryContentList.splice(index,1);
          	   }
       	   });
       	   console.log($scope.contentSubscriptionHolder);
       	console.log($scope.selectedContentSubscription);
    	   console.log($scope.selectedContentList);
    	   $scope.addAnotherContentSubscription = false;
           $scope.showContentButton = true;
           $scope.contentSubscriptionHolder = {};
       };
       
        /**
         * init method called when page is loading
         */
       function init() {
    	   console.log('at initt  ++++++++');
    	   console.log($scope.addAnotherContentSubscription);
            $scope.client = Client.getClient().entity;
            $scope.page.setTitle('Client Configurations - ' + $scope.client.name + ' | ClientManager');
            ContentSubscriptionConfigurationService.getContentSubscriptionList().then(function(response){
                $scope.primaryContentList = [];
                $scope.latestPrimaryContentList = [];
                $scope.sourceContentList = [];
                $scope.createLists(response.content);
            });
            ContentSubscriptionConfigurationService.getContentSubscriptionConfiguration().then(function (response) {
                $scope.originalContentSubscriptionConfiguration = response.content;
                if(angular.isDefined(response.content)){
                    // Needs to restructure this for the next multiple content subscriptions story EM-1307
                    if(response.content.length > 0){
                    	console.log(response.content.length);
                    	$scope.seperateSavedLists(response.content);
                    
                    }
                }
                else{
                      $scope.selectedContentSubscription = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
                }
   
            });
        }
        init();
    }]);

