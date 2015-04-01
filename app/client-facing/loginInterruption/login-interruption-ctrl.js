'use strict';

angular.module('emmiManager')
    .controller('loginInterruption', ['$scope', '$alert', '$location', 'locationBeforeLogin', 'account', '$controller','$q',
        function ($scope, $alert, $location, locationBeforeLogin, account, $controller, $q) {

            $controller('sendValidationEmail', {$scope: $scope});
            $controller('SecretQuestionCreateController', {$scope: $scope});
            $controller('enterEmail', {$scope: $scope});

            $scope.account = account;
            $scope.locationBeforeLogin = locationBeforeLogin;

            $scope.loginInterruptFormSubmitted = false;

            $scope.save = function (isAddEmailValid, isValidateEmailValid, isSecretQuestionsEmailValid) {
                var promises = [];
                $scope.loginInterruptFormSubmitted = true;
                if (!account.originalUserClientEmail && !$scope.addEmailSaveSuccesful) {
                    promises.push($scope.saveEmail(isAddEmailValid));
                } else if (!account.emailValidated && !$scope.validateEmailSaveSuccesful) {
                    promises.push($scope.sendValidationEmail(isValidateEmailValid));
                }
                if (!account.secretQuestionCreated && !$scope.secretQuestionEmailSaveSuccesful) {
                    if(promises.length > 0){
                        $q.all(promises).then(function() {
                            promises.push($scope.saveOrUpdateSecretQuestion(isSecretQuestionsEmailValid));
                        });
                    } else {
                        promises.push($scope.saveOrUpdateSecretQuestion(isSecretQuestionsEmailValid));
                    }
                }

                $q.all(promises).then(function() {
                    $location.path(locationBeforeLogin).replace();
                    if (!account.originalUserClientEmail) {
                        //show confirmation banner
                        $alert({
                            content: 'Please check your email. A verification  link has been sent to <strong>' + $scope.account.email +
                                '</strong> to finish setting up your account.',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
                    }
                    if(!account.emailValidated){
                        //show confirmation banner
                        if (!$scope.emailErrorAlert) {
                            $alert({
                                content: 'Please check your email. A link has been sent to <strong>' + $scope.account.email +
                                    '</strong> to finish setting up your account.',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                        }
                    }
                    if(!account.secretQuestionCreated){
                        if (!$scope.emailErrorAlert) {
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
                        }
                    }
                }, function() {
                    //error function
                    if (!$scope.emailErrorAlert) {
                        $scope.emailErrorAlert = $alert({
                            title: ' ',
                            content: 'Please correct the below information.',
                            container: '#message-container',
                            type: 'danger',
                            show: true,
                            dismissable: false
                        });
                    }


                });

            };

            /**
             * functionality if user clicks not now
             */
            $scope.notNow = function () {
                $location.path(locationBeforeLogin).replace();
            };
        }])
;

