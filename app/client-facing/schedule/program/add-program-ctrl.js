'use strict';

angular.module('emmiManager')
    .controller('AddProgramController', ['$scope', '$controller', 'AddProgramService', 'moment', '$alert', '$timeout',
        function ($scope, $controller, AddProgramService, moment, $alert, $timeout) {

            // add common pagination and sorting functions
            $controller('CommonPagination', {$scope: $scope});
            $controller('CommonSort', {$scope: $scope});

            var contentProperty = 'programs';

            $scope.specialties = null;
            $scope.providers = null;
            $scope.locations = null;

            $scope.scheduledProgram = {
                provider: '',
                location: '',
                program: '',
                viewByDate: moment().add(30, 'days').format('YYYY-MM-DD')
            };

            $scope.saveScheduledProgram = function (addProgramForm) {
                $scope.addProgramFormSubmitted = true;
                if ($scope.scheduledProgram.program && addProgramForm.$valid) {
                    // save the scheduled program

                } else {
                    $scope.showError();
                }
            };

            $scope.showAllResults = function (show) {
                $scope.showAll = show;
                if (!show) {
                    performSearch();
                }
            };

            $scope.showError = function () {
                if (!$scope.errorAlert) {
                    $scope.errorAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#add-program-alerts-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                } else {
                    $scope.errorAlert.show();
                }
            };

            var resetViewByDateField = function(form){
                if (form) {
                    $timeout(function () {
                        form.viewByDate.$setViewValue(form.viewByDate.$viewValue);
                    });
                }
            };

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

            $scope.reset = function (form) {
                $scope.selectProgram(null, form);
                $scope.addProgramFormSubmitted = false;
                $scope.showAllResults(false);
            };

            /**
             * The actual 'search' function
             *
             * @param sort the sort component
             * @param size the size of the page
             */
            var performSearch = function (sort, size) {
                AddProgramService.findPrograms($scope.team, sort, size).then(function (programPage) {
                    $scope.handleResponse(programPage, contentProperty);
                });
                // turn off the sort after the search request has been made, the response will rebuild
                $scope.sortProperty = null;
                $scope.scheduledProgram.program = '';
            };

            /**
             * Search again sorting based upon the property
             *
             * @param property to sort on
             */
            $scope.sort = function (property) {
                var sort = $scope.createSortProperty(property);
                performSearch(sort, $scope.currentPageSize);
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
