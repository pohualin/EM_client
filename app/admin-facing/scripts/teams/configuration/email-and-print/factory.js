(function (angular) {
'use strict';

angular.module('emmiManager')

/**
 * 
 */
.factory('TeamEmailNotificationsAndPrintInstructionsControllerFactory',  [
    function () {
        this.team = null;
        this.whenSaving = false;
        this.formSubmitted = false;
        this.showButton = false;
        
        this.reset = function (teamResource) {
            this.team = null;
            this.whenSaving = false;
            this.formSubmitted = false;
            this.showButton = false;
        };
        
        return this;
    }]);
})(window.angular);