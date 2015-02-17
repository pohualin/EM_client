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
            $scope.save = function (isValid, event, addAnother) {
                $scope.userClientFormSubmitted = true;
                if (isValid) {
                    $scope.userClientForm.$setPristine();
                    UsersClientService.createUserClient($scope.client, $scope.userClientEdit).then(
                        function success(response) {
                            var savedUserClientResource = response.data;
                            // go to the view/edit page, if the save is successful
                            if (!addAnother) {
                                $location.path(
                                    '/clients/' + savedUserClientResource.entity.client.id +
                                    '/users/' + savedUserClientResource.entity.id
                                );
                            } else {
                                $location.search('rnd', savedUserClientResource.entity.id);
                            }
                            $alert({
                                content: 'User <b>' + savedUserClientResource.entity.login + '</b> has been successfully created.',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                            _paq.push(['trackEvent', 'Form Action', 'Create User', 'Save']);
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
