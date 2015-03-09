'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user's credentials have expired.
 */
    .controller('ChangePasswordController', ['$scope', '$location', '$alert', 'account', 'arrays', 'ChangePasswordService',
        function ($scope, $location, $alert, account, arrays, ChangePasswordService) {

            /**
             * Set the component up in its initial state.
             */
            $scope.reset = function () {
                $scope.passwordChange = ChangePasswordService.createChangeHolder();
                $scope.changePasswordFormSubmitted = false;
            };

            function init(){
                $scope.reset();
                ChangePasswordService.loadPolicy($scope.account.clientResource).then(function (response){
                    $scope.policy = response.data;
                });
            }
            
            init();
        }
    ])
;
