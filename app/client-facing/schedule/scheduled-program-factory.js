'use strict';

angular.module('emmiManager')
/**
 * Factory for maintaining patient and program and retrieve configuration for scheduling
 */
    .factory('ScheduledProgramFactory',  ['$http', 'UriTemplate', function ($http, UriTemplate) {
        this.patient = {};
        this.scheduledProgram = null;
        this.selectedPrograms = null;
        this.team = null;
        this.teamSchedulingConfiguration = null;
        
        this.reset = function (teamResource) {
            this.patient = {};
            this.scheduledProgram = null;
            this.selectedPrograms = null;
            this.team = null;
            this.teamSchedulingConfiguration = null;
        };
        
        /**
         * valid is set if patient is selected and program selected is complete (program has location, provider, viewByDate, program)
         */
        this.valid = function (scheduledProgram) {
            return this.patient && this.patient.id && this.teamSchedulingConfiguration &&
                scheduledProgram.program && scheduledProgram.program.entity.id &&
                (!this.teamSchedulingConfiguration.entity.useLocation || (this.teamSchedulingConfiguration.entity.useLocation && scheduledProgram.location.entity.id)) && 
                (!this.teamSchedulingConfiguration.entity.useProvider || (this.teamSchedulingConfiguration.entity.useProvider && scheduledProgram.provider.entity.id)) && 
                scheduledProgram.viewByDate;
        };
             
       /**
        * Check and see if all selected programs are valid
        */
       this.allValid = function () {
           var self = this;
           if (this.selectedPrograms) {
               this.selectedPrograms.forEach(function(program){
                   if (!self.valid(program)) {
                       return false;
                   }
               });
               return true;
           } else {
               return false;
           }
       };
       return this;

    }])
;
