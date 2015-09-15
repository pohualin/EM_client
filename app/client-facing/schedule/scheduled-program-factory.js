'use strict';

angular.module('emmiManager')
/**
 * Factory for maintaining patient and program and retrieve configuration for scheduling
 */
    .factory('ScheduledProgramFactory',  ['$http', '$q', 'UriTemplate', 'moment', function ($http, $q, UriTemplate, moment) {
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
            
            // Check viewByDate to be between today and 5 years from today
            var validViewByDate = false;
            if (scheduledProgram.viewByDate &&
                    moment(scheduledProgram.viewByDate).isValid() &&
                    !moment(scheduledProgram.viewByDate).isAfter(moment().startOf('day').add(5, 'year')) &&
                    !moment(scheduledProgram.viewByDate).isBefore(moment().startOf('day'))) {
                validViewByDate = true;
            }
            
            return this.patient && this.patient.id && this.teamSchedulingConfiguration &&
                scheduledProgram.program && scheduledProgram.program.entity.id &&
                (!this.teamSchedulingConfiguration.entity.useLocation || (this.teamSchedulingConfiguration.entity.useLocation && scheduledProgram.location.entity.id)) && 
                (!this.teamSchedulingConfiguration.entity.useProvider || (this.teamSchedulingConfiguration.entity.useProvider && scheduledProgram.provider.entity.id)) && 
                validViewByDate;
        };
             
       /**
        * Check and see if all selected programs are valid
        */
       this.allValid = function () {
           var self = this;
           var deferred = $q.defer();
           if (this.selectedPrograms) {
               this.selectedPrograms.forEach(function(program){
                   if (!self.valid(program)) {
                       deferred.resolve(false);
                   }
               });
               deferred.resolve(true);
           } else {
               deferred.resolve(false);
           }
           return deferred.promise;
       };
       return this;

    }])
;
