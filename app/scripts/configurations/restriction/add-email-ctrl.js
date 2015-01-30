'use strict';

angular.module('emmiManager')

/**
 * Controller for EmailRestrictConfiguration
 */
.controller('AddEmailRestrictConfigurationController', ['$scope', '$alert', '$controller', '$modal', 'EmailRestrictConfigurationsService',
    function ($scope, $alert, $controller, $modal, EmailRestrictConfigurationsService) {
        
        /**
         * Call service to add the valid emailRestrictConfiguration or show error banner
         */
        $scope.add = function(emailRestrictConfigurationForm){
            $scope.emailRestrictConfigurationFormSubmitted = true;
            if(emailRestrictConfigurationForm.$valid){
                EmailRestrictConfigurationsService.save($scope.emailRestrictConfiguration).then(function(response){
                    $scope.listExisting();
                    $scope.emailRestrictConfiguration = EmailRestrictConfigurationsService.newEmailRestrictConfiguration();
                    $scope.emailRestrictConfigurationFormSubmitted = false;
                });
            } else {
                $scope.showErrorBanner();
            }
        };
        
        /**
         * Create and show error banner
         */
        $scope.showErrorBanner = function () {
            if (!$scope.addEmailRestrictErrorAlert) {
                $scope.addEmailRestrictErrorAlert = $alert({
                    title: ' ',
                    content: 'Please correct the below information.',
                    container: '#email-message-container',
                    type: 'danger',
                    show: true,
                    dismissable: false
                });
            }
        };
    }]);
 