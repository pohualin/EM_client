'use strict';
angular.module('emmiManager')

/**
 * Service for Secret Question Responses
 */
    .service('SecretQuestionService', ['$http', 'UriTemplate', 'Session', 'API',
        function ($http, UriTemplate, Session, API) {
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
                 * Calls the back end to get all question and responses with asterisks                 *
                 * @param client user id
                 * @returns all questions and the responses with asterisks
                 */
                getAllUserSecretQuestionAsteriskResponse: function(user) {
                	return $http.get(UriTemplate.create(Session.link.secretQuestionAsteriskResponses).stringify({size: 2}),user)
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
