'use strict';

angular.module('emmiManager')

/**
 * Controller for EmailRestrictConfiguration
 */
.controller('EmailRestrictConfigurationMainController', ['$alert', '$scope', '$controller', 'EmailRestrictConfigurationsService',
    function ($alert, $scope, $controller, EmailRestrictConfigurationsService) {
        var contentProperty = 'emailRestrictConfigurations';

        /**
         * Fetch another set of existing emailRestrictConfigurations
         */
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            EmailRestrictConfigurationsService.fetchPage(href).then(function (emailRestrictResponse) {
                $scope.handleResponse(emailRestrictResponse, contentProperty);

                EmailRestrictConfigurationsService.setEmailRestrictConfigurations($scope.emailRestrictConfigurations);
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

        $scope.$on('refreshEmailList', function () {
            getEmailRestrict();
        });

        /**
         * Remove one single emailRestrictConfiguration
         */
        $scope.remove = function(emailRestrictToRemove){
            $scope.whenSaving = true;
            EmailRestrictConfigurationsService.remove(emailRestrictToRemove).then(function () {
                $alert({
                    content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                });
                getEmailRestrict();
                EmailRestrictConfigurationsService.getEmailsThatDoNotFollowRestrictions().then(function (emailsThatDoNotFollowRestrictions) {
                    $scope.setEmailsThatDoNotFollowRestrictions(emailsThatDoNotFollowRestrictions);
                });
            }).finally(function () {
                $scope.whenSaving = false;
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

                    EmailRestrictConfigurationsService.setEmailRestrictConfigurations($scope.emailRestrictConfigurations);
            });
            $scope.sortProperty = null;
        }

        init();
    }]);

