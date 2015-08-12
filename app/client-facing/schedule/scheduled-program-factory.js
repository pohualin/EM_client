'use strict';

angular.module('emmiManager')
/**
 * Factory for maintaining patient and program for scheduling
 */
    .factory('ScheduledProgramFactory', [function () {
        this.patient = {};
        this.scheduledProgram = null;
        this.selectedPrograms = null;

        /**
         * valid is set if patient is selected and program selected is complete (program has location, provider, viewByDate, program)
         */
        this.valid = function (scheduledProgram) {
            return this.patient && this.patient.id && this.scheduledProgram &&
                scheduledProgram.program && scheduledProgram.program.entity.id &&
                scheduledProgram.location.entity.id && scheduledProgram.provider.entity.id &&
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
