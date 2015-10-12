'use strict';
angular.module('emmiManager')
.factory('SelectAllProgramContentsFactory', [function(){
    var SelectAllProgramContentsFactory = {};
    var _isSelectAll = false;
    var _exclusionSet = {};

    var _totalPossibleProgramsCount;   
    var _selectedPossibleProgramIds = {};
    var _selectedPrograms = {};

    SelectAllProgramContentsFactory.setSelectAll = function(isSelectAll){
        _isSelectAll = isSelectAll;
    };
    
    SelectAllProgramContentsFactory.isSelectAll = function(){
        return _isSelectAll;
    };
    
    SelectAllProgramContentsFactory.hasExclusion = function() {
        return !angular.equals({}, _exclusionSet);
    };
    
    SelectAllProgramContentsFactory.getExclusionSet = function() {
        return _exclusionSet;
    };
    
    SelectAllProgramContentsFactory.resetExclusionSet = function() {
        _exclusionSet = {};
    };
    
    SelectAllProgramContentsFactory.getSelectedPossibleProgramIds = function() {
        return _selectedPossibleProgramIds;
    };
    
    SelectAllProgramContentsFactory.resetSelectedPossibleProgramIds = function() {
        _selectedPossibleProgramIds = {};
    };
    
    SelectAllProgramContentsFactory.setTotalPossibleProgramsCount = function(total) {
        _totalPossibleProgramsCount = total;
    };
    
    SelectAllProgramContentsFactory.isAllPossibleChecked = function() {
        return _totalPossibleProgramsCount !== 0 && _totalPossibleProgramsCount === Object.keys(_selectedPossibleProgramIds).length;
    };
    
    SelectAllProgramContentsFactory.isAllSelectedUnchecked = function() {
        return _totalPossibleProgramsCount === Object.keys(_exclusionSet).length;
    };
    
    SelectAllProgramContentsFactory.getSelectedPrograms = function() {
        return _selectedPrograms;
    };
    
    return SelectAllProgramContentsFactory;
}]);