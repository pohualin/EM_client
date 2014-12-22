'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
    .controller('UsersClientCreateController', ['$controller', '$scope', 'Client', 'UsersClientService', '$location', '$alert',
        function ($controller, $scope, Client, UsersClientService, $location, $alert) {

            $controller('UserClientMetaDataCommon', {$scope: $scope});

            $scope.userClientEdit = UsersClientService.newUserClient();
            $scope.client = Client.getClient();
            $scope.page.setTitle('Create User - ' + $scope.client.entity.name);

            /**
             * Called when Save button is clicked
             */
            $scope.save = function (isValid, event) {
                $scope.userClientFormSubmitted = true;
                if (isValid) {
                    UsersClientService.createUserClient($scope.client, $scope.userClientEdit).then(
                        function success(response) {
                            var savedUserClientResource = response.data;
                            // go to the view/edit page, if the save is successful
                            $location.path('/clients/' + savedUserClientResource.entity.client.id + '/users/' + savedUserClientResource.entity.id);
                            $alert({
                                content: 'User '+  savedUserClientResource.entity.login + ' has been successfully created.',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                        }, function error(response) {
                            $scope.handleSaveError(response, angular.element(event.currentTarget));
                        });
                } else {
                    $scope.formValidationError();
                }
            };

        }
    ])
;
