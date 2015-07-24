'use strict';
angular.module('emmiManager')
.factory('SelectAllFactory', [function(){
    var selectAllFactory = {};
    var _isSelectAll = false;
    var _exclusionSet = {};

    var _totalPossibleLocationsCount;
    var _selectedPossibleLocationIds = {};
    var _selectedLocations = {};

    selectAllFactory.setSelectAll = function(isSelectAll){
        _isSelectAll = isSelectAll;
    };
    
    selectAllFactory.isSelectAll = function(){
        return _isSelectAll;
    };
    
    selectAllFactory.hasExclusion = function() {
        return !angular.equals({}, _exclusionSet);
    };
    
    selectAllFactory.getExclusionSet = function() {
        return _exclusionSet;
    };
    
    selectAllFactory.resetExclusionSet = function() {
        _exclusionSet = {};
    };
    
    selectAllFactory.getSelectedPossibleLocationIds = function() {
        return _selectedPossibleLocationIds;
    };
    
    selectAllFactory.resetSelectedPossibleLocationIds = function() {
        _selectedPossibleLocationIds = {};
    };
    
    selectAllFactory.setTotalPossibleLocationsCount = function(total) {
        _totalPossibleLocationsCount = total;
    };
    
    selectAllFactory.isAllPossibleChecked = function() {
        return _totalPossibleLocationsCount === Object.keys(_selectedPossibleLocationIds).length;
    };
    
    selectAllFactory.isAllSelectedUnchecked = function() {
        return _totalPossibleLocationsCount === Object.keys(_exclusionSet).length;
    };
    
    selectAllFactory.getSelectedLocations = function() {
        return _selectedLocations;
    };
    
    return selectAllFactory;
}]);