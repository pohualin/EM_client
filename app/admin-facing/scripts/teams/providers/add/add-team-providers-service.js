'use strict';
angular.module('emmiManager')

    .service('AddTeamProvidersService', [ 
        function () {
        return {
            /**
             * Return two tabs with one being active
             */
            setAllTabs: function(activeTab){
                return {'activeTab' : activeTab, 'data' : [
                    {
                        'title': 'Client Providers',
                        'template': 'admin-facing/partials/team/provider/tabs/team-client-providers-tab.html'
                    },
                    {
                        'title': 'Search all providers',
                        'template': 'admin-facing/partials/team/provider/tabs/team-search-providers-tab.html'
                    }]};
            }
        };
    }])
    
    .factory('AddTeamProvidersFactory', [function(){
        var addTeamProvidersFactory = {};
        var _selectedClientProviders = {};
        var _selectedProviders = {};
        var _teamLocations;
        
        addTeamProvidersFactory.getSelectedClientProviders = function() {
            return _selectedClientProviders;
        };
        
        addTeamProvidersFactory.resetSelectedClientProviders = function() {
            _selectedClientProviders = {};
        };
        
        addTeamProvidersFactory.getSelectedProviders = function() {
            return _selectedProviders;
        };
        
        addTeamProvidersFactory.resetSelectedProviders = function() {
            _selectedProviders = {};
        };
        
        addTeamProvidersFactory.getTeamLocations = function() {
            return _teamLocations;
        };
        
        addTeamProvidersFactory.setTeamLocations = function(teamLocations) {
            _teamLocations = teamLocations;
        };
        
        return addTeamProvidersFactory;
    }]);
