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
                _paq.push(['trackEvent', 'Form Action', 'Client User Edit', 'Edit']);
            };

            $scope.makeActive = function(){
                $scope.userClientEdit.entity.active = true;
            };

            /**
             * When cancel is clicked in edit mode
             */
            $scope.cancel = function () {
                // Reset form to pristine
                $scope.userClientForm.$setPristine();
                delete $scope.loginError;
                delete $scope.emailError;
                $scope.editMode = false;
                _paq.push(['trackEvent', 'Form Action', 'Client User Edit', 'Cancel']);
            };

            /**
             * Called when Save button is clicked
             */
            $scope.save = function (form) {
                $scope.userClientFormSubmitted = true;
                if (form.$valid) {
                    var beforeSaveStatus = $scope.userClientEdit.currentlyActive;
                    var formDirty = form.$dirty;
                    $scope.whenSaving = true;
                    UsersClientService.update($scope.userClientEdit).then(
                        function success(response) {
                            var savedUserClient = response.data;
                            $scope.userClientView = savedUserClient;
                            $scope.metadataChanged(); // inform the parent controller that things have changed
                            $scope.editMode = false;
                            if (savedUserClient.currentlyActive !== beforeSaveStatus){
                                var message = 'User <b>' + savedUserClient.entity.login + '</b>';
                                 // status has changed
                                if (savedUserClient.currentlyActive){
                                    // now activated
                                    message += ' is now active.';
                                } else {
                                    // now deactivated
                                    message += ' has been deactivated.';
                                }
                                $alert({
                                    content: message
                                });
                            }
                            if (formDirty) {
                                $alert({
                                    content: 'User <b>' + savedUserClient.entity.login + '</b> has been successfully updated.'
                                });
                            }
                            _paq.push(['trackEvent', 'Form Action', 'Client User Edit', 'Save']);
                            // Reset the form to pristine for EM-522/EM-634
                            form.$setPristine();

                            // reset the errors
                            delete $scope.loginError;
                            delete $scope.emailError;
                        }, function error(response) {
                            $scope.handleSaveError(response);
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                } else {
                    $scope.formValidationError();
                }
            };

            $scope.userClientView = UsersClientService.getUserClient();
        }])

;
