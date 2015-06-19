'use strict';

angular.module('emmiManager')

/**
 * Controller for the UserClient Support metadata section
 */
.controller('ClientNoteMainController', ['$scope', '$controller', 'Client', 'UsersClientService', '$alert', 'ClientNoteService', 'Session',
    function ($scope, $controller, Client, UsersClientService, $alert, ClientNoteService, Session) {
        
        $scope.edit = function () {
            $scope.editMode = true;
            $scope.clientNoteEdit = angular.copy($scope.originalClientNote);
            // $scope.userClientFormSubmitted = false;
            // _paq.push(['trackEvent', 'Form Action', 'Client User Edit', 'Edit']);
        };
        
        $scope.cancel = function () {
            $scope.editMode = false;
            $scope.clientNoteEdit = angular.copy($scope.originalClientNote);
            // $scope.userClientFormSubmitted = false;
            // _paq.push(['trackEvent', 'Form Action', 'Client User Edit', 'Edit']);
        };
    
        /**
         * Show/Hide save and cancel buttons
         */
        $scope.showCancelSave = function(){
            return !angular.equals($scope.originalClientNote, $scope.clientNoteEdit);
        };

        /**
         * When cancel is clicked in edit mode
         */
        $scope.cancel = function () {
            $scope.clientNoteEdit = angular.copy($scope.originalClientNote);
            $scope.editMode = false;
            // Reset form to pristine
            // $scope.userClientEdit = angular.copy($scope.originalUserClient);
            // $scope.userClientForm.$setPristine();
            // _paq.push(['trackEvent', 'Form Action', 'Client User Edit', 'Cancel']);
        };

        /**
         * Called when Save button is clicked
         */
        $scope.save = function (form) {
            // $scope.userClientFormSubmitted = true;
            if (form.$valid) {
                ClientNoteService.createOrUpdateClientNote($scope.client, $scope.clientNoteEdit).then(function(response){
                    $scope.originalClientNote = angular.copy(response.data);
                    $scope.editMode = false;
                });
            }
        };

        $scope.client = Client.getClient();
        window.paul = Session;
        ClientNoteService.getClientNote($scope.client).then(function(response){
            $scope.originalClientNote = angular.copy(response.data);
        });
        // $scope.userClientFormSubmitted = false;
}]);
