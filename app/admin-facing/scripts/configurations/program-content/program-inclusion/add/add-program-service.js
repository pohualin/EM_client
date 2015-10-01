'use strict';
angular.module('emmiManager')

    .service('AddProgramsService', [ 
        function () {
        return {
            /**
             * Return two tabs with one being active
             */
            setAllTabs: function(activeTab){
                return {'activeTab' : activeTab, 'data' : [
                    {
                        'title': 'Client Programs',
                        'template': 'admin-facing/partials/configurations/program-content/program-inclusion/program_table_filter.html'
                    },
                    {
                        'title': 'Search all programs',
                        'template': 'admin-facing/partials/configurations/program-content/program-inclusion/program_table.html'
                    }]};
            }
        };
    }])
    
    .factory('AddProgramsFactory', [function(){
        var addProgramsFactory = {};
        var _selectedClientPrograms = {};
        var _selectedPrograms = {};
               
        addProgramsFactory.getSelectedClientPrograms = function() {
            return _selectedClientPrograms;
        };
        
        addProgramsFactory.resetSelectedClientPrograms = function() {
            _selectedClientPrograms = {};
        };
        
        addProgramsFactory.getSelectedPrograms = function() {
            return _selectedPrograms;
        };
        
        addProgramsFactory.resetSelectedPrograms = function() {
            _selectedPrograms = {};
        };
        
        return addProgramsFactory;
    }]);
