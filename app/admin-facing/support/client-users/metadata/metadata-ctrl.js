'use strict';

angular.module('emmiManager')

/**
 * Controller for the UserClient Support metadata section
 */
    .controller('UserClientSupportMetaDataController', ['$scope', '$controller', 'UsersClientService', '$alert',
        function ($scope, $controller, UsersClientService, $alert) {

            $controller('UserClientSupportMetaDataCommon', {$scope: $scope});

            $scope.makeActive = function(){
                $scope.userClientEdit.entity.active = true;
            };
            
            /**
             * Show/Hide save and cancel buttons
             */
            $scope.showCancelSave = function(){
                return !angular.equals($scope.originalUserClient, $scope.userClientEdit);
            };

            /**
             * When cancel is clicked in edit mode
             */
            $scope.cancel = function () {
                // Reset form to pristine
                $scope.userClientEdit = angular.copy($scope.originalUserClient);
                $scope.userClientForm.$setPristine();
                delete $scope.loginError;
                delete $scope.emailError;
                _paq.push(['trackEvent', 'Form Action', 'Client User Edit', 'Cancel']);
            };

            /**
             * Called when Save button is clicked
             */
            $scope.save = function (form) {
                $scope.userClientFormSubmitted = true;
                if (form.$valid) {
                    var beforeSaveStatus = $scope.originalUserClient.currentlyActive;
                    var formDirty = form.$dirty;
                    UsersClientService.update($scope.userClientEdit).then(
                        function success(response) {
                            var savedUserClient = response.data;
                            $scope.originalUserClient = savedUserClient;
                            $scope.userClientEdit = angular.copy($scope.originalUserClient);
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
                        });
                } else {
                    $scope.formValidationError();
                }
            };

            $scope.originalUserClient = UsersClientService.getUserClient();
            $scope.userClientEdit = angular.copy($scope.originalUserClient);
            $scope.userClientFormSubmitted = false;
        }])

;
