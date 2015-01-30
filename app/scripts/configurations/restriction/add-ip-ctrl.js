'use strict';

angular.module('emmiManager')

/**
 * Controller for IpRestrictConfiguration
 */
.controller('AddIpRestrictConfigurationController', ['$scope', '$alert', '$controller', '$modal', 'IpRestrictConfigurationsService',
    function ($scope, $alert, $controller, $modal, IpRestrictConfigurationsService) {
        
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
                    container: '#ip-message-container',
                    type: 'danger',
                    show: true,
                    dismissable: false
                });
            }
        };
    }]);
 