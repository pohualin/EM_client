'use strict';
angular.module('emmiManager')

/**
 * Service for Secret Question Responses
 */
    .service('SecretQuestionService', ['$http', 'UriTemplate', 'Session', 
        function ($http, UriTemplate, Session) {
            return {

                /**
                 * Calls the back end get Secret Questions list
                 *
                 * @returns All available secret question
                 */
                getSecretQuestions: function () {
                    return $http.get(UriTemplate.create(Session.link.secretQuestions).stringify())
                    .then(function (response) {
                            return response;
                        });
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
                	}
                },
                
                /**
                 * Calls the back end to get the secret question response for a question id
                 *
                 * @param question id
                 * @returns a secretQuestionsResponses for a question id
                 */
                getOneSecretQuestionResponse: function(id) {
                    return $http.get(UriTemplate.create(Session.link.secretQuestionResponses)
                    		.stringify({
                                id: id
                            })).then(function(response) {
                            return response.data;
                            });   
                },
                
                /**
                 * Calls the back end to get all question and response for a client user
                 *
                 * @param client user id
                 * @returns all questions and responses for a client user
                 */
                getAllUserSecretQuestionResponse: function() {
                    return $http.get(UriTemplate.create(Session.link.secretQuestionResponses).stringify({size: 2}))
                    		.then(function(response) {
                            return response;
                        });
                },
                
                /**
                 * Calls the back end to save or update a client user's question and responses
                 * @param userClientSecretQuestionRepsonse
                 * @returns the promise
                 */
                saveOrUpdateSecretQuestionResponse: function(userClientSecretQuestionRepsonse) {
                    return $http.post(UriTemplate.create(Session.link.secretQuestionResponses)
                    		.stringify(), userClientSecretQuestionRepsonse)                             
                            .then(function(response) {
                            return response.data;
                        });
                }
            };
        }
    ])
;
