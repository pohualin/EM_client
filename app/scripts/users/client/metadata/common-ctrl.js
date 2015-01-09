'use strict';

angular.module('emmiManager')

/**
 *  Shared metadata functions
 */
    .controller('UserClientMetaDataCommon', ['$scope', 'focus', '$popover', '$alert',
        function ($scope, $focus, $popover, $alert) {

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
                        } else if ('EMAIL' === conflict.reason) {
                            $scope.emailError = conflict;
                            $scope.emailError.doNotFocus = totalErrorCount > 1;
                        }
                    });
                    if (totalErrorCount > 0) {
                        $scope.formValidationError();
                    }
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
                        container: '#message-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                }
            };

        }])

    .directive('confirmExit', ['$popover', '$location', function ($popover, $location) {
        return {
            restrict: 'EA',
            scope: {
                'ok': '&onOk',
                'form': '='
            },
            link: function (scope, element) {
                element.on('click', function (e) {
                    e.preventDefault();
                    if (scope.form.$pristine) {
                        // if form has not been modified
                        scope.$apply(function () {
                            scope.ok();
                        });
                    } else {
                        // show popover
                        scope.exitPopup = $popover(element, {
                            placement: 'bottom',
                            container: 'body',
                            scope: scope,
                            trigger: 'manual',
                            show: true,
                            autoClose: true,
                            contentTemplate: 'partials/common/cancel.tpl.html'
                        });
                    }
                });
            }
        };
    }])

;
