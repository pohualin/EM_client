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
                specialty: ''
            };
            $scope.scheduledProgram = AddProgramService.newScheduledProgram();
            
            AddProgramService.loadSpecialties($scope.team).then(function (specialties) {
                $scope.specialties = specialties;
            });
            
            AddProgramService.loadSchedulingConfigurations($scope.team).then(function(response){
            	$scope.useLocation = response.useLocation;
                $scope.useProvider = response.useProvider;
                ScheduledProgramFactory.useLocation = $scope.useLocation;
                ScheduledProgramFactory.useProvider = $scope.useProvider;
                if($scope.useLocation){
                	AddProgramService.loadLocations($scope.team).then(function (locations) {
                		$scope.locations = locations;
                       });
                }
                if($scope.useProvider){
                	AddProgramService.loadProviders($scope.team).then(function (providers) {
                		$scope.providers = providers;
                       });
                }
            });
            $scope.$on('event:update-patient-and-programs', function(){
                $scope.saveScheduledProgram($scope.addProgramForm);
            });


            /**
             * When the 'finish scheduling' button is clicked
             * @param addProgramForm to save
             */
            $scope.saveScheduledProgram = function (addProgramForm) {
            	$scope.addProgramFormSubmitted = true;
            	ScheduledProgramFactory.scheduledProgram = $scope.scheduledProgram;
                if (($scope.scheduledProgram.program !== null) &&
                     !(addProgramForm.$valid)) {
                    $scope.showError();
                }
            };

            /**
             * When show all is clicked
             * @param show true means show all, false means show top 10 only
             */
            $scope.showAllResults = function (show) {
                var search = !show ? performSearch() :
                    performSearch($scope.sortProperty,
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
             * @param form for date carrying function
             */
            $scope.selectProgram = function (programResource, form) {
            	resetViewByDateField(form);
                if ($scope.scheduledProgram.program) {
                	$scope.scheduledProgram.program.selected = false;
                }
                if (programResource && programResource.selected) {
                	$scope.scheduledProgram.program = programResource;
                } else {
                	$scope.scheduledProgram.program = '';
                }
            };
            
            

            /**
             * When a location selection is changed, we need to load the providers
             * that are valid for that location
             */
            $scope.onLocationChange = function () {
            	$scope.loadingProviderLocation = true;
                AddProgramService.loadProviders($scope.team, $scope.scheduledProgram.location).then(
                    function (providers) {
                    	$scope.providers = providers;
                        if (providers.length === 1) {
                        	$scope.scheduledProgram.provider = providers[0];
                        }
                    }).finally(function () {
                        $scope.loadingProviderLocation = false;
                    });
            };

            /**
             * When a provider selection has changed, we need to load the
             * list of possible locations for the selected provider
             */
            $scope.onProviderChange = function () {
                // no location selected, refresh the list of possible locations
            	$scope.loadingProviderLocation = true;
                AddProgramService.loadLocations($scope.team, $scope.scheduledProgram.provider).then(
               			function (locations) {
               				$scope.locations = locations;
                			if (locations.length === 1) {
                				$scope.scheduledProgram.location = locations[0];
                			}
                			}).finally(function () {
                			    $scope.loadingProviderLocation = false;
               	});
              
            };

            /**
             * When a specialty has been chosen or un-chosen
             */
            $scope.onSpecialtyFilterChange = function () {
                $scope.showAllResults(true);
            };

            /**
             * Called when the program has already been selected and the
             * user hits 'edit'
             *
             * @param form to be reset (and carry over the view by date)
             */
            $scope.editProgram = function (form) {
                $scope.selectProgram(null, form);
                $scope.addProgramFormSubmitted = false;
                $scope.showAllResults(!!$scope.programSearch.specialty);
            };

            /**
             * The actual 'search' function
             *
             * @param sort the sort component
             * @param size the size of the page
             * @param specialty to filter the results on
             */
            var performSearch = function (sort, size, specialty) {
                $scope.scheduledProgram.program = '';
                return AddProgramService.findPrograms($scope.team, sort, size, specialty).then(function (programPage) {
                    $scope.handleResponse(programPage, contentProperty);
                    return programPage;
                });
            };

            /**
             * Search again sorting based upon the property
             *
             * @param property to sort on
             */
            $scope.sort = function (property) {
                var sort = $scope.createSortProperty(property);
                performSearch(sort, $scope.currentPageSize, $scope.programSearch.specialty);
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
                });
                $scope.scheduledProgram.program = '';
            };

            // load the programs
            performSearch();
        }
    ])
;
