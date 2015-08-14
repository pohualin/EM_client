'use strict';

angular.module('emmiManager')
    .controller('AddProgramController', ['$scope', '$controller', 'AddProgramService',
        'moment', '$alert', '$timeout', 'ScheduledProgramFactory',
        function ($scope, $controller, AddProgramService, moment, $alert, $timeout, ScheduledProgramFactory) {

            // add common pagination and sorting functions
            $controller('CommonPagination', {$scope: $scope});
            $controller('CommonSort', {$scope: $scope});

            // initial loading
            var contentProperty = 'programs';
            $scope.programSearch = {
                specialty: '',
                query: ''
            };

            /**
             * Watch teamSchdulingConfiguration and set new values to scope
             */
            $scope.$watch(function(){
                return ScheduledProgramFactory.teamSchedulingConfiguration;
            }, function(newValue){
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
                } else {
                    $scope.showError();
                }
            };


            /**
             * When show all is clicked
             * @param show true means show all, false means show top 10 only
             */
            $scope.showAllResults = function (show) {
                var search = !show ? performSearch() :
                    performSearch($scope.programSearch.query, $scope.sortProperty,
                        $scope.currentPageSize, $scope.programSearch.specialty);
                search.finally(function () {
                    $scope.showAll = show;
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
             * Necessary to carry the view by date across versions of the form.
             * This shouldn't be necessary but with out it the view by date is
             * blanked out when the program is selected (or 'edited').
             *
             * @param form on which to find the view by date
             */
            var resetViewByDateField = function (form) {
                if (form) {
                    $timeout(function () {
                        form.viewByDate.$setViewValue(form.viewByDate.$viewValue);
                    });
                }
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
                    $scope.selectedProgramsHolder.push(selectedProgram);
                } else {
                    $scope.selectedProgramsHolder = $scope.selectedProgramsHolder.filter(function (element) {
                        return element.program.entity.id !== programResource.entity.id;
                    });
                }
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
            };

            /**
             * When a location selection is changed, we need to load the providers
             * that are valid for that location
             */
            $scope.onLocationChange = function (selectedProgram) {
                selectedProgram.loadingProviderLocation = true;
                AddProgramService.loadProviders($scope.team, selectedProgram.location).then(
                    function (providers) {
                        selectedProgram.providers = providers;
                        if (providers.length === 1) {
                            selectedProgram.provider = providers[0];
                        }
                    }).finally(function () {
                        selectedProgram.loadingProviderLocation = false;
                    });
            };

            /**
             * When a provider selection has changed, we need to load the
             * list of possible locations for the selected provider
             */
            $scope.onProviderChange = function (selectedProgram) {
                // no location selected, refresh the list of possible locations
                selectedProgram.loadingProviderLocation = true;
                AddProgramService.loadLocations($scope.team, selectedProgram.provider).then(
                    function (locations) {
                        selectedProgram.locations = locations;
                        if (locations.length === 1) {
                            selectedProgram.location = locations[0];
                        }
                    }).finally(function () {
                        selectedProgram.loadingProviderLocation = false;
                    });
            };

            /**
             * When a specialty has been chosen or un-chosen
             */
            $scope.onSpecialtyFilterChange = function () {
                $scope.showAllResults(true);
            };

            $scope.search = function () {
                $scope.showAllResults(true);
            };

            /**
             * @Obsolete
             *
             * Called when the program has already been selected and the
             * user hits 'edit'
             *
             * @param form to be reset (and carry over the view by date)
             */
            $scope.editProgram = function (form) {
                $scope.selectProgram(null, form);
                $scope.addProgramFormSubmitted = false;
                $scope.showAllResults(!!$scope.programSearch.specialty || !!$scope.programSearch.query);
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
                $scope.selectedProgramsHolder = [];
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

            // load the programs
            performSearch();
        }
    ])
;

