'use strict';

angular.module('emmiManager')
    .factory('ScheduledProgramFactory', [ function () {
        this.patient = {};
        this.scheduledProgram = null;
        this.valid = function (){
          return this.patient && this.patient.id && this.scheduledProgram &&
              this.scheduledProgram.program && this.scheduledProgram.program.entity.id &&
              this.scheduledProgram.location.entity.id && this.scheduledProgram.provider.entity.id &&
              this.scheduledProgram.viewByDate;
        };
        return this;
    }])
;
