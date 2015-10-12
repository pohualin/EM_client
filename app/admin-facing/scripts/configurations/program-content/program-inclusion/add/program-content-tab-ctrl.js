'use strict';

angular.module('emmiManager')

    .controller('ProgramContentTabController', ['$scope', '$controller', 'SelectAllProgramContentsFactory', 'ProgramContentInclusionService', 'AddProgramsFactory', 'TeamProgramservice', 'Programsearch',
         function ($scope, $controller, SelectAllProgramContentsFactory, ProgramContentInclusionService, AddProgramsFactory, TeamProgramservice, Programsearch) {

        $controller('CommonSearch', {$scope: $scope});

        var managedClientProgramList = 'clientPrograms';
        
        /**
         * Set selected Programs check box to be checked
         */
        $scope.setSelectedPrograms = function (programs) {
            angular.forEach(programs, function (program) {
                if (AddProgramsFactory.getSelectedClientPrograms()[program.program.entity.id]) {
                    program.program.entity.checked = true;
                } else {
                    program.program.entity.checked = false;
                }
              
            });
        };

        /**
         * Called when a column header in client Programs result table is clicked.
         */
        $scope.sortClientPrograms = function (property) {
            $scope.loading = true;
            TeamProgramservice.getPossibleClientPrograms($scope.teamResource, $scope.createSortProperty(property)).then(function (clientPrograms) {
                $scope.handleResponse(clientPrograms, managedClientProgramList);
                $scope.setSelectedPrograms($scope.clientPrograms);
                if(SelectAllProgramContentsFactory.isSelectAll()){
                    $scope.$emit('selectAllChecked');
                }
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };
        
        /**
         * Fetch next/previous page in Client Programs tab
         */
        $scope.fetchPageClientPrograms = function (href) {
            $scope.loading = true;
            Programsearch.fetchPageLink(href).then(function (ProgramPage) {
                $scope.handleResponse(ProgramPage, managedClientProgramList);
                $scope.setSelectedPrograms($scope.clientPrograms);
                if(SelectAllProgramContentsFactory.isSelectAll()){
                    $scope.$emit('selectAllChecked');
                }
            }, function () {
                $scope.loading = false;
            });
        };
        
        /**
         * Called when the check box is checked or unchecked. 
         * Add the Program to selectedClientPrograms and assign whole list of teams to it when it's checked. 
         * Delete Program from selectedClientPrograms when it's unchecked.
         */
        $scope.onCheckboxChange = function (ProgramResource) {
            if(!SelectAllProgramContentsFactory.isSelectAll()) {
                if (!ProgramResource.Program.entity.checked) {
                    $scope.removeFromSelectedClientPrograms(ProgramResource);
                } else {
                    $scope.addToSelectedClientPrograms(ProgramResource);
                }
            } else {
                if (!ProgramResource.Program.entity.checked) {
                    $scope.removeFromSelectedClientPrograms(ProgramResource);
                    $scope.addToExclusionSet(ProgramResource);
                } else {
                    $scope.removeFromExclusionSet(ProgramResource);
                    $scope.addToSelectedClientPrograms(ProgramResource);
                }
            }
        };
        
        $scope.addToExclusionSet = function(ProgramResource) {
            SelectAllProgramContentsFactory.getExclusionSet()[ProgramResource.Program.entity.id] = ProgramResource.Program.entity;
        };
        
        $scope.removeFromExclusionSet = function(ProgramResource) {
            delete SelectAllProgramContentsFactory.getExclusionSet()[ProgramResource.Program.entity.id];
        };
        
        $scope.addToSelectedClientPrograms = function(ProgramResource) {
            AddProgramsFactory.getSelectedClientPrograms()[ProgramResource.Program.entity.id] = ProgramResource.Program.entity;
            ProgramResource.Program.entity.selectedTeamLocations = angular.copy($scope.allTeamLocations);
            SelectAllProgramContentsFactory.getSelectedPossibleProgramIds()[ProgramResource.Program.entity.id] = ProgramResource.Program.entity.id;
        };
        
        $scope.removeFromSelectedClientPrograms = function(ProgramResource) {
            delete AddProgramsFactory.getSelectedClientPrograms()[ProgramResource.Program.entity.id];
            delete SelectAllProgramContentsFactory.getSelectedPossibleProgramIds()[ProgramResource.Program.entity.id];
        };
        
        $scope.setPossiblePrograms = function() {
        	ProgramContentInclusionService.getClientProgramContentInclusion().then(function (clientPrograms) {
                $scope.totalPossibleClientProgramsCount = clientPrograms.page.totalElements;
                $scope.handleResponse(clientPrograms, managedClientProgramList);
                TeamProgramservice.getTeamProgramsCount($scope.teamResource).then(function(count){
                    SelectAllProgramContentsFactory.setTotalPossibleProgramsCount(clientPrograms.page.totalElements - count);
                    
                    // In this case, all ClientPrograms are already associated with the team
                    if(clientPrograms.page.totalElements - count === 0) {
                        $scope.$emit('allPossibleAlreadyAssociated');
                    }
                });
            });
        };
        
        /**
         * Listen on 'selectAllChecked' event
         * 
         * When the Program meets all the following conditions
         * a. Have not been associated.
         * b. Has not been added to selectedClientPrograms.
         * c. Is not excluded.
         * 
         * Then check the check box on the Program and call onCheckboxChange
         */
        $scope.$on('selectAllChecked', function () {
            angular.forEach($scope.clientPrograms, function(clientProgram){
                if(!clientProgram.link.self && 
                        !AddProgramsFactory.getSelectedClientPrograms()[clientProgram.Program.entity.id] && 
                        !SelectAllProgramContentsFactory.getExclusionSet()[clientProgram.Program.entity.id]){
                    clientProgram.Program.entity.checked = true;
                    $scope.onCheckboxChange(clientProgram);
                }
            });
        });

        /**
         * Listen on 'selectAllUnchecked' event
         * 
         * Reset selectedClientPrograms
         * Reset exclusioSet
         * Uncheck all checked check boxes in the page
         */
        $scope.$on('selectAllUnchecked', function () {
            AddProgramsFactory.resetSelectedClientPrograms();
            SelectAllProgramContentsFactory.resetSelectedPossibleProgramIds();
            SelectAllProgramContentsFactory.resetExclusionSet();
            $scope.setSelectedPrograms($scope.clientPrograms);
        });
        
     

        function init() {
            $scope.clientPrograms = null;
            $scope.setPossiblePrograms();
        }
        init();
    }]);