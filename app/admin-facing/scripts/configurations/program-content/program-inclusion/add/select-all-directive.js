'use strict';
angular.module('emmiManager')
.directive('selectAllProgramContents', ['SelectAllProgramContentsFactory',
    function (SelectAllProgramContentsFactory) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                
                /**
                 * Listen on 'allPossibleAlreadyAssociated' which 
                 * will be fired when all possible ClientProgramContents
                 * are all associated with the client.
                 */
                scope.$on('allPossibleAlreadyAssociated', function(){
                	console.log('at all possible checked');
                    element.prop('checked', true);
                    element.prop('disabled', true);
                });
                
                /**
                 * Watch selectAllProgramContents
                 * 
                 * Call SelectAllProgramContentsFactory.setSelectAll whenever it changed. Fire event depending on the new value.
                 */
                scope.$watch('selectAllProgramContents', function(newVal, oldVal){
                	console.log('select calll');
                	SelectAllProgramContentsFactory.setSelectAll(scope.selectAllProgramContents);
                    if (scope.selectAllProgramContents){
                    	console.log('select all checked');
                        scope.$emit('selectAllChecked');
                    } else {
                    	console.log('uncheckec alll');
                        scope.$emit('selectAllUnchecked');
                    }
                });
                
                /**
                 * When allPossibleCheck is true and hasExclusion is false.
                 * 
                 * Check selectAllProgramContents and setSelectAll to true
                 */
                scope.$watch(
                		
                    function(){
                    	console.log('watch ccscsdcdc');
                        return SelectAllProgramContentsFactory.isAllPossibleChecked();
                    }, 
                    function(newValue, oldValue){
                    	
                        if(!SelectAllProgramContentsFactory.hasExclusion()  && !scope.selectAllProgramContents) {
                            scope.selectAllProgramContents = newValue;
                            SelectAllProgramContentsFactory.setSelectAll(newValue);
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
                        return SelectAllProgramContentsFactory.hasExclusion();
                    }, 
                    function(newValue, oldValue){
                        element.prop('indeterminate', newValue);
                    }
                );
                
                /**
                 * When excludeSet has all possible locations
                 * 
                 * Uncheck selectAllProgramContents and setSelectAll to false
                 */
                scope.$watch(
                    function(){
                        return SelectAllProgramContentsFactory.isAllSelectedUnchecked();
                    }, 
                    function(newValue){
                        if(newValue){
                            scope.selectAllProgramContents = false;
                            SelectAllProgramContentsFactory.setSelectAll(false);
                        }
                    }
                );
                
                scope.$watch(
                    function(){
                        return SelectAllProgramContentsFactory.isSelectAll();
                    }, 
                    function(newValue){
                        if(newValue){
                            scope.selectAllProgramContents = newValue;
                        }
                    }
                );
            }
        };
    }
]);