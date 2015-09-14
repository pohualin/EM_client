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
                    show: false, backdrop: 'static'
                });

            $scope.hasDuplicateEmailEnding = function(emailEnding) {
                var duplicate = false;
                var emailConfigurations = EmailRestrictConfigurationsService.getEmailRestrictConfigurations();

                for (var i = 0, len = emailConfigurations.length; i < len; i++) {
                    if (emailConfigurations[i].entity.emailEnding === emailEnding) {
                        duplicate = true;
                        break;
                    }
                }

                return duplicate;
            };

            /**
             * Called when add another is clicked to add a new emailRestrictConfiguration
             */
            $scope.addAnotherEmailRestrict = function () {
                $scope.emailRestrictConfiguration = EmailRestrictConfigurationsService.newEmailRestrictConfiguration();
                addEmailRestrictModal.$promise.then(addEmailRestrictModal.show);
            };

            /**
             * Call service to add the valid emailRestrictConfiguration or show error banner
             */
            $scope.add = function (emailRestrictConfigurationForm, addAnother) {
                $scope.emailRestrictConfigurationFormSubmitted = true;
                emailRestrictConfigurationForm.emailEnding.duplicate = false;

                var duplicate = $scope.hasDuplicateEmailEnding($scope.emailRestrictConfiguration.entity.emailEnding.toLowerCase());

                if (emailRestrictConfigurationForm.$valid && !duplicate) {
                    $scope.whenSaving = true;

                    $scope.emailRestrictConfiguration.entity.emailEnding = $scope.emailRestrictConfiguration.entity.emailEnding.toLowerCase();

                    EmailRestrictConfigurationsService.save($scope.emailRestrictConfiguration).then(
                        function success(response) {
                            $alert({
                                content: '<b>' + $scope.client.name + '</b> has been updated successfully.'
                            });

                            $scope.$emit('requestEmailList');
                            $scope.emailRestrictConfiguration = EmailRestrictConfigurationsService.newEmailRestrictConfiguration();
                            $scope.emailRestrictConfigurationFormSubmitted = false;

                            if (!addAnother) {
                                $scope.$hide();
                            }

                            EmailRestrictConfigurationsService.getEmailsThatDoNotFollowRestrictions().then(function (emailsThatDoNotFollowRestrictions) {
                                $scope.setEmailsThatDoNotFollowRestrictions(emailsThatDoNotFollowRestrictions);
                            });
                        }, function error(response) {
                            if (response.status === 406) {
                                emailRestrictConfigurationForm.emailEnding.duplicate = true;
                                $scope.showErrorBanner();
                            } else {
                                $alert({
                                    content: '<b>ERROR:</b> ' + $scope.client.name + ' has not been updated.',
                                    type: 'danger'
                                });
                            }
                        }
                    ).finally(function () {
                        $scope.whenSaving = false;
                    });
                } else {
                    if (duplicate) {
                        emailRestrictConfigurationForm.emailEnding.duplicate = true;
                    }

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
