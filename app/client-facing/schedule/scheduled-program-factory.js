'use strict';

angular.module('emmiManager')
    .factory('ScheduledProgramFactory', [ function () {
        this.patient = {};
        this.scheduledProgram = null;
        //provider: '',
        //    location: '',
        //    program: '',
        //    viewByDate: moment().add(30, 'days').format('YYYY-MM-DD')
        this.valid = function (){
            console.log(this);
          return this.patient && this.patient.id && this.scheduledProgram &&
              this.scheduledProgram.program && this.scheduledProgram.program.entity.id &&
              this.scheduledProgram.location.entity.id && this.scheduledProgram.provider.entity.id &&
              this.scheduledProgram.viewByDate;
        };
        return this;
    }])
;
