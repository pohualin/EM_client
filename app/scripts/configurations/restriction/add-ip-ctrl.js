'use strict';

angular.module('emmiManager')

/**
 * Controller for IpRestrictConfiguration
 */
.controller('AddIpRestrictConfigurationController', ['$scope', '$alert', '$controller', '$modal', 'IpRestrictConfigurationsService',
    function ($scope, $alert, $controller, $modal, IpRestrictConfigurationsService) {
        
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
            $scope.ipRestrictConfiguration = IpRestrictConfigurationsService.newIpRestrictConfiguration();
            addIpRestrictModal.$promise.then(addIpRestrictModal.show);
        };
        
        /**
         * Call service to add the valid ipRestrictConfiguration or show error banner
         */
        $scope.add = function(ipRestrictConfigurationForm){
            $scope.ipRestrictConfigurationFormSubmitted = true;
            if(ipRestrictConfigurationForm.$valid){
                IpRestrictConfigurationsService.save($scope.ipRestrictConfiguration).then(function(response){
                    $scope.listExisting();
                    $scope.ipRestrictConfiguration = IpRestrictConfigurationsService.newIpRestrictConfiguration();
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
 