'use strict';

angular.module('emmiManager')

/**
 * Controller for EmailRestrictConfiguration
 */
.controller('EmailRestrictConfigurationMainController', ['$scope', '$controller', 'EmailRestrictConfigurationsService',
    function ($scope, $controller, EmailRestrictConfigurationsService) {
        var contentProperty = 'emailRestrictConfigurations';
    
        /**
         * Fetch another set of existing emailRestrictConfigurations
         */
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            EmailRestrictConfigurationsService.fetchPage(href).then(function (emailRestrictResponse) {
                $scope.handleResponse(emailRestrictResponse, contentProperty);
            }, function () {
                $scope.loading = false;
            });
        };
        
        /**
         * Fetch the first set of existing emailRestrictConfigurations
         */
        $scope.listExisting = function(){
            getEmailRestrict();
        };
        
        /**
         * Remove one single emailRestrictConfiguration
         */
        $scope.remove = function(emailRestrictToRemove){
            EmailRestrictConfigurationsService.remove(emailRestrictToRemove).then(function(response){
                getEmailRestrict();
            });
        };
        
        /**
         * Sort the existing emailRestrictConfigurations
         */
        $scope.sort = function (property) {
            var sort = $scope.createSortProperty(property);
            getEmailRestrict(sort);
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
        function getEmailRestrict(sort){
            $scope.loading = true;
            EmailRestrictConfigurationsService.getEmailRestrictConfiguration(sort)
                .then(function(emailRestrictResponse){
                    if (!emailRestrictResponse) {
                        $scope.sortProperty = sort;
                    }
                    $scope.handleResponse(emailRestrictResponse, contentProperty);
            });
            $scope.sortProperty = null;
        }

        init();
    }]);
 