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
        /**
         * valid is set if patient is selected and program selected is complete (program has location, provider, viewByDate, program)
         */
        this.valid = function () {
        	if((!this.useLocation) && 
        		 (!this.useProvider)){
        		 return this.patient && this.patient.id && this.scheduledProgram &&
                 this.scheduledProgram.program && this.scheduledProgram.program.entity.id &&
                 this.scheduledProgram.viewByDate;
        	 }
        	 else if((!this.useProvider)){
        		 return this.patient && this.patient.id && this.scheduledProgram &&
                 this.scheduledProgram.program && this.scheduledProgram.program.entity.id &&
                 this.scheduledProgram.location.entity.id && this.scheduledProgram.viewByDate;
        	 }
        	 else if(!this.useLocation){
        		 return this.patient && this.patient.id && this.scheduledProgram &&
                 this.scheduledProgram.program && this.scheduledProgram.program.entity.id &&
                 this.scheduledProgram.provider.entity.id && this.scheduledProgram.viewByDate;
        	 }
        	 else{
        		return this.patient && this.patient.id && this.scheduledProgram &&
                this.scheduledProgram.program && this.scheduledProgram.program.entity.id &&
                this.scheduledProgram.location.entity.id && this.scheduledProgram.provider.entity.id &&
                this.scheduledProgram.viewByDate;
        	 }
        };
        return this;
    }])
;
