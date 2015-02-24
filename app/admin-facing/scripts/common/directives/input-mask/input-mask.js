'use strict';

angular.module('emmi.inputMask', []).directive('inputMask', function(){
    return {
        restrict: 'A',
        link: function(scope, el, attrs){
            el.inputmask(attrs.inputMask);
        }
    };
});
