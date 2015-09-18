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
        $scope.faithBased = true;
        $scope.initialAddAnotherContentSubscription = false;
        $scope.contentSubscriptionExist = false;
        $scope.noneSelected = false;
        $scope.showSelectList = false;
        $scope.emmiEngagePlus = false;
        
        $scope.emmiEngagePlus = {};
        $scope.noneContent = {name:'None', id:0};
        $scope.selectedSourceContent = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.selectedContentSubscription = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.selectedContentList = [];
        
               
        /**
         * Cancel any changes
         */
        $scope.cancel = function (contentSubscriptionForm) {
            contentSubscriptionForm.$setPristine();
            $scope.contentSubscriptionFormSubmitted = false;
            $scope.initialAddAnotherContentSubscription = true;
        	$scope.contentSubscriptionExist = false;
        	$scope.showSelectList  = false;
       	  	$scope.whenSaving = false;
       	   	$scope.showButtons(false);
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
                            	aContent.entity.contentSubscription.name = 'EmmiEngage+';
                            	emmiEngage = true;
                              }
                        });	
                    }
                    angular.copy(aContent, $scope.selectedContentSubscription);
                    $scope.selectedContentList.push(aContent);
                    $scope.addNewContentSubscription = true;
                 }
            });
            $scope.initialAddAnotherContentSubscription = true;
            angular.forEach($scope.selectedContentList, function (aContent){
            	$scope.latestPrimaryContentList = ContentSubscriptionConfigurationService.filterLatestPrimaryContentList($scope.latestPrimaryContentList, aContent, $scope.selectedContentList.length);
     	    });
            $scope.emmiEngagePlus = emmiEngage;
       };

       $scope.getClientContentList = function(){
    	   $scope.selectedContentList = [];
    	   ContentSubscriptionConfigurationService.getClientContentSubscriptionConfiguration().then(function (response) {
               if(angular.isDefined(response.content)){
                   if(response.content.length > 0){
                	  	$scope.contentSubscriptionExist = true;
                   	    $scope.separateSavedLists(response.content);
                   }
               }
               else{
                     $scope.selectedContentSubscription = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
                     $scope.contentSubscriptionExist = false;
                     $scope.showSelectList  = true;
                     $scope.emmiEngagePlus = false;
                }
            }); 
       };
       
       $scope.$on('selectedContentList', function () {
    	   $scope.$broadcast('refreshSelectedContentList');
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

