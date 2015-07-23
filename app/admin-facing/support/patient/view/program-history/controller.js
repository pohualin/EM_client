(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Controls the program history block on the patient support screen
     */
        .controller('PatientSupportViewProgramHistoryController', ['$scope', 'PatientSupportViewProgramHistoryService',
            'PatientSupportDataHolder',
            function ($scope, service, holder) {

                /**
                 * Called when program panel is toggled, make a copy of the original program
                 * when the panel is opened so that we can cancel changes
                 */
                $scope.toggleScheduledProgramPanel = function (scheduledProgramResource) {
                    if (scheduledProgramResource.activePanel === 0 && !scheduledProgramResource.original) {
                        scheduledProgramResource.original = angular.copy(scheduledProgramResource.entity);
                    }
                };

                /**
                 * Determines if the program has changed
                 *
                 * @param scheduledProgramResource to check
                 * @param form to set pristine (when false) or dirty (when true)
                 * @returns {boolean}
                 */
                $scope.isUnchanged = function (scheduledProgramResource, form) {
                    var unchanged = scheduledProgramResource.original ?
                        angular.equals(scheduledProgramResource.entity, scheduledProgramResource.original) : true;
                    if (unchanged) {
                        form.$setPristine();
                    } else {
                        form.$setDirty();
                    }
                    return unchanged;
                };

                /**
                 * Saves the program resource and re-ups the entity on return
                 * @param scheduledProgramResource
                 * @param form to be submitted
                 */
                $scope.save = function (scheduledProgramResource, form) {
                    form.programFormSubmitted = true;
                    if ((form.viewByDate.$dirty && form.$valid) || !form.viewByDate.$dirty) {
                        scheduledProgramResource.whenSaving = true;
                        service.save(scheduledProgramResource).then(function ok(savedResource) {
                            scheduledProgramResource.original = savedResource.entity;
                            $scope.cancel(scheduledProgramResource, form);
                        }).finally(function () {
                            scheduledProgramResource.whenSaving = false;
                        });
                    }
                };

                /**
                 * Reverts the entity to it's original state
                 * @param scheduledProgramResource
                 * @param form to be canceled
                 */
                $scope.cancel = function (scheduledProgramResource, form) {
                    scheduledProgramResource.entity = angular.copy(scheduledProgramResource.original);
                    form.programFormSubmitted = false;
                    form.$setPristine();
                };

                /**
                 * Toggles the program activation to !whatItIsNow
                 * @param scheduledProgramResource to toggle
                 */
                $scope.toggleProgramActivation = function (scheduledProgramResource) {
                    scheduledProgramResource.entity.active = !scheduledProgramResource.entity.active;
                };

                /**
                 * When scheduled programs load, set the variable and activate the first one
                 */
                $scope.$on('scheduled-programs-loaded', function () {
                    $scope.scheduledPrograms = holder.scheduledPrograms();
                    $scope.scheduledProgramsLoaded = true;
                    if ($scope.scheduledPrograms.length > 0) {
                        $scope.scheduledPrograms[0].activePanel = 0;
                        $scope.toggleScheduledProgramPanel($scope.scheduledPrograms[0]);
                    }
                });

            }])
    ;
})(window.angular);

