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
                        
        // Variables for the html to show or hide certain section
        $scope.faithBased = false;
        $scope.initialAddAnotherContentSubscription = false;
        $scope.noneSelected = false;
        $scope.showSelectList = false;
        $scope.isEmmiEngagePlus = false;
        
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
  
       /**
         * Show/hide cancel and save buttons
         */
        $scope.showButtons = function (showButton) {
         	return ($scope.showContentButton = showButton);
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
          $scope.resetSelectedContentSubscription  = function (sourceContent, index) {
        	 var wasEngagePlus = false;
        	 console.log($scope.selectedContentSubscription);
        	 console.log($scope.selectedContentList);
        	 console.log(sourceContent);
        	 if(($scope.selectedContentSubscription.entity.contentSubscription !== null) &&
                     ($scope.selectedContentSubscription.entity.contentSubscription.name === 'EmmiEngage+')){
                 	wasEngagePlus = true;
          	    }
           	 $scope.selectedContentList[index] = sourceContent;
           	// $scope.selectedContentSubscription = sourceContent;
           	 
             return wasEngagePlus;        	 
           };
          
          $scope.resetIsEmmiEngage = function (newValue){
        	  $scope.isEmmiEngagePlus = newValue;
          };
          
          $scope.filterAgain = function (index) {
        	    return function (item) {
           //console.log(item);
          // console.log($scope.selectedContentList);
           //console.log(index);
           if($scope.selectedContentList.length > 0){
        	 	if(($scope.selectedContentSubscription.entity.contentSubscription !== null) &&
        	 		($scope.selectedContentList[index].entity.contentSubscription !== null)){
        	    	 if ($scope.selectedContentList[index].entity.contentSubscription.name === item.name){
        	    		// console.log($scope.selectedContentSubscription);
        	    		 //console.log(index);
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
        
        $scope.fetchLatestPrimaryContentList = function(){
            console.log($scope.selectedContentList.length);
            console.log($scope.selectedContentList);
            console.log($scope.selectedContentSubscription);
        	if(($scope.selectedContentList.length === 1) &&
        	   ($scope.selectedContentList[0].entity.contentSubscription === null)){
        		console.log(' not thing needs to do');
        		//$scope.getClientContentList();
        		$scope.selectedContentSubscription.entity = $scope.selectedContentList[0].entity;
        		console.log($scope.selectedContentSubscription);
        		//$scope.selectedContentSubscription.entity.faithBased = $scope.selectedContentList[0].entity.faithBased;
        		$scope.selectedContentList = [];
         	   $scope.latestPrimaryContentList = [];
         	   $scope.isEmmiEngagePlus = false;
         	   angular.copy($scope.primaryContentList, $scope.latestPrimaryContentList);
        		//angular.copy($scope.primaryContentList, $scope.latestPrimaryContentList);
        		
        		$scope.initialAddAnotherContentSubscription = false;
        		$scope.$broadcast('event:reset-add-another-content');
        		
                $scope.showSelectList  = true;
                $scope.isEmmiEngagePlus = false;
                console.log($scope.selectedContentSubscription);
        		// $scope.selectedContentList.push($scope.selectedContentSubscription);
        	}
            else{
            	var checkEngagePlus = false;
	    	    angular.forEach($scope.selectedContentList, function (aContent){
 	    		  console.log(aContent);
 	    		  if(aContent.entity.contentSubscription !== null){
           			if(aContent.entity.contentSubscription.id === 128){
           				if(angular.isDefined($scope.selectedSourceContent.entity.id)){
           					//angular.copy(sourceContent, $scope.selectedSourceContent);
                        	$scope.originalSourceContent = $scope.selectedSourceContent;
           					aContent.entity.contentSubscription.name = 'EmmiEngage+';
           					checkEngagePlus = true;
           				}
           			}
 	    		  }
       	   	    });
	    	    console.log($scope.selectedSourceContent);
	    	    $scope.isEmmiEngagePlus = checkEngagePlus;
        	}
 	    	console.log($scope.latestPrimaryContentList);

        };
        
        /*
         * update latest primary content list
         */
        $scope.updateLatestPrimaryContentList = function(aContent){
        	console.log(aContent);
        	$scope.latestPrimaryContentList = 
        		ContentSubscriptionConfigurationService.filterLatestPrimaryContentList($scope.latestPrimaryContentList, aContent, $scope.selectedContentList.length);
           console.log($scope.latestPrimaryContentList);
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
        	 console.log('im initila add');
           $scope.setInitialAddAnotherContentSubscription(false);
      	   $scope.resetShowSelectList(true);
      	   angular.forEach($scope.selectedContentList, function (newContentSubscription){
      		  	 $scope.updateLatestPrimaryContentList(newContentSubscription);
  	       });
      	 
         };
         
         $scope.checkIfEmmiEngagePlus = function(newContent){
        	 $scope.isEmmiEngagePlus = false;
        	console.log(newContent);
        	//console.log(index);
        	console.log($scope.selectedContentList);
        	 if($scope.selectedContentList){
             	angular.forEach($scope.selectedContentList, function (aContent){
             		if(aContent.entity.contentSubscription !== null){
             			if(aContent.entity.contentSubscription.name === 'EmmiEngage+'){
             			  $scope.resetIsEmmiEngage(true);
             			  console.log('emmiEnage++');
             			}
             		}
          	    });
             }
        	 if((newContent.entity.contentSubscription !== null) &&
        		 (angular.isDefined(newContent.entity.contentSubscription.name))){
        	    if(newContent.entity.contentSubscription.name === 'EmmiEngage+'){
    			  $scope.resetIsEmmiEngage(true);
    			  console.log('emmiEnage++ new Contetn');
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
       };

       $scope.getClientContentList = function(){
    	   $scope.selectedContentList = [];
    	   $scope.latestPrimaryContentList = [];
    	   $scope.isEmmiEngagePlus = false;
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
               }
            });
        };
       
       $scope.$on('selectedContentList', function () {
    	   $scope.getClientContentList();
       });
       
       $scope.$on('startLoading', function () {
    	   $scope.loading = true;
       });
       
       $scope.$on('finishLoading', function () {
    	   $scope.loading = false;
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

