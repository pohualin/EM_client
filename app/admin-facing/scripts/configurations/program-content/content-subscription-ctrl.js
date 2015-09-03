'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientProgramContentConfiguration page
 */
    .controller('ClientProgramContentConfigurationController', ['$alert', '$scope', '$controller', 'clientResource', 'Client', 'ContentSubscriptionConfigurationService',
        function ($alert, $scope, $controller, clientResource, Client, ContentSubscriptionConfigurationService) {
        $scope.faithBased = false;
        $scope.sourceProgram = false;
        $scope.primaryContentList = [];
        $scope.sourceContentList = [];
        $scope.showContentButton = false;
        $scope.selectedSourceContent = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
        $scope.emmiEngagePlus = {};
        $scope.noneContent = {name:'None', id:0};
        $scope.deleteContentSubscription = false;
       
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
                if($scope.selectedContentSubscription.entity.contentSubscription.name === 'None'){
                    $scope.deleteContentSubscription();
                }
                else if(angular.isDefined($scope.selectedContentSubscription.entity.id)){
                    $scope.updateContentSubscription();
                }
                else{
                    $scope.createContentSubscription();    
                }
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
        $scope.deleteContentSubscription = function(){
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
        $scope.updateContentSubscription = function(){
            var toBeCreateContent = {};
            var emmiEngage = false;
            angular.copy($scope.selectedContentSubscription, toBeCreateContent);
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
        $scope.createContentSubscription = function(){
            var toBeCreateContent = {};
            var emmiEngage = false;
            angular.copy($scope.selectedContentSubscription, toBeCreateContent);
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
        };
        
        $scope.seperateSavedLists = function(contentList){
            var emmiEngage = false;
            angular.forEach(contentList, function (aContent){
                if(aContent.entity.contentSubscription.primarySubscription){
                    angular.copy($scope.selectedContentSubscription, aContent);
                    if($scope.selectedContentSubscription.entity.contentSubscription.id === 128){
                       emmiEngage = true;
                    }
                    
                }
            });
            angular.forEach(contentList, function (aContent){
                if((aContent.entity.contentSubscription.sourceSubscription) &&
                    (emmiEngage)){
                    $scope.selectedSourceContent = aContent.entity.contentSubscription;
                    $scope.sourceProgram = true;
                    $scope.selectedContentSubscription.entity.contentSubscription.name = 'EmmiEngage+';
                }
            });
        };
        
        $scope.onChangePrimaryList = function(){
            $scope.showButtons(true);
            if($scope.selectedContentSubscription.entity.contentSubscription.name === 'None'){
            	$scope.faithBased = false;
            	$scope.sourceProgram = false;
            	$scope.selectedContentSubscription.entity.faithBased = false;
            }
            else if($scope.selectedContentSubscription.entity.contentSubscription.name === 'EmmiEngage+'){
               $scope.faithBased = true;
               $scope.sourceProgram = true;
            }
            else{
            	$scope.faithBased = true;
                $scope.sourceProgram = false;
            }
       };
       
       $scope.onChange = function(){
    	   $scope.showButtons(true);
           
       };
       
       // Will implement for story 1307 multiple content subscriptions
       $scope.addAnotherSubscription = function(){
           $scope.showContentButton = true;
       };
       
        /**
         * init method called when page is loading
         */
       function init() {
            $scope.client = Client.getClient().entity;
            $scope.page.setTitle('Client Configurations - ' + $scope.client.name + ' | ClientManager');
            ContentSubscriptionConfigurationService.getContentSubscriptionList().then(function(response){
                $scope.primaryContentList = [];
                $scope.sourceContentList = [];
                $scope.createLists(response.content);
            });
            ContentSubscriptionConfigurationService.getContentSubscriptionConfiguration().then(function (response) {
                $scope.originalContentSubscriptionConfiguration = response.content;
                if(angular.isDefined(response.content)){
                    // Needs to restructure this for the next multiple content subscriptions story EM-1307
                    if(response.content.length > 1){
                        $scope.seperateSavedLists(response.content);
                    }
                    else{
                        $scope.selectedContentSubscription = $scope.originalContentSubscriptionConfiguration[0];
                    }
                }
                else{
                      $scope.selectedContentSubscription = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
                }
   
            });
        }
        init();
    }]);

