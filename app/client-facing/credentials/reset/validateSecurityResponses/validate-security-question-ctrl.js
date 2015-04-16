'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user clicks an activation link
 */
    .controller('ValidateSecurityQuestionController', ['$rootScope', '$scope', 'Session', '$location',
        'ResetClientUserPasswordService', 'resetToken', '$alert', 'SecretQuestionService', '$q',
        'LoginErrorMessageFactory',
        function ($rootScope, $scope, Session, $location, ResetClientUserPasswordService,
                  resetToken, $alert, SecretQuestionService, $q, LoginErrorMessageFactory) {
            $scope.countFailed = 0;

            /**
             * When the user changes some text, wipe out the correct response
             * error
             *
             * @param inputField to check
             */
            $scope.responseChanged = function (inputField){
                inputField.$setValidity('correctResponse', true);
            };

            /**
             * Called when the user clicks Submit on the security question form
             *
             * @param valid the form's validity state
             */
            $scope.verifySecretQuestion = function (valid) {
                $scope.secretQuestionFormSubmitted = true;
                if (valid) {

                    // form is valid, now validate the actual responses
                    var validate1 = SecretQuestionService.validateUserSecurityResponse(resetToken, $scope.question1.entity)
                            .then(function (response) {
                                if (!angular.equals(response, 'true')) {
                                    $scope.secretQuestionForm.response1.$setValidity('correctResponse', false);
                                    return $q.reject();
                                }
                            }),
                        validate2 = SecretQuestionService.validateUserSecurityResponse(resetToken, $scope.question2.entity)
                            .then(function (response) {
                                if (!angular.equals(response, 'true')) {
                                    $scope.secretQuestionForm.response2.$setValidity('correctResponse', false);
                                    return $q.reject();
                                }
                            });

                    // wait for the validation calls to come back
                    $q.all([validate1, validate2]).then(
                        function allGood() {
                            SecretQuestionService
                                .setUserInputSecurityResponses([$scope.question1.entity, $scope.question2.entity]);
                            $location.url('/reset_password/reset/' + resetToken).replace();
                        },
                        function notAllGood() {
                            $scope.countFailed++;
                            if ($scope.countFailed >= 4) {
                                $rootScope.lockError = true;
                                ResetClientUserPasswordService.lockedOutUserByResetToken(resetToken).then(function (response) {
                                    if (response.data) {
                                        $rootScope.lockExpirationDateTime = response.data.replace(/"/g, '') + 'Z';
                                    }
                                    $location.path('/login').replace();
                                });
                            }
                            $scope.showError();
                        }
                    );
                } else {
                    $scope.showError();
                }

            };

            /**
             * Function called when we need to show an error
             * @param message to display
             */
            $scope.showError = function (message) {
                if (!$scope.errorAlert) {
                    $scope.errorAlert = $alert({
                        title: ' ',
                        content: 'Please check your responses and try again.',
                        container: '#message-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                } else {
                    $scope.errorAlert.show();
                }
            };

            function init() {
                $scope.question1 = SecretQuestionService.createNewResponse();
                $scope.question2 = SecretQuestionService.createNewResponse();
                SecretQuestionService.getUserExistingSecurityQuestion(resetToken)
                    .then(function (response) {
                        $scope.secretQuestions = response.data.content;
                        $scope.question1.entity.secretQuestion = angular.copy($scope.secretQuestions[0].entity);
                        $scope.question2.entity.secretQuestion = angular.copy($scope.secretQuestions[1].entity);
                    }, function error() {
                        angular.extend(LoginErrorMessageFactory,{showResetPasswordTokenExpired:true});
                        $location.path('/login').replace();
                    });
            }

            init();
        }])
;
