'use strict';

angular.module('emmiManager')

/**
 * Controller for IpRestrictConfiguration
 */
.controller('IpRestrictConfigurationMainController', ['$alert', '$scope', '$controller', 'IpRestrictConfigurationsService',
    function ($alert, $scope, $controller, IpRestrictConfigurationsService) {
        var contentProperty = 'ipRestrictConfigurations';
    
        /**
         * Fetch another set of existing ipRestrictConfigurations
         */
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            IpRestrictConfigurationsService.fetchPage(href).then(function (ipRestrictResponse) {
                $scope.handleResponse(ipRestrictResponse, contentProperty);
            }, function () {
                $scope.loading = false;
            });
        };
        
        /**
         * Fetch the first set of existing ipRestrictConfigurations
         */
        $scope.listExisting = function(){
            getIpRestrict();
        };
        
        /**
         * Remove one single ipRestrictConfiguration
         */
        $scope.remove = function(ipRestrictToRemove){
            IpRestrictConfigurationsService.remove(ipRestrictToRemove).then(function(response){
                $alert({
                    content: '<b>' + $scope.client.name + '</b> has been updated successfully.',
                    type: 'success',
                    placement: 'top',
                    show: true,
                    duration: 5,
                    dismissable: true
                });
                getIpRestrict();
            });
        };
        
        /**
         * Sort the existing ipRestrictConfigurations
         */
        $scope.sort = function (property) {
            var sort = $scope.createSortProperty(property);
            getIpRestrict(sort);
        };
        
        /**
         * init method called when page is loading
         */
        function init() {
            $controller('CommonSearch', {$scope: $scope});
            $scope.listExisting();
        }
        
        /**
         * Utility method to call by sort and listExisting
         */
        function getIpRestrict(sort){
            $scope.loading = true;
            IpRestrictConfigurationsService.getIpRestrictConfiguration(sort)
                .then(function(ipRestrictResponse){
                    if (!ipRestrictResponse) {
                        $scope.sortProperty = sort;
                    }
                    $scope.handleResponse(ipRestrictResponse, contentProperty);
            });
            $scope.sortProperty = null;
        }

        init();
    }]);
 