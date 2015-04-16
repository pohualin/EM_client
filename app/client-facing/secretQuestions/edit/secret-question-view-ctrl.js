'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionViewController', ['$scope', '$location', 'SecretQuestionService',
        function ($scope, $location, SecretQuestionService) {

            $scope.secretQuestionFormSubmitted = false;

            $scope.editSecretQuestion = function () {
                $location.path('/editSecurityQuestions').replace();
            };

            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.cancel = function () {
                $location.path('/');
            };

            function init() {

                SecretQuestionService.getSecretQuestions().then(function (response) {
                    $scope.secretQuestions = response.data.content;
                });

                SecretQuestionService.getAllUserSecretQuestionAsteriskResponse($scope.account.id).then(function (response) {
                    var existingResponse = response.data.content;
                    $scope.question1 = existingResponse.length > 0 ? existingResponse[0] : SecretQuestionService.createNewResponse();
                    $scope.question2 = existingResponse.length > 1 ? existingResponse[1] : SecretQuestionService.createNewResponse();
                });
            }

            init();

        }
    ])
;
