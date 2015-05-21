'use strict';

angular.module('emmiManager')

/**
 * Controller for EmailRestrictConfiguration
 */
.controller('AddEmailRestrictConfigurationController', ['$scope', '$alert', '$controller', '$modal', 'EmailRestrictConfigurationsService',
    function ($scope, $alert, $controller, $modal, EmailRestrictConfigurationsService) {

        var addEmailRestrictModal = $modal(
                {scope: $scope,
                 template: 'admin-facing/partials/configurations/restriction/email-form.html',
                 animation: 'none',
                 backdropAnimation: 'emmi-fade',
                 show: false, backdrop: 'static'});

        /**
         * Called when add another is clicked to add a new emailRestrictConfiguration
         */
        $scope.addAnotherEmailRestrict = function(emailRestrictConfigurationForm){
            $scope.emailRestrictConfiguration = EmailRestrictConfigurationsService.newEmailRestrictConfiguration();
            addEmailRestrictModal.$promise.then(addEmailRestrictModal.show);
        };

        /**
         * Call service to add the valid emailRestrictConfiguration or show error banner
         */
        $scope.add = function(emailRestrictConfigurationForm, addAnother){
            $scope.emailRestrictConfigurationFormSubmitted = true;
            if(emailRestrictConfigurationForm.$valid){
                EmailRestrictConfigurationsService.save($scope.emailRestrictConfiguration).then(function(response){
                    $scope.listExisting();
                    $scope.emailRestrictConfiguration = EmailRestrictConfigurationsService.newEmailRestrictConfiguration();
                    $scope.emailRestrictConfigurationFormSubmitted = false;
                    if(!addAnother){
                        $scope.$hide();
                    }
                    $alert({
                        content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                    });
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
                    content: 'Please correct the below information.',
                    container: '#email-message-container',
                    type: 'danger',
                    placement: '',
                    duration: false,
                    dismissable: false
                });
            }
        };
    }]);
