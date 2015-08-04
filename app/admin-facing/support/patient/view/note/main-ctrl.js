'use strict';

angular.module('emmiManager')

/**
 * Controller for the UserClient Support Client Note section
 */
.controller('PatientSupportClientNoteMainController', ['$scope', '$alert', 'AuthSharedService', 'PatientSupportDataHolder', 'ClientNoteService', 'Client',
    function ($scope, $alert, AuthSharedService, holder, ClientNoteService, Client) {
        
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
         * Called when Save button is clicked to Update an existing note
         */
        $scope.update = function (form) {
            $scope.clientNoteFormSubmitted = true;
            if (form.$valid) {
                $scope.whenSaving = true;
                ClientNoteService.updateClientNote($scope.client, $scope.clientNoteEdit).then(function(response){
                    $scope.originalClientNote = response;
                    $scope.editMode = false;
                    $scope.clientNoteFormSubmitted = false;
                    form.$setPristine();
                }).finally(function(){
                    $scope.whenSaving = false;
                });
            }
        };
        
        /**
         * Called when Save button is clicked to Add an brand new ClientNote
         */
        $scope.create = function (form) {
            $scope.clientNoteFormSubmitted = true;
            if (form.$valid) {
                $scope.whenSaving = true;
                ClientNoteService.createClientNote($scope.client, $scope.clientNoteEdit).then(function(response){
                    $scope.originalClientNote = response;
                    $scope.editMode = false;
                    $scope.clientNoteFormSubmitted = false;
                    form.$setPristine();
                }).finally(function(){
                    $scope.whenSaving = false;
                });
            }
        };
        
        /**
         * Hide/Show edit button if user is not/is an Admin Super User or GOD
         */
        $scope.isEmmiSuperAdmin = function(){
            return AuthSharedService.isAuthorized(['PERM_GOD', 'PERM_ADMIN_SUPER_USER']); 
        };

        (function init(){
            Client.selectClient(holder.patient().entity.client.id).then(function(clientResource){
                ClientNoteService.getClientNote(clientResource).then(function(response){
                    $scope.originalClientNote = response;
                });
            });
            $scope.clientNoteFormSubmitted = false;
        })();
    }]);
