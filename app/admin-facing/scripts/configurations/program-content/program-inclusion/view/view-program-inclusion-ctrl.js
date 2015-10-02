'use strict';

angular.module('emmiManager')

/**
 * Controller for View Program Content Inclusion for a client
 */
    .controller('ViewProgramContentInclusionController', ['$alert', '$scope', '$controller', '$modal', 'Client', 'SelectAllProgramContentsFactory', 'AddProgramsFactory', 'ViewProgramContentInclusionService', 
        function ($alert, $scope, $controller, $modal, Client, SelectAllProgramContentsFactory, AddProgramsFactory, ViewProgramContentInclusionService) {
       
    	// Inclusion story EM-1646
    	
        $scope.noneSelected = true;
       
        // add common pagination and sorting functions
        $controller('CommonPagination', {$scope: $scope});
        $controller('CommonSort', {$scope: $scope});
        
        var managedClientProgramList = 'programs';
               
        // initial loading
        var contentProperty = 'programs';
        $scope.resultsPerPage = 10;
        $scope.listOfClientPrograms = [];
        /**
         * Add program inclusion to a client
         */
        ViewProgramContentInclusionService.getClientProgramContentInclusion().then(function (clientProgramInclusion) {
        		 $scope.listOfClientPrograms = clientProgramInclusion;
        		 $scope.handleResponse(clientProgramInclusion, 'listOfClientPrograms');
        		 $scope.$emit('refreshProgramsSearchPage');
       	});
    
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
		 * Fetch page of client program inclusion page
		 */
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ViewProgramContentInclusionService.fetchPageLink(href).then(function (page) {
                $scope.handleResponse(page, 'listOfClientPrograms');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        
       /**
         * remove program inclusion
         */
        $scope.removeProgram = function (program) {
            $scope.associateRequestSubmitted = true;
            ViewProgramContentInclusionService.removeProgram(program).then(function (clientProgramInclusion) {
            	$scope.refreshViewProgramInclusionPage();
                $alert({
                    content: 'The program <b>' + program.entity.program.name + '</b> has been successfully removed.'
                });
            }).finally(function () {
                $scope.whenSaving = false;
            });
      
		};
		
	      
       /**
         * Return true if any provider is selected or SelectAllTeamProvidersFactory.isSelectAll() returns true
         */
        $scope.hasProgramsDelete = function() {
            // Any programs is selected or select all is checked
            return SelectAllProgramContentsFactory.isSelectAll() || !angular.equals({}, AddProgramsFactory.getSelectedClientPrograms()) || !angular.equals({}, AddProgramsFactory.getSelectedPrograms());
        };

        /**
         * Refresh team locations and team providers
         */
        $scope.refreshViewProgramInclusionPage = function () {
            $scope.loading = true;
            ViewProgramContentInclusionService.getClientProgramContentInclusion().then(function (clientProgramInclusion) {
       		$scope.listOfClientPrograms = clientProgramInclusion;
       		$scope.handleResponse(clientProgramInclusion, 'listOfClientPrograms');
            }).finally(function () {
            	$scope.loading = false;
            });
     
           
        };
        
  	  /**
         * Listen on 'refreshClientProgramsPage' event
         */
        $scope.$on('refreshViewProgramsPage', function(){
        	$scope.clientPrograms = null;
            SelectAllProgramContentsFactory.setSelectAll(false);
            AddProgramsFactory.resetSelectedClientPrograms();
            $scope.refreshViewProgramInclusionPage();
        });
  
        /**
         * Called when status changed
         */
        $scope.statusChange = function () {
            $scope.loading = true;
        };
}]);

