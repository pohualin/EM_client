'use strict';

angular.module('emmiManager')

/**
 * Controller for the UserClient metadata section
 */
    .controller('UserClientMetaDataController', ['$scope', '$controller', 'UsersClientService',
        function ($scope, $controller, UsersClientService) {

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
            $scope.save = function (isValid) {
                $scope.userClientFormSubmitted = true;
                if (isValid) {
                    UsersClientService.update($scope.userClientEdit).then(
                        function success(response) {
                            $scope.userClientView = response.data;
                            $scope.editMode = false;
                        }, function error(error) {
                            $scope.handleSaveError(error, $scope.userClientEdit.currentTarget);
                        });
                } else {
                    $scope.formValidationError();
                }
            };

            $scope.userClientView = UsersClientService.getUserClient();
        }])

;
