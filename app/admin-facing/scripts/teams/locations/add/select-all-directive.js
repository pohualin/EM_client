'use strict';
angular.module('emmiManager')
.directive('selectAllTeamLocations', ['SelectAllTeamLocationsFactory',
    function (SelectAllTeamLocationsFactory) {
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
                 * Watch selectAllClientLocations
                 * 
                 * Call SelectAllTeamLocationsFactory.setSelectAll whenever it changed. Fire event depending on the new value.
                 */
                scope.$watch('selectAllClientLocations', function(newVal, oldVal){
                    SelectAllTeamLocationsFactory.setSelectAll(scope.selectAllClientLocations);
                    if (scope.selectAllClientLocations){
                        scope.$emit('selectAllChecked');
                    } else {
                        scope.$emit('selectAllUnchecked');
                    }
                });
                
                /**
                 * When allPossibleCheck is true and hasExclusion is false.
                 * 
                 * Check selectAllClientLocations and setSelectAll to true
                 */
                scope.$watch(
                    function(){
                        return SelectAllTeamLocationsFactory.isAllPossibleChecked();
                    }, 
                    function(newValue, oldValue){
                        if(!SelectAllTeamLocationsFactory.hasExclusion() && !scope.selectAllClientLocations) {
                            scope.selectAllClientLocations = newValue;
                            SelectAllTeamLocationsFactory.setSelectAll(newValue);
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
                        return SelectAllTeamLocationsFactory.hasExclusion();
                    }, 
                    function(newValue, oldValue){
                        element.prop('indeterminate', newValue);
                    }
                );
                
                /**
                 * When excludeSet has all possible locations
                 * 
                 * Uncheck selectAllClientLocations and setSelectAll to false
                 */
                scope.$watch(
                    function(){
                        return SelectAllTeamLocationsFactory.isAllSelectedUnchecked();
                    }, 
                    function(newValue){
                        if(newValue){
                            scope.selectAllClientLocations = false;
                            SelectAllTeamLocationsFactory.setSelectAll(false);
                        }
                    }
                );
                
                scope.$watch(
                    function(){
                        return SelectAllTeamLocationsFactory.isSelectAll();
                    }, 
                    function(newValue){
                        if(newValue){
                            scope.selectAllClientLocations = newValue;
                        }
                    }
                );
            }
        };
    }
]);