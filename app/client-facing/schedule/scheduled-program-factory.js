'use strict';

angular.module('emmiManager')
/**
 * Factory for maintaining patient and program for scheduling
 */
    .factory('ScheduledProgramFactory', [function () {
        this.patient = {};
        this.scheduledProgram = null;
        this.useLocation = true;
    	this.useProvider = true;
        return this;
    }])
;
