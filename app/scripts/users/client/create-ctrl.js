'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
    .controller('UsersClientCreateController', ['$alert', '$scope', 'Client', 'UsersClientService', '$location', '$popover', 'focus',
        function ($alert, $scope, Client, UsersClientService, $location, $popover, $focus) {

            $scope.userClientToBeEdit = UsersClientService.newUserClient();
            $scope.client = Client.getClient();
            $scope.page.setTitle('Create User - ' + $scope.client.entity.name);

            /**
             * When the 'use email' box is changed set the focus when unchecked.
             */
            $scope.useEmailChange = function () {
                if ($scope.userClientToBeEdit && !$scope.userClientToBeEdit.useEmail) {
                    $focus('login');
                }
            };

            /**
             * Called when Save button is clicked
             */
            $scope.save = function (isValid, event) {
                $scope.userClientFormSubmitted = true;
                if (isValid) {
                    UsersClientService.createUserClient($scope.client, $scope.userClientToBeEdit).then(function (response) {
                        var savedUserClientResource = response.data;
                        // go to the view/edit page, if the save is successful
                        $location.path('/clients/' + savedUserClientResource.entity.client.id + '/users/' + savedUserClientResource.entity.id);
                    }, function (error) {
                        if (error.status === 409) {
                            // 409 is http conflict, meaning save was prevented due to conflicts with other users
                            $scope.conflictingUsers = error.data.conflicts;
                            $popover(angular.element(event.currentTarget), {
                                title: '',
                                placement: 'left',
                                scope: $scope,
                                trigger: 'manual',
                                autoClose: true,
                                show: true,
                                template: 'partials/user/client/create/user_already_exists_popover.tpl.html'
                            });
                        }
                    });
                } else {
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
                }
            };

        }
    ])
;
