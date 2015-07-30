'use strict';
angular.module('emmiManager')
.factory('SelectAllTeamLocationsFactory', [function(){
    var selectAllTeamLocationsFactory = {};
    var _isSelectAll = false;
    var _exclusionSet = {};

    var _totalPossibleLocationsCount;
    var _selectedPossibleLocationIds = {};
    var _selectedLocations = {};

    selectAllTeamLocationsFactory.setSelectAll = function(isSelectAll){
        _isSelectAll = isSelectAll;
    };
    
    selectAllTeamLocationsFactory.isSelectAll = function(){
        return _isSelectAll;
    };
    
    selectAllTeamLocationsFactory.hasExclusion = function() {
        return !angular.equals({}, _exclusionSet);
    };
    
    selectAllTeamLocationsFactory.getExclusionSet = function() {
        return _exclusionSet;
    };
    
    selectAllTeamLocationsFactory.resetExclusionSet = function() {
        _exclusionSet = {};
    };
    
    selectAllTeamLocationsFactory.getSelectedPossibleLocationIds = function() {
        return _selectedPossibleLocationIds;
    };
    
    selectAllTeamLocationsFactory.resetSelectedPossibleLocationIds = function() {
        _selectedPossibleLocationIds = {};
    };
    
    selectAllTeamLocationsFactory.setTotalPossibleLocationsCount = function(total) {
        _totalPossibleLocationsCount = total;
    };
    
    selectAllTeamLocationsFactory.isAllPossibleChecked = function() {
        return _totalPossibleLocationsCount !== 0 && _totalPossibleLocationsCount === Object.keys(_selectedPossibleLocationIds).length;
    };
    
    selectAllTeamLocationsFactory.isAllSelectedUnchecked = function() {
        return _totalPossibleLocationsCount === Object.keys(_exclusionSet).length;
    };
    
    selectAllTeamLocationsFactory.getSelectedLocations = function() {
        return _selectedLocations;
    };
    
    return selectAllTeamLocationsFactory;
}]);