'use strict';

angular.module('emmiManager')

/**
 * Controller for ClientProgramContentInclusionConfiguration page
 */
    .controller('AddProgramContentInclusionController', ['$alert', '$scope', '$controller', '$modal', 'Client', 'SelectAllProgramContentsFactory', 'AddProgramsFactory', 'ProgramContentInclusionService', 
        function ($alert, $scope, $controller, $modal, Client, SelectAllProgramContentsFactory, AddProgramsFactory, ProgramContentInclusionService) {
       
    	// Inclusion story EM-1646
    	
        $scope.noneSelected = true;
       
        // add common pagination and sorting functions
        $controller('CommonPagination', {$scope: $scope});
        $controller('CommonSort', {$scope: $scope});
        
        var managedClientProgramList = 'programs';
        $scope.totalPossibleClientProgramsCount = 0;
        
        // initial loading
        var contentProperty = 'programs';
        $scope.resultsPerPage = 10;
        $scope.programSearch = {
            specialty: '',
            query: ''
        };
        $scope.programSearchPerformed = false;
        $scope.selectedProgramsHolder = [];
               
        /**
         * Add program inclusion to a client
         */
        $scope.addPrograms  = function (activeTab) {
        	 // return ProgramContentInclusionService.getClientProgramContentInclusion().then(function (clientProgramInclusion) {
              var programContentTemplate = 'admin-facing/partials/configurations/program-content/program-inclusion/add/search-program-content-inclusion-tabs.html';
   			  $scope.activeTab = activeTab ? activeTab : 0;
		      $modal({
   			      scope: $scope,
                  template: programContentTemplate,
                  animation: 'none',
                  backdropAnimation: 'emmi-fade',
                  show: true,
                  backdrop: 'static'});
       	  // });
        };
        
        ProgramContentInclusionService.getSpecialtiesList().then(function (specialties) {
            $scope.specialties = specialties;
        });
        
        /**
         * When a specialty has been chosen or un-chosen
         */
        $scope.onSpecialtyFilterChange = function () {
            $scope.programSearchPerformed = true;
            $scope.showAllResults(true);
        };
        /**
         * When a keyword search happens
         */
        $scope.search = function () {
            $scope.programSearchPerformed = true;
            $scope.showAllResults(true);
            $scope.selectedProgramsHolder = [];
        };
        
        $scope.setSelectedPrograms = function (programs) {
        	angular.forEach(programs, function (program) {
                if (AddProgramsFactory.getSelectedPrograms()[program.entity.id]) {
                    program.entity.checked = true;
                } else {
                    program.entity.checked = false;
                }
            });
        };
        
        /**
         * Fetch next/previous page in Client Programs tab
         */
        $scope.fetchPageClientPrograms = function (href) {
            $scope.loading = true;
            ProgramContentInclusionService.fetchProgramPage(href).then(function (programPage) {
                $scope.handleResponse(programPage, managedClientProgramList);
                $scope.setSelectedPrograms($scope.clientPrograms);
                if(SelectAllProgramContentsFactory.isSelectAll()){
                    $scope.$emit('selectAllChecked');
                }
            }, function () {
                $scope.loading = false;
            });
        };
        
        /**
         * When show all is clicked
         * @param show true means show all
         */
        $scope.showAllResults = function (show) {
            var search = !show ? performSearch() : performSearch($scope.programSearch.query, $scope.sortProperty, $scope.resultsPerPage, $scope.programSearch.specialty);
            search.finally(function () {
                $scope.showAll = show;
            });
        };
        

        /**
         * Save method to call when selectAll is false
         */
        $scope.save = function (addAnother) {
        	$scope.programFormSubmitted = true;
            var programsAcrossTabs = angular.extend({},  AddProgramsFactory.getSelectedClientPrograms(),  AddProgramsFactory.getSelectedPrograms());  
            var programToSave = ProgramContentInclusionService.createSaveRequest(programsAcrossTabs);
            ProgramContentInclusionService.saveAll(programToSave).then(function (clientProgramInclusion) {
            	 $scope.whenSaving = true;
            	 if (addAnother) {
            		 $scope.successAlert(programToSave, '#modal-messages-container');
                 } else {
                	 $scope.successAlert(programToSave, '#messages-container');
                     $scope.hideAddProgramModal();
                     focus('programSearchFocus');
                 }
                 //$scope.refreshLocationsAndProviders();
                 $scope.$emit('refreshClientProgramsPage');
                 $scope.$emit('refreshProgramsSearchPage');
             }).finally(function () {
                 $scope.whenSaving = false;
                 $scope.programFormSubmitted = false;
             });
      
		};
		
		$scope.$on('refreshProgramsSearchPage', function(){
			$scope.programs = null;
            $scope.totalPossibleClientProgramsCount = 0;
            $scope.searchAll = {};
            $scope.programSearch = {
                    specialty: '',
                    query: ''
                };
            $scope.allProgramsSearch = false;
            AddProgramsFactory.resetSelectedPrograms();
        });
		
    	/**
         * Display success alert
         */
        $scope.successAlert = function (programToSave, container) {
            var message = (programToSave.length === 1) ?
                ' <b>' + programToSave[0].entity.program.name + '</b> has been successfully added.' :
                'The selected programs have been successfully added.';
            $alert({
                content: message,
                container: container
            });
        };
        
         
   
        
        /**
         * Hide model when cancel button is hit. Also reset selectedClientProviders and selectedProviders
         */
        $scope.hideAddProgramModal = function () {
            $scope.$hide();
            AddProgramsFactory.resetSelectedClientPrograms();
            AddProgramsFactory.resetSelectedPrograms();
        };
        
        
        /**
         * Return true if any provider is selected or SelectAllTeamProvidersFactory.isSelectAll() returns true
         */
        $scope.hasProgramsAdded = function() {
            // Any programs is selected or select all is checked
            return SelectAllProgramContentsFactory.isSelectAll() || !angular.equals({}, AddProgramsFactory.getSelectedClientPrograms()) || !angular.equals({}, AddProgramsFactory.getSelectedPrograms());
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
            return ProgramContentInclusionService.getProgramList(query, sort, size, specialty).then(function (programPage) {
                $scope.handleResponse(programPage, contentProperty);
                $scope.totalPossibleClientProgramsCount = programPage.page.totalElements;
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
         * Called when status changed
         */
        $scope.statusChange = function () {
            $scope.loading = true;
        };
          
           /*
            * 
            * Then check the check box on the provider and call onCheckboxChange
            */
           $scope.$on('selectAllChecked', function () {
        	   angular.forEach($scope.programs, function(program){
            	     program.entity.checked = true;
                     $scope.onCheckboxChange(program);
                   
               });
           });

           /**
            * Listen on 'selectAllUnchecked' event
            * 
            * Reset selectedClientProviders
            * Reset exclusioSet
            * Uncheck all checked check boxes in the page
            */
           $scope.$on('selectAllUnchecked', function () {
         	   AddProgramsFactory.resetSelectedClientPrograms();
        	   SelectAllProgramContentsFactory.resetSelectedPossibleProgramIds();
        	   SelectAllProgramContentsFactory.resetExclusionSet();
               $scope.setSelectedPrograms($scope.programs);
           });
           
           /**
            * Called when the check box is checked or unchecked. 
            * Add the Program to selectedClientPrograms and assign whole list of teams to it when it's checked. 
            * Delete Program from selectedClientPrograms when it's unchecked.
            */
           $scope.onCheckboxChange = function (programResource) {
        	  if(!SelectAllProgramContentsFactory.isSelectAll()) {
            	   if (!programResource.entity.checked) {
                	    $scope.removeFromSelectedClientPrograms(programResource);
                   } else {
                	    $scope.addToSelectedClientPrograms(programResource);
                   }
               } else {
            	   if (!programResource.entity.checked) {
                       $scope.removeFromSelectedClientPrograms(programResource);
                       $scope.addToExclusionSet(programResource);
                   } else {
                       $scope.removeFromExclusionSet(programResource);
                       $scope.addToSelectedClientPrograms(programResource);
                   }
               }
           };
           
           
           $scope.addToExclusionSet = function(programResource) {
               SelectAllProgramContentsFactory.getExclusionSet()[programResource.entity.id] = programResource.entity;
           };
           
           $scope.removeFromExclusionSet = function(programResource) {
               delete SelectAllProgramContentsFactory.getExclusionSet()[programResource.entity.id];
           };
           
           $scope.addToSelectedClientPrograms = function(programResource) {
               AddProgramsFactory.getSelectedClientPrograms()[programResource.entity.id] = programResource.entity;
               SelectAllProgramContentsFactory.getSelectedPossibleProgramIds()[programResource.entity.id] = programResource.entity.id;
           };
           
           $scope.removeFromSelectedClientPrograms = function(programResource) {
               delete AddProgramsFactory.getSelectedClientPrograms()[programResource.entity.id];
               delete SelectAllProgramContentsFactory.getSelectedPossibleProgramIds()[programResource.entity.id];
           };
           


            /**
             * When a program is selected
             *
             * @param programResource to be selected
             */
           $scope.selectProgram = function (programResource) {
        	  if(!SelectAllProgramContentsFactory.isSelectAll()) {
            	  if (!programResource.entity.checked) {
                	   $scope.removeFromSelectedClientPrograms(programResource);
                   } else {
                	   $scope.addToSelectedClientPrograms(programResource);
                   }
               } else {
            	   if (!programResource.entity.checked) {
                       $scope.removeFromSelectedClientPrograms(programResource);
                       $scope.addToExclusionSet(programResource);
                   } else {
                       $scope.removeFromExclusionSet(programResource);
                       $scope.addToSelectedClientPrograms(programResource);
                   }
               }
          };

            /**
             * Remove a schedule program card
             */
         $scope.deselectProgram = function (programResource) {
                $scope.programs.filter(function (element) {
                    if (element.entity.id === programResource.entity.id) {
                        element.selected = false;
                        element.disabled = false;
                    }
                });
                $scope.selectedPrograms = $scope.selectedPrograms.filter(function (element) {
                    return element.program.entity.id !== programResource.entity.id;
                });
            };
    
    }]);

