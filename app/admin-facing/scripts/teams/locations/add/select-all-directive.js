'use strict';
angular.module('emmiManager')
.directive('selectAll', ['SelectAllFactory',
    function (SelectAllFactory) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                
                /**
                 * Watch selectAllClientTeams
                 * 
                 * Call SelectAllFactory.setSelectAll whenever it changed. Fire event depending on the new value.
                 */
                scope.$watch('selectAllClientTeams', function(newVal, oldVal){
                    SelectAllFactory.setSelectAll(scope.selectAllClientTeams);
                    if (scope.selectAllClientTeams){
                        scope.$emit('selectAllChecked');
                    } else {
                        scope.$emit('selectAllUnchecked');
                    }
                });
                
                /**
                 * When allPossibleCheck is true and hasExclusion is false.
                 * 
                 * Check selectAllClientTeams and setSelectAll to true
                 */
                scope.$watch(
                    function(){
                        return SelectAllFactory.isAllPossibleChecked();
                    }, 
                    function(newValue, oldValue){
                        if(!SelectAllFactory.hasExclusion()) {
                            scope.selectAllClientTeams = newValue;
                            SelectAllFactory.setSelectAll(newValue);
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
                        return SelectAllFactory.hasExclusion();
                    }, 
                    function(newValue, oldValue){
                        element.prop('indeterminate', newValue);
                    }
                );
                
                /**
                 * When excludeSet has all possible locations
                 * 
                 * Uncheck selectAllClientTeams and setSelectAll to false
                 */
                scope.$watch(
                    function(){
                        return SelectAllFactory.isAllSelectedUnchecked();
                    }, 
                    function(newValue){
                        if(newValue){
                            scope.selectAllClientTeams = false;
                            SelectAllFactory.setSelectAll(false);
                        }
                    }
                );
            }
        };
    }
]);