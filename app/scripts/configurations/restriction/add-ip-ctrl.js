'use strict';

angular.module('emmiManager')

/**
 * Controller for IpRestrictConfiguration
 */
.controller('AddIpRestrictConfigurationController', ['$scope', '$alert', '$controller', '$modal', 'Client', 'ClientRestrictConfigurationsService', 'IpRestrictConfigurationsService',
    function ($scope, $alert, $controller, $modal, Client, ClientRestrictConfigurationsService, IpRestrictConfigurationsService) {
        
        var addIpRestrictModal = $modal(
            {scope: $scope, 
             template: 'partials/configurations/restriction/ip-form.html', 
             animation: 'none', 
             backdropAnimation: 'emmi-fade', 
             show: false, backdrop: 'static'});
        
        /**
         *  Called when add another is clicked to add a new ipRestrictConfiguration
         */
        $scope.addAnotherIpRestrict = function(ipRestrictConfigurationForm){
            $scope.ipRestrictConfiguration = {};
            addIpRestrictModal.$promise.then(addIpRestrictModal.show);
        };
        
        /**
         * Call service to add the valid ipRestrictConfiguration or show error banner
         */
        $scope.add = function(ipRestrictConfigurationForm){
            $scope.ipRestrictConfigurationFormSubmitted = true;
            if(ipRestrictConfigurationForm.$valid){
                IpRestrictConfigurationsService.save($scope.clientRestrictConfiguration, $scope.ipRestrictConfiguration).then(function(response){
                    $scope.listExisting();
                    $scope.ipRestrictConfiguration = {};
                    $scope.ipRestrictConfigurationFormSubmitted = false;
                    $scope.$hide();
                });
            } else {
                $scope.showErrorBanner();
            }
        };
        
        /**
         * Create and show error banner
         */
        $scope.showErrorBanner = function () {
            if (!$scope.addIpRestrictErrorAlert) {
                $scope.addIpRestrictErrorAlert = $alert({
                    title: ' ',
                    content: 'Please correct the below information.',
                    container: '#message-container',
                    type: 'danger',
                    show: true,
                    dismissable: false
                });
            }
        };
    }]);
 