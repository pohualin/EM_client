'use strict';
angular.module('emmiManager')

/**
 * Service for Secret Question Responses
 */
    .service('SecretQuestionService', ['$http', 'UriTemplate','$q', 'Session', 'API',
        function ($http, UriTemplate, $q, Session, API) {
            return {
            
                /**
                 * Calls the back end get Secret Questions list
                 *
                 * @returns All available secret question
                 */
                getSecretQuestions: function () {
                   return $http.get(API.secretQuestions);
                },
                
                /**
                 * Creates a new object for the response
                 */
                createNewResponse: function () {
                	return {
            		   	entity:{
            		   		secretQuestion:null,
					 		response:null
					 	}
                	};
                },
            
                              
                /**
                 * Calls the back end to get all question and responses with asterisks                 *
                 * @param client user id
                 * @returns all questions and the responses with asterisks
                 */
                getAllUserSecretQuestionAsteriskResponse: function() {
                	return $http.get(UriTemplate.create(Session.link.secretQuestionAsteriskResponses).stringify({size: 2}))
                    		.then(function(response) {
                            return response;
                        });
                },
                		       

                         		      
                 /**
                 * Calls the back end to get all question and response for a client user
                 *
                 * @param client user id
                 * @returns all questions and responses for a client user
                 */
                getAllUserSecretQuestionResponse: function(password) {
                	            
                	    return $http.get(UriTemplate.create(Session.link.secretQuestionResponses).stringify({size: 2, password: password}),
                    		{override403: true})
                    		.then(function(response) {
                            return response;
                        });
                },
                
                /**
                 * Calls the back end to save or update a client user's question and responses
                 * @param userClientSecretQuestionRepsonse
                 * @returns the promise
                 */
                saveOrUpdateSecretQuestionResponse: function(userClientSecretQuestionRepsonse1, userClientSecretQuestionRepsonse2) {
                	var deferred = $q.defer();
                	var promise1 = $http.post(UriTemplate.create(Session.link.secretQuestionResponses)
                    		.stringify(), userClientSecretQuestionRepsonse1);                            
                            
                	
                	var promise2 = $http.post(UriTemplate.create(Session.link.secretQuestionResponses)
                    		.stringify(), userClientSecretQuestionRepsonse2);                             
                            
                            
                	$q.all([promise1, promise2])
                	.then(
                		 function(result){
                	     deferred.resolve(result);
                	     var secretQuestionsCreated = true;
                	     $http.put(UriTemplate.create(Session.link.updateUserClientSecretQuestionFlag).stringify({secretQuestionsCreated: secretQuestionsCreated}))
                				.then(function(response){
                					deferred.resolve(response.data);
                				});
                		 });
                                     	
                		return deferred.promise;
             }
          };
        }
    ])
;
