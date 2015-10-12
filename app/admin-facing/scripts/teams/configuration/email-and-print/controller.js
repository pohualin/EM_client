(function (angular) {
'use strict';

angular.module('emmiManager')

/**
 * Parent Controller to manage Team level email notifications controller and print instructions configuration controller
 */
    .controller('TeamEmailNotificationsAndPrintInstructionsController', ['$scope', '$alert', 'teamResource',
        'TeamEmailNotificationsAndPrintInstructionsControllerFactory',
    function ($scope, $alert, teamResource, TeamEmailNotificationsAndPrintInstructionsControllerFactory) {

        /**
         * When the save button is clicked. Sends all updates
         * to the back, then re-binds the form objects with the
         * results
         */
        $scope.save = function (form) {
            TeamEmailNotificationsAndPrintInstructionsControllerFactory.formSubmitted = true;
            if (form.$valid) {
                TeamEmailNotificationsAndPrintInstructionsControllerFactory.whenSaving = true;
                $scope.$broadcast('event:save-or-update-email-notification-configuration', form);
            }
        };

        /**
         * Called when cancel is clicked.. takes the original
         * objects and copies them back into the bound objects.
         */
        $scope.cancel = function () {
            $scope.$broadcast('event:reset-email-notification-configuration');
            $scope.$broadcast('event:reset-print-instruction-configuration');
            TeamEmailNotificationsAndPrintInstructionsControllerFactory.reset(teamResource);
        };

        $scope.$watch(function () {
                return TeamEmailNotificationsAndPrintInstructionsControllerFactory.showButton;
            }, function(newVal) {
                $scope.showButton = newVal;
        });

        /**
         * init method called when page is loading
         */
        function init() {
            $scope.showButton = false;
            $scope.client = teamResource.entity.client;
            $scope.team = teamResource;
            TeamEmailNotificationsAndPrintInstructionsControllerFactory.reset(teamResource);
        }

        init();
    }]);
})(window.angular);
