'use strict';

angular.module('emmiManager')

/**
 * Controller for the UserClient metadata section
 */
    .controller('UserClientMetaDataController', ['$scope', '$controller', 'UsersClientService', '$alert',
        function ($scope, $controller, UsersClientService, $alert) {

            $controller('UserClientMetaDataCommon', {$scope: $scope});

            /**
             * Called when 'edit' is clicked
             */
            $scope.edit = function () {
                $scope.userClientEdit = angular.copy(UsersClientService.getUserClient());
                $scope.editMode = true;
                $scope.userClientFormSubmitted = false;
            };

            $scope.makeActive = function(){
                $scope.userClientEdit.entity.active = true;
            };

            /**
             * When cancel is clicked in edit mode
             */
            $scope.cancel = function () {
                $scope.editMode = false;
            };

            /**
             * Called when Save button is clicked
             */
            $scope.save = function (form) {
                $scope.userClientFormSubmitted = true;
                if (form.$valid) {
                    var beforeSaveStatus = $scope.userClientEdit.currentlyActive;
                    UsersClientService.update($scope.userClientEdit).then(
                        function success(response) {
                            var savedUserClient = response.data,
                                placement = 'top';
                            $scope.userClientView = savedUserClient;
                            $scope.editMode = false;
                            if (savedUserClient.currentlyActive != beforeSaveStatus){
                                var message = 'User ' +  savedUserClient.entity.login;
                                 // status has changed
                                if (savedUserClient.currentlyActive){
                                    // now activated
                                    message += ' is now active.';
                                } else {
                                    // now deactivated
                                    message += ' has been deactivated.'
                                }
                                $alert({
                                    content: message,
                                    type: 'success',
                                    placement: placement,
                                    show: true,
                                    duration: 5,
                                    dismissable: true
                                });
                                placement += ' second-line';
                            }
                            if (form.$dirty) {
                                $alert({
                                    content: 'User ' + savedUserClient.entity.login + ' has been successfully updated.',
                                    type: 'success',
                                    placement: placement,
                                    show: true,
                                    duration: 5,
                                    dismissable: true
                                });
                            }

                        }, function error(response) {
                            $scope.handleSaveError(response, $scope.userClientEdit.currentTarget);
                        });
                } else {
                    $scope.formValidationError();
                }
            };

            $scope.userClientView = UsersClientService.getUserClient();
        }])

;
