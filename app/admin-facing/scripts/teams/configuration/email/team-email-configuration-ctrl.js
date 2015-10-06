'use strict';

angular.module('emmiManager')

/**
 *   Manage Team Level configuration a client
 */
    .controller('ClientTeamEmailConfigurationCtrl', ['$scope', '$alert', 'teamResource', 'ClientTeamEmailConfigurationService', 'TeamPrintInstructionConfigurationService',
        function ($scope, $alert, teamResource, ClientTeamEmailConfigurationService, TeamPrintInstructionConfigurationService) {

            /**
             * When the save button is clicked. Sends all updates
             * to the back, then re-binds the form objects with the
             * results
             */
            $scope.saveOrUpdateEmailConfig = function (valid) {
                $scope.formSubmitted = true;
                if (valid) {
                    $scope.whenSaving = true;

                    ClientTeamEmailConfigurationService
                        .saveOrUpdateTeamEmailConfiguration($scope.team, $scope.emailConfigs).then(function (response) {
                            $scope.originalEmailConfigs = response;
                            $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);
                            $scope.updateRemindersVisibility();

                            if ($scope.teamPrintInstructionConfiguration.link.self) {
                                TeamPrintInstructionConfigurationService.update($scope.teamPrintInstructionConfiguration).then(function(response){
                                    $scope.teamPrintInstructionConfiguration = response;
                                });
                            } else {
                                TeamPrintInstructionConfigurationService.save($scope.team, $scope.teamPrintInstructionConfiguration).then(function(response){
                                    $scope.teamPrintInstructionConfiguration = response;
                                });
                            }
                            
                            $alert({
                                content: '<strong>' + $scope.team.entity.name + '</strong> has been updated successfully.'
                            });
                        }).finally(function () {
                            $scope.whenSaving = false;
                            $scope.showEmailButton = false;
                            $scope.formSubmitted = false;
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
                $scope.formSubmitted = false;
                $scope.setEmailOption();
                $scope.updateRemindersVisibility();
            };

            $scope.updateReminders = function() {
                $scope.showEmailButton = true;
            };

            $scope.updateRemindersVisibility = function() {
                $scope.showEmailReminders = $scope.emailConfigs.entity.collectEmail;
            };

            $scope.update = function() {
                if ($scope.emailOptions.selected === $scope.emailOptions[0]) {
                    $scope.emailConfigs.entity.collectEmail = true;
                    $scope.emailConfigs.entity.requireEmail = false;
                } else if ($scope.emailOptions.selected === $scope.emailOptions[1]) {
                    $scope.emailConfigs.entity.collectEmail = true;
                    $scope.emailConfigs.entity.requireEmail = true;
                } else if ($scope.emailOptions.selected === $scope.emailOptions[2]) {
                    $scope.emailConfigs.entity.collectEmail = false;
                    $scope.emailConfigs.entity.requireEmail = false;
                }

                $scope.showEmailButton = true;
                $scope.updateRemindersVisibility();
            };

            $scope.setEmailOption = function() {
                if ($scope.emailConfigs.entity.collectEmail === true) {
                    if ($scope.emailConfigs.entity.requireEmail === true) {
                        $scope.emailOptions.selected = $scope.emailOptions[1];
                    } else {
                        $scope.emailOptions.selected = $scope.emailOptions[0];
                    }
                } else {
                    $scope.emailOptions.selected = $scope.emailOptions[2];
                }
            };

            /**
             * init method called when page is loading
             */
            function init() {
                $scope.showEmailButton = false;
                $scope.showEmailReminders = false;

                $scope.emailOptions = [
                    { id: 'emailExposed', displayText: 'Email exposed', rank: 0 },
                    { id: 'emailExposedRequired', displayText: 'Email exposed and required', rank: 1 },
                    { id: 'dontCollectEmail', displayText: 'Don\'t collect email', rank: 2 }
                ];
                $scope.emailOptions.selected = $scope.emailOptions[0];

                $scope.client = teamResource.entity.client;
                $scope.team = teamResource;

                ClientTeamEmailConfigurationService.getTeamEmailConfiguration($scope.team).then(function (response) {
                    $scope.originalEmailConfigs = response;
                    $scope.emailConfigs = angular.copy($scope.originalEmailConfigs);

                    $scope.setEmailOption();
                    $scope.updateRemindersVisibility();
                });
                
                TeamPrintInstructionConfigurationService.getTeamPrintInstructionConfiguration($scope.team).then(function(response){
                    $scope.teamPrintInstructionConfiguration = response;
                });
            }

            init();
    }])
;
