'use strict';

angular.module('emmiManager')

/**
 * Controller to handle Team level print instructions configuration
 */
.controller('TeamPrintInstructionConfigurationController', ['$scope', '$alert', 'TeamPrintInstructionConfigurationService',
    function ($scope, $alert, TeamPrintInstructionConfigurationService) {

        /**
         * Save or update print instruction configuration
         * Fire event to reset form
         */
        $scope.$on('event:save-or-update-print-instruction-configuration', function (event, args) {
            TeamPrintInstructionConfigurationService
                .saveOrUpdate($scope.team, $scope.teamPrintInstructionConfiguration).then(function(response){
                    $scope.initialCopy = response;
                    $scope.teamPrintInstructionConfiguration = angular.copy($scope.initialCopy);
                    
                    $alert({
                        content: '<strong>' + $scope.team.entity.name + '</strong> has been updated successfully.'
                    });
                }).finally(function () {
                    $scope.resetFlags();
                });
        });
        
        /**
         * Reset print instruction configuration when cancel button is clicked
         */
        $scope.$on('event:reset-print-instruction-configuration', function () {
            $scope.teamPrintInstructionConfiguration = angular.copy($scope.initialCopy);
        });
    
        function init() {
            TeamPrintInstructionConfigurationService.getTeamPrintInstructionConfiguration($scope.team).then(function(response){
                $scope.initialCopy = response;
                $scope.teamPrintInstructionConfiguration = angular.copy($scope.initialCopy);
            });
        }

        init();
}]);