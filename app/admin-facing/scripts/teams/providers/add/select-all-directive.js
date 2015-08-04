'use strict';
angular.module('emmiManager')
.directive('selectAllTeamProviders', ['SelectAllTeamProvidersFactory',
    function (SelectAllTeamProvidersFactory) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                
                /**
                 * Listen on 'allPossibleAlreadyAssociated' which 
                 * will be fired when all possible ClientProviders
                 * are all associated with the team.
                 */
                scope.$on('allPossibleAlreadyAssociated', function(){
                    element.prop('checked', true);
                    element.prop('disabled', true);
                });
                
                /**
                 * Watch selectAllClientProviders
                 * 
                 * Call SelectAllTeamProvidersFactory.setSelectAll whenever it changed. Fire event depending on the new value.
                 */
                scope.$watch('selectAllClientProviders', function(newVal, oldVal){
                    SelectAllTeamProvidersFactory.setSelectAll(scope.selectAllClientProviders);
                    if (scope.selectAllClientProviders){
                        scope.$emit('selectAllChecked');
                    } else {
                        scope.$emit('selectAllUnchecked');
                    }
                });
                
                /**
                 * When allPossibleCheck is true and hasExclusion is false.
                 * 
                 * Check selectAllClientProviders and setSelectAll to true
                 */
                scope.$watch(
                    function(){
                        return SelectAllTeamProvidersFactory.isAllPossibleChecked();
                    }, 
                    function(newValue, oldValue){
                        if(!SelectAllTeamProvidersFactory.hasExclusion()) {
                            scope.selectAllClientProviders = newValue;
                            SelectAllTeamProvidersFactory.setSelectAll(newValue);
                        }
                    }
                );
                
                /**
                 * When hasExclusion is true.
                 * 
                 * Half check check box
                 */
                scope.$watch(
                    function(){
                        return SelectAllTeamProvidersFactory.hasExclusion();
                    }, 
                    function(newValue, oldValue){
                        element.prop('indeterminate', newValue);
                    }
                );
                
                /**
                 * When excludeSet has all possible locations
                 * 
                 * Uncheck selectAllClientProviders and setSelectAll to false
                 */
                scope.$watch(
                    function(){
                        return SelectAllTeamProvidersFactory.isAllSelectedUnchecked();
                    }, 
                    function(newValue){
                        if(newValue){
                            scope.selectAllClientProviders = false;
                            SelectAllTeamProvidersFactory.setSelectAll(false);
                        }
                    }
                );
                
                scope.$watch(
                    function(){
                        return SelectAllTeamProvidersFactory.isSelectAll();
                    }, 
                    function(newValue){
                        if(newValue){
                            scope.selectAllClientProviders = newValue;
                        }
                    }
                );
            }
        };
    }
]);