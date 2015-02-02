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
                _paq.push(['trackEvent', 'Form Action', 'User Client Edit', 'Edit']);
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
                _paq.push(['trackEvent', 'Form Action', 'User Client Edit', 'Cancel']);
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
                                    content: 'User <b>' + savedUserClient.entity.login + '</b> has been successfully updated.',
                                    type: 'success',
                                    placement: placement,
                                    show: true,
                                    duration: 5,
                                    dismissable: true
                                });
                            }
                            _paq.push(['trackEvent', 'Form Action', 'User Client Edit', 'Save']);
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

            $scope.userClientView = UsersClientService.getUserClient();
        }])

;
