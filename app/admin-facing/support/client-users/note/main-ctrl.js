'use strict';

angular.module('emmiManager')

/**
 * Controller for the UserClient Support Client Note section
 */
.controller('ClientNoteMainController', ['$scope', '$alert', 'Client', 'ClientNoteService',
    function ($scope, $alert, Client, ClientNoteService) {
        
        /**
         * Called when Edit button is clicked
         */
        $scope.edit = function () {
            $scope.editMode = true;
            $scope.clientNoteEdit = angular.copy($scope.originalClientNote);
            $scope.clientNoteFormSubmitted = false;
            _paq.push(['trackEvent', 'Form Action', 'Client Note Edit', 'Edit']);
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
            $scope.clientNoteForm.$setPristine();
            _paq.push(['trackEvent', 'Form Action', 'Client Note Edit', 'Cancel']);
        };

        /**
         * Called when Save button is clicked
         */
        $scope.save = function (form) {
            window.paul = form;
            $scope.clientNoteFormSubmitted = true;
            if (form.$valid) {
                ClientNoteService.createOrUpdateClientNote($scope.client, $scope.clientNoteEdit).then(function(response){
                    $scope.originalClientNote = angular.copy(response.data);
                    $scope.editMode = false;
                });
            }
        };

        $scope.client = Client.getClient();
        ClientNoteService.getClientNote($scope.client).then(function(response){
            $scope.originalClientNote = angular.copy(response.data);
        });
        $scope.clientNoteFormSubmitted = false;
}]);
