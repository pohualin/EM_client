(function (angular) {
    'use strict';

    angular.module('emmiManager')
        .controller('AddProgramController', ['$scope', '$q', '$controller', 'AddProgramService',
            'moment', '$alert', '$timeout', 'ScheduledProgramFactory', 'focus',
            function ($scope, $q, $controller, AddProgramService, moment, $alert, $timeout, ScheduledProgramFactory, focus) {

                // add common pagination and sorting functions
                $controller('ClientCommonPagination', {$scope: $scope});
                $controller('ClientCommonSort', {$scope: $scope});

                // initial loading
                var contentProperty = 'programs';
                $scope.resultsPerPage = 50;
                $scope.programSearch = {
                    specialty: '',
                    query: ''
                };
                $scope.programSearchPerformed = false;
                $scope.firstProgramResource = {
                    provider: '',
                    location: '',
                    viewByDate: '',
                    use: true
                };

                $scope.fiveYearsFromTodayString = moment().startOf('day').add(5, 'year').format('MM/DD/YYYY');

                /**
                 * Watch teamSchedulingConfiguration and set new values to scope
                 * TODO: required data should be loaded during the route
                 */
                $scope.$watch(function () {
                    return ScheduledProgramFactory.teamSchedulingConfiguration;
                }, function (newValue) {
                    $scope.teamSchedulingConfiguration = newValue ? newValue.entity : {};
                    if ($scope.teamSchedulingConfiguration && $scope.teamSchedulingConfiguration.useLocation) {
                        AddProgramService.loadLocations($scope.team).then(function (locations) {
                            $scope.locations = locations;
                        });
                    }
                    if ($scope.teamSchedulingConfiguration && $scope.teamSchedulingConfiguration.useProvider) {
                        AddProgramService.loadProviders($scope.team).then(function (providers) {
                            $scope.providers = providers;
                        });
                    }
                });

                AddProgramService.loadSpecialties($scope.team).then(function (specialties) {
                    $scope.specialties = specialties;
                });

                $scope.patient = ScheduledProgramFactory.patient;
                $scope.selectedPrograms = [];
                $scope.selectedProgramsHolder = [];

                /**
                 * When a keyword search happens
                 */
                $scope.search = function () {
                    $scope.programSearchPerformed = true;
                    $scope.inputSearching = true;
                    $scope.showAllResults(true).then(function () {
                        $scope.inputSearched = true; // when someone searches from the keyword input
                        focus('keyword');
                    });
                };

                /**
                 * Clears the query string and re-searches
                 */
                $scope.clearSearch = function () {
                    $scope.programSearchPerformed = true;
                    $scope.programSearch.query = '';
                    $scope.showAllResults(true).then(function () {
                        $scope.inputSearched = false;
                        focus('keyword');
                    });
                };

                /**
                 * When a specialty has been chosen or un-chosen
                 */
                $scope.onSpecialtyFilterChange = function () {
                    $scope.programSearchPerformed = true;
                    $scope.showAllResults(true);
                };

                /**
                 * When show all is clicked
                 * @param show true means show all, false means show top 10 only
                 */
                $scope.showAllResults = function (show) {
                    $scope.selectedProgramsHolder = []; // clear selected programs on all searches
                    var search = !show ? performSearch() : performSearch($scope.programSearch.query,
                        $scope.sortProperty, $scope.resultsPerPage, $scope.programSearch.specialty);
                    return search.finally(function () {
                        $scope.showAll = show;
                    });
                };

                /**
                 * When 'see more results' is clicked (very similar to fetchPage)
                 *
                 * @param href to use for the data call
                 */
                $scope.showMoreResults = function (href) {
                    $scope.loading = true;
                    AddProgramService.fetchProgramPage(href).then(function (programPage) {
                        var previousResults = $scope[contentProperty];
                        $scope.handleResponse(programPage, contentProperty);
                        $scope[contentProperty] = previousResults.concat($scope[contentProperty]);
                        previousResults = null;
                        $scope.setSelectedProgramsCheckbox();
                    });
                };

                /**
                 * When there is a problem with the form
                 */
                $scope.showError = function () {
                    if (!$scope.errorAlert) {
                        $scope.errorAlert = $alert({
                            content: 'Please correct the below information.',
                            container: '#add-program-alerts-container',
                            type: 'danger',
                            show: true,
                            placement: '',
                            duration: false,
                            dismissable: false
                        });
                    } else {
                        $scope.errorAlert.show();
                    }
                };

                /**
                 * The actual 'search' function
                 *
                 * @param sort the sort component
                 * @param size the size of the page
                 * @param specialty to filter the results on
                 * @param query typed by the user in the search box
                 */
                var performSearch = function (query, sort, size, specialty) {
                    $scope.searching = true;
                    return AddProgramService.findPrograms(query, $scope.team, sort, size, specialty).then(function (programPage) {
                        $scope.handleResponse(programPage, contentProperty);
                        $scope.setSelectedProgramsCheckbox();
                        return programPage;
                    }).finally(function () {
                        $scope.searching = false;
                        $scope.inputSearching = false;
                    });
                };

                /**
                 * Search again sorting based upon the property
                 *
                 * @param property to sort on
                 */
                $scope.sort = function (property) {
                    var sort = $scope.createSortProperty(property);
                    performSearch($scope.programSearch.query, sort, $scope.currentPageSize, $scope.programSearch.specialty);
                };

                /**
                 * Fetches a page from a pagination link
                 *
                 * @param href to use for the data call
                 */
                $scope.fetchPage = function (href) {
                    $scope.loading = true;
                    AddProgramService.fetchProgramPage(href).then(function (programPage) {
                        $scope.handleResponse(programPage, contentProperty);
                        $scope.setSelectedProgramsCheckbox();
                    });
                };

                /**
                 * Call when ADD SELECTED button is clicked
                 * Add all selected programs from selectedProgramsHolder to selectedPrograms
                 * Clear selectedProgramsHolder
                 */
                $scope.addSelectedPrograms = function () {

                    $scope.selectedPrograms = $scope.selectedPrograms.concat($scope.selectedProgramsHolder);
                    angular.forEach($scope.selectedProgramsHolder, function (programInHolder) {
                        $scope.programs.filter(function (element) {
                            if (element.entity.id === programInHolder.program.entity.id) {
                                element.disabled = true;
                            }
                        });
                    });
                    $scope.handleUseInformationForAllPrograms();
                    $scope.selectedProgramsHolder = [];
                };

                /**
                 * When a program is selected
                 *
                 * @param programResource to be selected
                 */
                $scope.selectProgram = function (programResource) {
                    if (programResource.selected) {
                        var selectedProgram = AddProgramService.newScheduledProgram();
                        selectedProgram.program = programResource;
                        selectedProgram.providers = $scope.providers;
                        selectedProgram.locations = $scope.locations;

                        // Set provider if there is only one possible provider
                        if ($scope.providers && $scope.providers.length === 1) {
                            selectedProgram.provider = $scope.providers[0];
                            $scope.onProviderChange(selectedProgram);
                        }

                        // Set location if there is only one possible location
                        if ($scope.locations && $scope.locations.length === 1) {
                            selectedProgram.location = $scope.locations[0];
                            $scope.onLocationChange(selectedProgram);
                        }
                        $scope.selectedProgramsHolder.push(selectedProgram);
                    } else {
                        $scope.selectedProgramsHolder = $scope.selectedProgramsHolder.filter(function (element) {
                            return element.program.entity.id !== programResource.entity.id;
                        });
                    }
                };

                /**
                 * Called when the row is clicked
                 * @param programResource
                 */
                $scope.toggleSelectedProgram = function (programResource) {
                    programResource.selected = !programResource.selected;
                    $scope.selectProgram(programResource);
                };

                /**
                 * Remove a schedule program card
                 */
                $scope.deselectProgram = function (programResource) {
                    $scope.programs.filter(function (element) {
                        if (element.entity.id === programResource.program.entity.id) {
                            element.selected = false;
                            element.disabled = false;
                        }
                    });
                    $scope.selectedPrograms = $scope.selectedPrograms.filter(function (element) {
                        return element.program.entity.id !== programResource.program.entity.id;
                    });
                    $scope.handleUseInformationForAllPrograms();
                };

                /**
                 * When a location selection is changed, we need to load the providers
                 * that are valid for that location
                 *
                 * @param selectedProgram that was changed
                 * @param isFirst is this the first program in the list
                 */
                $scope.onLocationChange = function (selectedProgram, isFirst) {
                    if (!isFirst) {
                        // changing not the first program which means 'use all is false'
                        $scope.firstProgramResource.use = false;
                    }
                    if ($scope.teamSchedulingConfiguration && $scope.teamSchedulingConfiguration.useProvider) {
                        selectedProgram.loadingProviderLocation = true;
                        AddProgramService.loadProviders($scope.team, selectedProgram.location).then(
                            function (providers) {
                                selectedProgram.providers = providers;
                                if (selectedProgram.providers.length === 1 && selectedProgram.location !== '') {
                                    selectedProgram.provider = providers[0];
                                }
                            }).finally(function () {
                                selectedProgram.loadingProviderLocation = false;
                                $scope.handleUseInformationForAllPrograms();
                            });
                    } else {
                        $scope.handleUseInformationForAllPrograms();
                    }
                };

                /**
                 * When a provider selection has changed, we need to load the
                 * list of possible locations for the selected provider
                 *
                 * @param selectedProgram that was changed
                 * @param isFirst is this the first program in the list
                 */
                $scope.onProviderChange = function (selectedProgram, isFirst) {
                    if (!isFirst) {
                        // changing not the first program which means 'use all is false'
                        $scope.firstProgramResource.use = false;
                    }
                    if ($scope.teamSchedulingConfiguration && $scope.teamSchedulingConfiguration.useLocation) {
                        // no location selected, refresh the list of possible locations
                        selectedProgram.loadingProviderLocation = true;
                        AddProgramService.loadLocations($scope.team, selectedProgram.provider).then(
                            function (locations) {
                                selectedProgram.locations = locations;
                                if (selectedProgram.locations.length === 1 && selectedProgram.provider !== '') {
                                    selectedProgram.location = locations[0];
                                }
                            }).finally(function () {
                                selectedProgram.loadingProviderLocation = false;
                                $scope.handleUseInformationForAllPrograms();
                            });
                    } else {
                        $scope.handleUseInformationForAllPrograms();
                    }
                };

                /**
                 * When the view by date changes
                 *
                 * @param selectedProgram that was changed
                 * @param isFirst is this the first program in the list
                 */
                $scope.onViewByDateChange = function (selectedProgram, isFirst) {
                    if (selectedProgram.viewByDate && !selectedProgram.viewByDate.$error) {
                        if (!isFirst) {
                            // changing not the first program which means 'use all is false'
                            $scope.firstProgramResource.use = false;
                        }
                        $scope.handleUseInformationForAllPrograms();
                    }
                };

                $scope.$on('event:update-patient-and-programs', function () {
                    $scope.saveScheduledProgram($scope.addProgramForm);
                });

                /**
                 * When the 'finish scheduling' button is clicked
                 * @param addProgramForm to save
                 */
                $scope.saveScheduledProgram = function (addProgramForm) {
                    $scope.addProgramFormSubmitted = true;
                    if (addProgramForm.$valid && $scope.selectedPrograms.length !== 0) {
                        // save the scheduled program
                        ScheduledProgramFactory.selectedPrograms = $scope.selectedPrograms;
                    }
                };

                /**
                 * Set checkbox to selected and disabled when the program is already added
                 * Set checkbox to selected when the program is in holder but yet added
                 */
                $scope.setSelectedProgramsCheckbox = function () {
                    angular.forEach($scope.programs, function (program) {
                        $scope.selectedPrograms.filter(function (element) {
                            if (element.program.entity.id === program.entity.id) {
                                program.selected = true;
                                program.disabled = true;
                            }
                        });

                        $scope.selectedProgramsHolder.filter(function (element) {
                            if (element.program.entity.id === program.entity.id) {
                                program.selected = true;
                            }
                        });
                    });
                };

                /**
                 * This method ensures that the firstProgramResource points to the proper place
                 * and that all selected programs match this first program when 'use information above
                 * for all programs' is checked
                 */
                $scope.handleUseInformationForAllPrograms = function () {
                    if ($scope.firstProgramResource.use) {
                        $scope.firstProgramResource.provider = $scope.selectedPrograms[0].provider;
                        $scope.firstProgramResource.location = $scope.selectedPrograms[0].location;
                        $scope.firstProgramResource.viewByDate = $scope.selectedPrograms[0].viewByDate;
                        $scope.firstProgramResource.locations = $scope.selectedPrograms[0].locations;
                        $scope.firstProgramResource.providers = $scope.selectedPrograms[0].providers;
                        angular.forEach($scope.selectedPrograms, function (program) {
                            program.provider = $scope.firstProgramResource.provider;
                            program.location = $scope.firstProgramResource.location;
                            program.providers = $scope.firstProgramResource.providers;
                            program.locations = $scope.firstProgramResource.locations;
                            program.viewByDate = $scope.firstProgramResource.viewByDate;
                        });
                    }
                };

                // load the programs
                performSearch();
            }
        ])
    ;
})(window.angular);

