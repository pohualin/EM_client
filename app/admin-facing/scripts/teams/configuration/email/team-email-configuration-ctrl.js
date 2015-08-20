'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamEmailConfigurationCtrl', ['$scope', '$alert', 'teamResource', 'ClientTeamEmailConfigurationService',
        function ($scope, $alert, teamResource, ClientTeamEmailConfigurationService) {

            /**
             * When the save button is clicked. Sends all updates
             * to the back, then re-binds the form objects with the
             * results
             */
            $scope.saveOrUpdateEmailConfig = function (valid) {
                if (valid) {
                    $scope.whenSaving = true;

                    ClientTeamEmailConfigurationService
                          .saveOrUpdateTeamEmailConfiguration($scope.team, $scope.emailConfigs).then(function(response) {
                                $scope.originalEmailConfigs = response;
                                $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
                                $scope.bindReminders($scope.emailConfigs);

                                $alert({
                                    title: '',
                                    content: '<strong>' + $scope.team.entity.name + '</strong> has been updated successfully.',
                                    container: 'body',
                                    type: 'success',
                                    placement: 'top',
                                    show: true,
                                    duration: 5,
                                    dismissable: true
                                });
                             }).finally(function () {
                              $scope.whenSaving = false;
                          });
                    $scope.showEmailButton = false;
                }
            };

            /**
             * If user checks "Require email"
             * "Collect email" needs to automatically check.
             * If user un-check "Collect email"
             * "Require email" needs to un-check
             */
             $scope.onChange = function(emailConfig) {
                $scope.showEmailButton = true;

                if (angular.equals(emailConfig.entity.type, 'COLLECT_EMAIL')) {
                    $scope.showEmailReminders = emailConfig.entity.emailConfig;
                }

                // If the type is REQUIRE_EMAIL and it is true
                if (angular.equals(emailConfig.entity.type, 'REQUIRE_EMAIL') && (emailConfig.entity.emailConfig)) {
                    // Loop thru the emailConfigs again and find the COLLECT_EMAIL type and set it to true
                    angular.forEach($scope.emailConfigs, function (email) {
                        if(angular.equals(email.entity.type, 'COLLECT_EMAIL')){
                            email.entity.emailConfig = true;
                            $scope.showEmailReminders = emailConfig.entity.emailConfig;
                        }
                    });
                } else if (angular.equals(emailConfig.entity.type, 'COLLECT_EMAIL') && (!emailConfig.entity.emailConfig)) {
                    // Loop thru the emailConfigs again and find the REQUIRE_EMAIL type and set it to false
                    angular.forEach($scope.emailConfigs, function (email) {
                        if(angular.equals(email.entity.type, 'REQUIRE_EMAIL')){
                            email.entity.emailConfig = false;
                        }
                    });
                }
            };

            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.cancel = function () {
                $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
                $scope.showEmailButton = false;
                $scope.bindReminders($scope.emailConfigs);
            };

            $scope.bindReminders = function(emailConfigs) {
                angular.forEach(emailConfigs, function (email) {
                    if (angular.equals(email.entity.type, 'COLLECT_EMAIL')) {
                        $scope.showEmailReminders = email.entity.emailConfig;
                        $scope.emailReminderConfigs = email;
                    }
                });
            };

            /**
             * init method called when page is loading
             */
            function init() {
                $scope.showEmailButton = false;
                $scope.showEmailReminders = false;

                $scope.client = teamResource.entity.client;
                $scope.team = teamResource;

                ClientTeamEmailConfigurationService.getTeamEmailConfiguration($scope.team).then(function (response) {
                    $scope.originalEmailConfigs = response;
                    $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
                    $scope.bindReminders($scope.emailConfigs);
                });
            }

            init();
    }])
;
