'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for ContentSubscriptionConfiguration resources
 */
    .service('ContentSubscriptionConfigurationService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            return {
                                       
                /**
                 * Get ContentSubscriptionConfiguration by Client
                 */
                getClientContentSubscriptionConfiguration: function () {
                    return $http.get(UriTemplate.create(Client.getClient().link.clientContentSubscriptionConfigurations).stringify())
                        .then(function (response) {
                        	CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Return an empty ContentSubscriptionConfiguration
                 */
                createContentSubscriptionConfiguration: function () {
                    return {
                        entity: {
                            contentSubscription: {},
                            faithBased: false,
                         }
                    };
                },
                
                /**
                 * Delete single ContentSubscriptionConfigurationService
                 * 
                 */
                deleteContent: function(deleteContentSubscription){
                	return $http.delete(UriTemplate.create(deleteContentSubscription.link.self)
                			.stringify()).then();
                },
                
                /**
                 * Create ContentSubscriptionConfiguration for a Client
                 * @param contentSubscriptionConfiguration to create for a client
                 * 
                 */
                create: function(selectedContentSubscription){
                	return $http.post(UriTemplate.create(Client.getClient().link.clientContentSubscriptionConfigurations).stringify(), 
                            selectedContentSubscription.entity, {override500: true})
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Update ContentSubscriptionConfiguration for a Client
                 * @param contentSubscriptionConfiguration to update for a client
                 * 
                 */
                update: function(updateContentSubscription){
                    return $http.put(UriTemplate.create(updateContentSubscription.link.self).stringify(), 
                            updateContentSubscription.entity, {override500: true})
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                }, 
                
               
                
                /**
                 * Save one or more selected content subscription
                 * 
                 * @param contentSubscriptionList to create/delete/update 
                 * @param faithBased
                 * @returns {*} a promise
                 */
                saveAll: function (contentSubscriptionList, faithBased) {
                    var self = this;
                    var deferred = $q.defer();
                    var saveRequests = [];
                    angular.forEach(contentSubscriptionList, function (aNewContent){
                    	var deferred = $q.defer();
                    		if((angular.isDefined(aNewContent.entity.id)) &&
                    				(aNewContent.entity.contentSubscription === null)){
                       			self.deleteContent(aNewContent).then(function(response){
                    			deferred.resolve(response);
               				});
                    		}
                    		else if(angular.isDefined(aNewContent.entity.id)){
                    			
                    			aNewContent.entity.faithBased = faithBased;
                    			self.update(aNewContent).then(function(response){
                    				deferred.resolve(response);	
                    	    });
                    		}
                    		else if(angular.isDefined(aNewContent.entity.contentSubscription.id)){
                    			
                    			aNewContent.entity.faithBased = faithBased;
                    			self.create(aNewContent).then(function(response){
                    				deferred.resolve(response);
                    	    });
                    		} 
                       		saveRequests.push(deferred.promise);
              		});
                     $q.all(saveRequests).then(function(response){
                        deferred.resolve(response);
                    });
                    return deferred.promise;
                },
          
                
                /*
                 * Filter the primary content list based from the requirement
                 */    
                filterLatestPrimaryContentList: function(latestContentList, newContentSubscription, selectedContentLength){
                 var newPrimaryList = [];
             	 if(angular.isDefined(newContentSubscription.entity.contentSubscription !== null)){
             	   if(newContentSubscription.entity.contentSubscription.name !== 'None'){
             		  angular.forEach(latestContentList, function (aContent, index){
            			   if(aContent.id === 0){
            				  latestContentList.splice(index,1);
                			   
                		   }
            		   });
             	   }
             	   if(newContentSubscription.entity.contentSubscription.id === 128){
             		  angular.forEach(latestContentList, function (aContent){
             			   if(aContent.id === 124){
                    		   	  newPrimaryList.push(aContent);
         				   }
                    	   });
              		   latestContentList = [];
             		   angular.copy(newPrimaryList, latestContentList);
              	   }
             	  else if((newContentSubscription.entity.contentSubscription.id === 124) &&
            			   (selectedContentLength > 1)){
            		 angular.forEach(latestContentList, function (aContent, index){
            			   if(aContent.id === 128){
            				  latestContentList.splice(index,1);
                			   
                		   }
            			   if(angular.equals(aContent.id, newContentSubscription.entity.contentSubscription.id)){
            				  latestContentList.splice(index,1);
            			   }
                	   });  
               	   } 
             	   else if((newContentSubscription.entity.contentSubscription.id !== 124) &&
                 		   (newContentSubscription.entity.contentSubscription.id !== 128)){
             		 angular.forEach(latestContentList, function (aContent, index){
                 		   if(aContent.id === 128){
         		   				latestContentList.splice(index,2);
         		   			}
         		   			if(angular.equals(aContent.id, newContentSubscription.entity.contentSubscription.id)){
         		   			  latestContentList.splice(index,1);
         		   			}
         		   		});  
         	   
         	       } 
             	   else{
             		   angular.forEach(latestContentList, function (aContent, index){
             			   if(angular.equals(aContent.id, newContentSubscription.entity.contentSubscription.id)){
             			     latestContentList.splice(index,1);
             			   }
             		   });
             	   }
               }
             	   return latestContentList;
               }
                
            };
        }])
;
