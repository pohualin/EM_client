'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientRestrictConfiguration main page
 */
.controller('ClientRestrictConfigurationMainController', ['$alert', '$scope', '$controller', 'Client', 'ClientRestrictConfigurationsService','EmailRestrictConfigurationsService',
    function ($alert, $scope, $controller, Client, ClientRestrictConfigurationsService, EmailRestrictConfigurationsService) {
        /**
         * get the initial number of emails that don't follow the client email restrictions
         */
        EmailRestrictConfigurationsService.getEmailsThatDoNotFollowRestrictions().then(function (emailsThatDoNotFollowRestrictions) {
            $scope.setEmailsThatDoNotFollowRestrictions(emailsThatDoNotFollowRestrictions);
        });

        /**
         * Child controller uses this to update the number of emails that don't follow the client email restrictions
         * @param newValue
         */
        $scope.setEmailsThatDoNotFollowRestrictions = function(newValue){
            $scope.badEmails = newValue;
        };

        /**
         * Save restrict configuration for the client
         */
        $scope.save = function(){
            ClientRestrictConfigurationsService.saveOrUpdate($scope.clientRestrictConfiguration).then(function(response){
                $scope.originalClientRestrictConfiguration = response;
                $scope.clientRestrictConfiguration = angular.copy($scope.originalClientRestrictConfiguration);
                $alert({
                    content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                });
            });
        };

        /**
         * init method called when page is loading
         */
        function init() {
            $scope.client = Client.getClient().entity;
            ClientRestrictConfigurationsService.getClientRestrictConfiguration().then(function(response){
                $scope.originalClientRestrictConfiguration = response;
                $scope.clientRestrictConfiguration = angular.copy($scope.originalClientRestrictConfiguration);
            });
        }

        init();
    }]);

