'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionCreateLoginController', ['$scope', '$location', 'SecretQuestionService', '$alert',
        function ($scope, $location, SecretQuestionService, $alert) {
            $scope.secretQuestionFormSubmitted = false;
            $scope.duplicated = false;

            SecretQuestionService.getSecretQuestions().then(function (response) {
                $scope.secretQuestions = response.data.content;
            });

            $scope.account.question1 = SecretQuestionService.createNewResponse();
            $scope.account.question2 = SecretQuestionService.createNewResponse();

            /**
             * When the save button is clicked. Sends all updates
             * to the back, then re-binds the form objects with the
             * results
             */
            $scope.saveOrUpdateSecretQuestion = function (valid) {
                $scope.secretQuestionFormSubmitted = true;
                if (valid) {
                    SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.account.question1.entity, $scope.account.question2.entity).then(function (response) {
                        $location.path($scope.locationBeforeLogin).replace();
                        $alert({
                            title: ' ',
                            content: 'Your security questions have been updated successfully.',
                            container: 'body',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
                    });
                } else {
                    $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#message-container-no-questions',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                }
            };

            /**
             * When the save button is clicked. Check if the user
             * selected 2 same questions or not
             */
            $scope.onChange = function () {
                if (angular.equals($scope.account.question1.entity.secretQuestion, $scope.account.question2.entity.secretQuestion) && !(angular.isUndefined($scope.account.question1.entity.secretQuestion))) {
                    $scope.secretQuestionForm.secretQuestion2.$setValidity('duplicated', false);
                } else {
                    $scope.secretQuestionForm.secretQuestion2.$setValidity('duplicated', true);
                }
            };

            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.notNow = function () {
                SecretQuestionService.notNow($scope.account);
                $location.path($scope.locationBeforeLogin).replace();
            };
        }
    ])
;

