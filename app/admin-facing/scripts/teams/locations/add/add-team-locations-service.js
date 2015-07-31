'use strict';
angular.module('emmiManager')

    .service('AddTeamLocationsService', ['$q', '$http','UriTemplate', 'CommonService', 
        function ($q, $http, UriTemplate, CommonService) {
        return {
            /**
             * Set all tabs' title and template for add location modal
             */
            setAllTabs: function(activeTab){
            	return {'activeTab' : activeTab, 'data' : [
            	        {
            	            'title': 'Client locations',
            	            'template': 'admin-facing/partials/team/location/tabs/team-client-locations-tab.html',
         		        },
         		        {
         		            'title': 'Search all locations',
         		            'template': 'admin-facing/partials/team/location/tabs/team-search-all-tab.html',
         		        }]};
            }
        };
    }])
    
    .factory('AddTeamLocationsFactory', [function(){
        var addTeamLocationsFactory = {};
        var _selectedClientLocations = {};
        var _selectedLocations = {};
        var _teamProviders;
        
        addTeamLocationsFactory.getSelectedClientLocations = function() {
            return _selectedClientLocations;
        };
        
        addTeamLocationsFactory.resetSelectedClientLocations = function() {
            _selectedClientLocations = {};
        };
        
        addTeamLocationsFactory.getSelectedLocations = function() {
            return _selectedLocations;
        };
        
        addTeamLocationsFactory.resetSelectedLocations = function() {
            _selectedLocations = {};
        };
        
        addTeamLocationsFactory.getTeamProviders = function() {
            return _teamProviders;
        };
        
        addTeamLocationsFactory.setTeamProviders = function(teamProviders) {
            _teamProviders = teamProviders;
        };
        
        return addTeamLocationsFactory;
    }]);
