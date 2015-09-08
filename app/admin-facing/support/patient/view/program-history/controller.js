(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Controls the program history block on the patient support screen
     */
        .controller('PatientSupportViewProgramHistoryController', ['$scope', '$alert', '$q',
            'PatientSupportViewProgramHistoryService',
            'PatientSupportDataHolder', '$window',
            function ($scope, $alert, $q, service, holder, $window) {

                /**
                 * Called when program panel is toggled, make a copy of the original program
                 * when the panel is opened so that we can cancel changes
                 */
                $scope.toggleScheduledProgramPanel = function (scheduledProgramResource, form) {
                    if (scheduledProgramResource.showDetails && !form.$dirty) {
                        scheduledProgramResource.showDetails = false;
                    } else {
                        scheduledProgramResource.showDetails = true;
                    }
                    
                    if (!scheduledProgramResource.original) {
                        scheduledProgramResource.original = angular.copy(scheduledProgramResource.entity);
                    }
                };
                
                /**
                 * Called when encounter panel is toggled, make a copy of the original encounter
                 * when the panel is opened so that we can cancel changes
                 */
                $scope.toggleEncounterPanel = function (encounterResource) {
                    if (encounterResource.activePanel === 0) {
                        encounterResource.showDetails = false;
                        if (!encounterResource.original) {
                            encounterResource.original = angular.copy(encounterResource.entity);
                        }
                    }
                };

                /**
                 * Determines if the program has changed
                 *
                 * @param scheduledProgramResource to check
                 * @param form to set pristine (when false) or dirty (when true)
                 * @returns {boolean}
                 */
                $scope.isUnchanged = function (encounterResource, scheduledProgramResource, form, index) {
                    var unchanged = scheduledProgramResource.original ?
                        angular.equals(scheduledProgramResource.entity, scheduledProgramResource.original) : true;
                    // An array of changed forms
                    if (!encounterResource.dirtyForms) {
                        encounterResource.dirtyForms = [];
                    }
                    // A map that holds all updated schedule programs
                    if (!encounterResource.updatedSchedulePrograms) {
                        encounterResource.updatedSchedulePrograms = {};
                    }
                    console.log(unchanged);
                    if (unchanged) {
                        form.$setPristine();
                        encounterResource.dirtyForms = encounterResource.dirtyForms.filter(function (element) {
                            return element.$pristine !== true;
                        });
                        if (encounterResource.updatedSchedulePrograms[index]) {
                            delete encounterResource.updatedSchedulePrograms[index];
                        }
                    } else {
                        form.$setDirty();
                        encounterResource.dirtyForms.push(form);
                        encounterResource.updatedSchedulePrograms[index] = [scheduledProgramResource, form, index];
                    }
                    return unchanged;
                };

                /**
                 * Saves the program resource and re-ups the entity on return
                 * @param scheduledProgramResource
                 * @param form to be submitted
                 */
                $scope.save = function (scheduledProgramResource, form) {
                    if ((form.viewByDate.$dirty && form.$valid) || !form.viewByDate.$dirty) {
                        scheduledProgramResource.whenSaving = true;
                        return service.save(scheduledProgramResource).then(function ok(savedResource) {
                            // created by isn't returned on updates, save it
                            var createdBy = scheduledProgramResource.original.createdBy;
                            // update the original with the newly saved resource
                            angular.extend(scheduledProgramResource.original, savedResource.entity);
                            // put the created by back onto the new original
                            scheduledProgramResource.original.createdBy = createdBy;
                            scheduledProgramResource.entity = angular.copy(scheduledProgramResource.original);
                            scheduledProgramResource.showDetails = false;
                            $alert({
                                content: [
                                    'Program <strong>',
                                    scheduledProgramResource.entity.program.name,
                                    '</strong> has been successfully updated.'
                                ].join(' ')
                            });
                            _paq.push(['trackEvent', 'Form Action', 'Patient Support Program History', 'Save']);
                            return scheduledProgramResource;
                        }).finally(function () {
                            scheduledProgramResource.whenSaving = false;
                        });
                    }
                };
                
                /**
                 * Saves changes made in an encounter
                 */
                $scope.saveEncounter = function (encounterResource) {
                    var allValid = true;
                    // Loop through all changed scheduled programs and see if they are all valid
                    angular.forEach(encounterResource.updatedSchedulePrograms, function (toUpdate) {
                        var form = toUpdate[1];
                        form.programFormSubmitted = true;
                        if (form.viewByDate.$dirty && form.$invalid) {
                            allValid = false;
                        }
                    });
                    
                    if (allValid) {
                        var promises = [];
                        angular.forEach(encounterResource.updatedSchedulePrograms, function (toUpdate) {
                            var deferred = $q.defer();
                            $scope.save(toUpdate[0], toUpdate[1]).then(function(response){
                                // Replace the {{index}} scheduled program with new version
                                angular.extend(encounterResource.original.scheduledPrograms[toUpdate[2]] = response);
                                deferred.resolve(response);
                            });
                            promises.push(deferred.promise);
                        });
                        
                        // Wait until all update requests being processed
                        $q.all(promises).then(function(){
                            $scope.cancelEncounterChanges(encounterResource);
                        });
                    }
                };

                /**
                 * Show the program details section
                 *
                 * @param scheduledProgramResource on this resource
                 */
                $scope.showDetails = function (scheduledProgramResource) {
                    scheduledProgramResource.showDetails = true;
                };
                
                $scope.hideDetails = function (scheduledProgramResource) {
                    scheduledProgramResource.showDetails = false;
                };

                /**
                 * Reverts the entity to it's original state
                 * @param scheduledProgramResource
                 * @param form to be canceled
                 */
                $scope.cancel = function (form) {
                    form.programFormSubmitted = false;
                    form.$setPristine();
                    _paq.push(['trackEvent', 'Form Action', 'Patient Support Program History', 'Cancel']);
                };
                
                $scope.cancelEncounterChanges = function (encounterResource) {
                    angular.forEach(encounterResource.dirtyForms, function (dirtyForm) {
                        $scope.cancel(dirtyForm);
                    });
                    encounterResource.entity = angular.copy(encounterResource.original);
                    encounterResource.dirtyForms = [];
                    encounterResource.updatedSchedulePrograms = {};
                };

                /**
                 * Toggles the program activation to !whatItIsNow
                 * @param scheduledProgramResource to toggle
                 */
                $scope.toggleProgramActivation = function (encounterResource, scheduledProgramResource, form, index) {
                    if (!scheduledProgramResource.original) {
                        scheduledProgramResource.original = angular.copy(scheduledProgramResource.entity);
                    }
                    scheduledProgramResource.entity.active = !scheduledProgramResource.entity.active;
                    $scope.isUnchanged(encounterResource, scheduledProgramResource, form, index);
                };

                /**
                 * When scheduled programs load, set the variable and activate the first one
                 */
                $scope.$on('scheduled-programs-loaded', function () {
                    $scope.encounters = holder.encounters();
                    $scope.scheduledProgramsLoaded = true;
                    if ($scope.encounters.length > 0) {
                        $scope.encounters[0].activePanel = 0;
                        $scope.toggleEncounterPanel($scope.encounters[0]);
                    }
                });

                $scope.goToUser = function (encounterResource) {
                    if (!$scope.loadingUser) {
                        $scope.loadingUser = true;
                        service.createUserLink(encounterResource).then(function (link) {
                            $window.open(link, '_blank');
                        }).finally(function () {
                            $scope.loadingUser = false;
                        });
                    }
                };

            }])
    ;
})(window.angular);

