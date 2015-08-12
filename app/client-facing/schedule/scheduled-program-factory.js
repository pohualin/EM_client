'use strict';

angular.module('emmiManager')
/**
 * Factory for maintaining patient and program and retrieve configuration for scheduling
 */
    .factory('ScheduledProgramFactory',  ['$http', 'UriTemplate', function ($http, UriTemplate) {
        this.useLocation = false;
        this.useProvider = false;
        this.patient = {};
        this.scheduledProgram = null;
        this.selectedPrograms = null;
        this.team = null;
        
        this.reset = function (teamResource) {
            this.patient = {};
            this.scheduledProgram = null;
            this.team = teamResource;
            this.loadSchedulingConfigurations();
        };
        
        /**
         * valid is set if patient is selected and program selected is complete (program has location, provider, viewByDate, program)
         */
        this.valid = function () {
            return this.patient && this.patient.id && this.scheduledProgram &&
                scheduledProgram.program && scheduledProgram.program.entity.id &&
                scheduledProgram.location.entity.id && scheduledProgram.provider.entity.id &&
                scheduledProgram.viewByDate;
        };
             
        /**
         * Load team scheduling configuration for scheduling
         */
        this.loadSchedulingConfigurations = function () {
            var self = this;
            $http.get(UriTemplate.create(this.team.link.teamSchedulingConfig).stringify(
                )).then(function success(response) {
                self.useLocation = response.data.entity.useLocation;
                self.useProvider = response.data.entity.useProvider;
           });
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
