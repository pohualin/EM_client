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
        $scope.selectedSourceContent = [];
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
                if($scope.deleteContentSubscription){
                    ContentSubscriptionConfigurationService.deleteContent($scope.selectedContentSubscription).then(function(response){
                    $alert({
                        content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                    });
                    }).finally(function () {
                        $scope.whenSaving = false;
                    });
                }
                else{
                      if($scope.selectedContentSubscription.entity.contentSubscription.id === 1288){
                      $scope.selectedContentSubscription.entity.contentSubscription.id = 128;
                      $scope.selectedContentSubscription.entity.contentSubscription.name = 'EmmiEngage';
                      }
                      ContentSubscriptionConfigurationService.saveOrUpdate($scope.selectedContentSubscription).then(function(response){
                      $alert({
                          content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                      });
                      }).finally(function () {
                          $scope.whenSaving = false;
                      });
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
         * Show/hide cancel and save buttons
         */
        $scope.showButtons = function (showButton) {
            return ($scope.showContentButton = showButton);
         };
        
        $scope.createLists = function(contentList){
            angular.forEach(contentList, function (aContent){
                if(aContent.primarySbscrptn){
                   $scope.primaryContentList.push(aContent);
                }else if(aContent.sourceSbscrptn){
                   $scope.sourceContentList.push(aContent);
                }
            });
            
            angular.forEach($scope.primaryContentList, function (pContent){
                if(pContent.id === 128){
                    angular.copy(pContent, $scope.emmiEngagePlus);
                    $scope.emmiEngagePlus.id = 1288;
                    $scope.emmiEngagePlus.name = 'EmmiEngage+';
                 }
            });
            $scope.primaryContentList.splice(0, 0, $scope.emmiEngagePlus);
            
            $scope.primaryContentList.push($scope.noneContent);
        };
        
        $scope.onChangePrimaryList = function(contentSubscriptionForm){
            $scope.showContentButton = true;
            if($scope.selectedContentSubscription.entity.contentSubscription.name === 'None'){
                $scope.deleteContentSubscription = true;
                $scope.faithBased = false;
                $scope.sourceProgram = false;
            }
            else if(($scope.selectedContentSubscription.entity.contentSubscription.id === 1288) &&
                ($scope.selectedContentSubscription.entity.contentSubscription.name === 'EmmiEngage+')){
                $scope.faithBased = true;
                $scope.sourceProgram = true;
            }
            else if($scope.selectedContentSubscription.entity.contentSubscription.id === 128){
                $scope.faithBased = true;
                $scope.sourceProgram = false;
            }
            else{
                $scope.faithBased = false;
                $scope.sourceProgram = false;
            }
        };
       
       $scope.onChangeFaithBased = function(){
           $scope.showContentButton = true;
           
       };
       
       $scope.onChangeSourceList = function(){
           $scope.showContentButton = true;
           if(angular.isDefined($scope.selectedSourceContent)){
                $scope.selectedContentSubscription.entity.source = true;
               
           }
           
           
       };
       
       // Will implement for story 1307
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
                $scope.contentSubscriptions = response.content;
                $scope.createLists(response.content);
                 
            });
            ContentSubscriptionConfigurationService.getContentSubscriptionConfiguration().then(function (response) {
                
                $scope.originalContentSubscriptionConfiguration = response.content;
                if(angular.isDefined(response.content)){
                    $scope.selectedContentSubscription = $scope.originalContentSubscriptionConfiguration[0];
                    if(($scope.selectedContentSubscription.entity.contentSubscription.id === 128) ||
                        ($scope.selectedContentSubscription.entity.contentSubscription.id === 1288)){
  
                        $scope.faithBased = $scope.selectedContentSubscription.entity.faithBased;
                        $scope.selectedSourceContent = $scope.selectedContentSubscription.entity.source;
                        if($scope.selectedContentSubscription.entity.source){
                            $scope.selectedContentSubscription.entity.contentSubscription.id = 1288;
                            $scope.selectedContentSubscription.entity.contentSubscription.name = 'EmmiEngage+';
                            $scope.sourceProgram = true;
                        }
                       
                    }
                   
                }
                else{
                    $scope.selectedContentSubscription = ContentSubscriptionConfigurationService.createContentSubscriptionConfiguration();
                }
   
            });
 
       }

        init();
    }]);

