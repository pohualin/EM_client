'use strict';
angular.module('emmiManager')
.factory('SelectAllTeamProvidersFactory', [function(){
    var selectAllTeamProvidersFactory = {};
    var _isSelectAll = false;
    var _exclusionSet = {};

    var _totalPossibleProvidersCount;
    var _selectedPossibleProviderIds = {};
    var _selectedProviders = {};

    selectAllTeamProvidersFactory.setSelectAll = function(isSelectAll){
        _isSelectAll = isSelectAll;
    };
    
    selectAllTeamProvidersFactory.isSelectAll = function(){
        return _isSelectAll;
    };
    
    selectAllTeamProvidersFactory.hasExclusion = function() {
        return !angular.equals({}, _exclusionSet);
    };
    
    selectAllTeamProvidersFactory.getExclusionSet = function() {
        return _exclusionSet;
    };
    
    selectAllTeamProvidersFactory.resetExclusionSet = function() {
        _exclusionSet = {};
    };
    
    selectAllTeamProvidersFactory.getSelectedPossibleProviderIds = function() {
        return _selectedPossibleProviderIds;
    };
    
    selectAllTeamProvidersFactory.resetSelectedPossibleProviderIds = function() {
        _selectedPossibleProviderIds = {};
    };
    
    selectAllTeamProvidersFactory.setTotalPossibleProvidersCount = function(total) {
        _totalPossibleProvidersCount = total;
    };
    
    selectAllTeamProvidersFactory.isAllPossibleChecked = function() {
        return _totalPossibleProvidersCount === Object.keys(_selectedPossibleProviderIds).length;
    };
    
    selectAllTeamProvidersFactory.isAllSelectedUnchecked = function() {
        return _totalPossibleProvidersCount === Object.keys(_exclusionSet).length;
    };
    
    selectAllTeamProvidersFactory.getSelectedProviders = function() {
        return _selectedProviders;
    };
    
    return selectAllTeamProvidersFactory;
}]);