'use strict';
angular.module('emmiManager')

/**
 * Service for Secret Question Responses
 */
    .service('SecretQuestionService', ['$http', 'UriTemplate', '$q', 'Session', 'API', '$filter',
        function ($http, UriTemplate, $q, Session, API, $filter) {
            var validateResponsesForResetPw;
            return {

                /**
                 * Calls the back end get Secret Questions list
                 *
                 * @returns All available secret question
                 */
                getSecretQuestions: function () {
                    return $http.get(API.secretQuestions);
                },

                getUserInputSecurityResponses: function () {
                    return validateResponsesForResetPw;
                },
                setUserInputSecurityResponses: function (userInputSecurityResponses) {
                    validateResponsesForResetPw = userInputSecurityResponses;
                },

                /**
                 * Creates a new object for the response
                 */
                createNewResponse: function () {
                    return {
                        entity: {
                            secretQuestion: null,
                            response: null
                        }
                    };
                },

                /**
                 * Calls the back end to get all question and responses with asterisks
                 * @returns all questions and the responses with asterisks
                 */
                getAllUserSecretQuestionAsteriskResponse: function () {
                    return $http.get(UriTemplate.create(Session.link.secretQuestionAsteriskResponses).stringify({size: 2}))
                        .then(function (response) {
                            return response;
                        });
                },


                /**
                 * Calls the back end to get all questions for a user with reset password token
                 * @param resetToken password token
                 * @returns all questions and empty response
                 */
                getUserExistingSecurityQuestion: function (resetToken) {
                    return $http.get(UriTemplate.create(API.getSecretQuestionWithResetToken).stringify({
                        size: 2,
                        token: resetToken
                    }))
                        .then(function (response) {
                            return response;
                        });
                },


                /**
                 * Calls the back end to get all questions for a user with reset password token
                 * @param resetToken password token
                 * @param userClientSecretQuestionResponse to be checked
                 * @param trackingToken the tracking token
                 * @returns all questions and empty response
                 */
                validateUserSecurityResponse: function (resetToken, userClientSecretQuestionResponse,
                                                        trackingToken) {
                    userClientSecretQuestionResponse = userClientSecretQuestionResponse || {};
                    return $http.put(UriTemplate.create(API.validateSecurityResponse).stringify({
                        token: resetToken,
                        trackingToken: trackingToken
                    }), userClientSecretQuestionResponse, {override403: true})
                        .then(function (response) {
                            return response.data;
                        });
                },

                /**
                 * Calls the back end to get all question and response for a client user
                 *
                 * @param password
                 * @returns all questions and responses for a client user
                 */
                getAllUserSecretQuestionResponse: function (password) {

                    return $http.get(UriTemplate.create(Session.link.secretQuestionResponses).stringify({
                            size: 2,
                            password: password
                        }),
                        {override403: true})
                        .then(function (response) {
                            return response;
                        });
                },


                /**
                 * Calls the back end to make sure user has permission for add security question
                 *
                 * @param password
                 * @returns true or false
                 */
                validatePassword: function (password) {
                    return $http.get(UriTemplate.create(Session.link.verifyPassword).stringify({
                            size: 2,
                            password: password
                        }),
                        {override403: true})
                        .then(function (response) {
                            return response;
                        });
                },

                /**
                 * Calls the back end to save or update a client user's question and responses.
                 * It does this a bit differently for 'create' vs 'update'. Create calls are
                 * chained to allow for ordering by id, update calls are concurrent.
                 *
                 * @param userClientSecretQuestionResponse1 the first response
                 * @param userClientSecretQuestionResponse2 the second response
                 * @returns {*} the promise
                 */
                saveOrUpdateSecretQuestionResponse: function (userClientSecretQuestionResponse1,
                                                              userClientSecretQuestionResponse2) {
                    var saveCall;
                    if (Session.secretQuestionsCreated) {
                        // save concurrently because we already have IDs
                        saveCall = $q.all([
                            $http.post(UriTemplate.create(Session.link.secretQuestionResponses)
                                .stringify(), userClientSecretQuestionResponse1, {override500: true}),
                            $http.post(UriTemplate.create(Session.link.secretQuestionResponses)
                                .stringify(), userClientSecretQuestionResponse2, {override500: true})
                        ]);
                    } else {
                        // save staggered, so that the first response has the lower id
                        saveCall = $http.post(UriTemplate.create(Session.link.secretQuestionResponses)
                            .stringify(), userClientSecretQuestionResponse1, {override500: true}).then(function () {
                            return $http.post(UriTemplate.create(Session.link.secretQuestionResponses)
                                .stringify(), userClientSecretQuestionResponse2, {override500: true});
                        });
                    }
                    // save both responses and wait for both to finish
                    return saveCall.then(
                        function ok(result) {
                            // update the creation flag to true if the saves were both successful
                            return $http.put(UriTemplate.create(Session.link.updateUserClientSecretQuestionFlag)
                                .stringify({secretQuestionsCreated: true})).then(function () {
                                // also apply to the calling Session in case, a route change doesn't happen
                                angular.extend(Session, {secretQuestionsCreated: true});
                                return result;
                            });
                        }
                    );
                },

                /**
                 * dont ask user for information again until expiration date
                 *
                 * @param userClient current userClient
                 * @returns the response
                 *
                 */
                notNow: function (userClient) {
                    return $http.put(UriTemplate.create(userClient.link.notNow).stringify(), userClient).then(function (response) {
                        return response;
                    });
                },

                /**
                 * Returns allChoices - withoutThisQuestion as an array
                 *
                 * @param allChoices to trim
                 * @param withoutThisQuestion to remove from the list
                 * @returns {Array}
                 */
                trimChoices: function (allChoices, withoutThisQuestion) {
                    var trimmed = [];
                    $filter('filter')(allChoices, function (aChoice) {
                        if (!angular.equals(aChoice, withoutThisQuestion)) {
                            trimmed.push(aChoice);
                        }
                    });
                    return trimmed;
                }
            };
        }
    ])
;
