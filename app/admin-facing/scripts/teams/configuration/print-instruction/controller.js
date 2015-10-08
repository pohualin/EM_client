'use strict';

angular.module('emmiManager')

/**
 * Controller to handle Team level print instructions configuration
 */
.controller('TeamPrintInstructionConfigurationController', ['$scope', '$alert', 'TeamPrintInstructionConfigurationService', 'TeamEmailNotificationsAndPrintInstructionsControllerFactory',
    function ($scope, $alert, TeamPrintInstructionConfigurationService, TeamEmailNotificationsAndPrintInstructionsControllerFactory) {

        /**
         * Save or update print instruction configuration
         * Reset form
         */
        $scope.$on('event:save-or-update-print-instruction-configuration', function (event, args) {
            TeamPrintInstructionConfigurationService
                .saveOrUpdate(TeamEmailNotificationsAndPrintInstructionsControllerFactory.team, 
                        $scope.teamPrintInstructionConfiguration).then(function(response){
                    $scope.initialCopy = response;
                    $scope.teamPrintInstructionConfiguration = angular.copy($scope.initialCopy);
                    
                    $alert({
                        content: '<strong>' + TeamEmailNotificationsAndPrintInstructionsControllerFactory.team.entity.name + '</strong> has been updated successfully.'
                    });
                }).finally(function () {
                    TeamEmailNotificationsAndPrintInstructionsControllerFactory.reset();
                });
        });
        
        /**
         * Reset print instruction configuration when cancel button is clicked
         */
        $scope.$on('event:reset-print-instruction-configuration', function () {
            $scope.teamPrintInstructionConfiguration = angular.copy($scope.initialCopy);
        });
        
        $scope.$watch(function () {
            return TeamEmailNotificationsAndPrintInstructionsControllerFactory.formSubmitted;
        }, function (newVal) {
            $scope.formSubmitted = newVal;
        });
        
        $scope.$watch(function () {
            return TeamEmailNotificationsAndPrintInstructionsControllerFactory.whenSaving;
        }, function (newVal) {
            $scope.whenSaving = newVal;
        });
        
        function init() {
            TeamPrintInstructionConfigurationService.getTeamPrintInstructionConfiguration(TeamEmailNotificationsAndPrintInstructionsControllerFactory.team).then(function(response){
                $scope.initialCopy = response;
                $scope.teamPrintInstructionConfiguration = angular.copy($scope.initialCopy);
            });
        }
        
        init();
}]);