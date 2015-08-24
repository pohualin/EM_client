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
                        .saveOrUpdateTeamEmailConfiguration($scope.team, $scope.emailConfigs).then(function (response) {
                            $scope.originalEmailConfigs = response;
                            $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
                            $scope.updateRemindersVisibility();

                            $alert({
                                content: '<strong>' + $scope.team.entity.name + '</strong> has been updated successfully.'
                            });
                        }).finally(function () {
                            $scope.whenSaving = false;
                    });

                    $scope.showEmailButton = false;
                }
            };

            /**
             * If user un-checks "Collect Email"
             * "Require Email" needs to automatically un-check.
             */
            $scope.onChangeCollect = function() {
                $scope.showEmailButton = true;

                if (!$scope.emailConfigs.entity.collectEmail) {
                    $scope.emailConfigs.entity.requireEmail = false;
                }

                $scope.updateRemindersVisibility();
            };

            /**
             * If user checks "Require Email"
             * If yes, "Collect Email" needs to automatically check.
             */
            $scope.onChangeRequire = function() {
                $scope.showEmailButton = true;

                if ($scope.emailConfigs.entity.requireEmail) {
                    $scope.emailConfigs.entity.collectEmail = true;
                }

                $scope.updateRemindersVisibility();
            };

            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.cancel = function () {
                $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
                $scope.showEmailButton = false;
                $scope.updateRemindersVisibility();
            };

            $scope.updateReminders = function() {
                $scope.showEmailButton = true;
            };

            $scope.updateRemindersVisibility = function() {
                $scope.showEmailReminders = $scope.emailConfigs.entity.collectEmail;
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
                    $scope.updateRemindersVisibility();
                });
            }

            init();
    }])
;
