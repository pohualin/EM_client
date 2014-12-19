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
                }
            };

            /**
             * Common function that handles errors that happen on save
             *
             * @param error the actual error
             * @param currentTarget the button that triggered the error
             */
            $scope.handleSaveError = function (error, currentTarget, placement) {
                if (error.status === 406 && currentTarget) {
                    // 406 is not acceptable, meaning save was prevented due collisions with other users
                    $scope.conflictingUsers = error.data.conflicts;
                    // save error because of already existing clients
                    $popover(currentTarget, {
                        placement: placement || 'left',
                        scope: $scope,
                        trigger: 'manual',
                        autoClose: true,
                        show: true,
                        template: 'partials/user/client/metadata/user_already_exists_popover.tpl.html'
                    });
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
;
