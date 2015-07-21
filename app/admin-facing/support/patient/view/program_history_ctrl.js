(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Search users across all clients
     */
        .controller('PatientSupportViewProgramHistoryController', ['$scope', function ($scope) {
            /**
             * Called when UserClientUserClientRole panel is toggled
             */
            $scope.toggleScheduledProgramPanel = function (scheduledProgramPanel) {
                if (!scheduledProgramPanel.activePanel || scheduledProgramPanel.activePanel === 0) {
                    scheduledProgramPanel.activePanel = 1;
                } else {
                    scheduledProgramPanel.activePanel = 0;
                }
            };
        }
        ])
    ;
})(window.angular);

