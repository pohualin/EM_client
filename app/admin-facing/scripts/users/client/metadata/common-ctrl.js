'use strict';

angular.module('emmiManager')

/**
 *  Shared metadata functions
 */
    .controller('UserClientMetaDataCommon', ['$scope', 'focus', '$popover', '$alert', 'EmailRestrictConfigurationsService',
        function ($scope, $focus, $popover, $alert, EmailRestrictConfigurationsService) {

            /**
             * When the 'use email' box is changed set the focus when unchecked.
             */
            $scope.useEmailChange = function () {
                if ($scope.userClientEdit && !$scope.userClientEdit.useEmail) {
                    $focus('login');
                } else {
                    // make sure login errors go away when use email is pressed
                    delete $scope.loginError;
                }
            };

            /**
             * Common function that handles errors that happen on save.
             * Constructs an error object to be rendered by the directive.
             *
             * @param error the actual error
             */
            $scope.handleSaveError = function (error) {
                if (error.status === 406 && error.data && error.data.conflicts) {
                    var totalErrorCount = error.data.conflicts.length;
                    angular.forEach(error.data.conflicts, function (conflict) {
                        if ('LOGIN' === conflict.reason) {
                            // login conflict
                            if (!$scope.userClientEdit.useEmail) {
                                // user did not check 'Use Email'
                                $scope.loginError = conflict;
                            } else {
                                // user has checked 'Use Email'
                                conflict.reason = 'EMAIL';
                                $scope.emailError = conflict;
                            }
                        } else if ('EMAIL' === conflict.reason && totalErrorCount === 1) {
                            // only show email error if there is not a login error
                            $scope.emailError = conflict;
                        }
                    });
                    if (totalErrorCount > 0) {
                        $scope.formValidationError();
                    }
                }

                if (error.status === 406 && error.data && error.data.validationError) {
                    EmailRestrictConfigurationsService.allValidEmailEndings().then(function(response){
                        error.data.validationError.validEmailEndings = response;
                        $scope.emailError = error.data.validationError;
                    });
                    $scope.formValidationError();
                }
            };

            /**
             * Shows the form validation error alert
             */
            $scope.formValidationError = function () {
                if (!$scope.errorAlert) {
                    $scope.errorAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#validation-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                }
            };

        }])

;
