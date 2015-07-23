'use strict';
angular.module('emmiManager')
.directive('selectAll', ['SelectAllFactory',
    function (SelectAllFactory) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                
                scope.$watch('selectAllClientTeams', function(newVal, oldVal){
                    SelectAllFactory.setSelectAll(scope.selectAllClientTeams);
                    if (scope.selectAllClientTeams){
                        scope.$emit('selectAllChecked');
                    } else {
                        scope.$emit('selectAllUnchecked');
                    }
                });
                
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
                
                scope.$watch(
                    function(){
                        return SelectAllFactory.hasExclusion();
                    }, 
                    function(newValue, oldValue){
                        element.prop('indeterminate', newValue);
                    }
                );
                
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