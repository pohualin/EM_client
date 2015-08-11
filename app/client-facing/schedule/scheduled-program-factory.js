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
        this.team = null;
        
        this.reset = function (teamResource) {
            this.patient = {};
            this.scheduledProgram = null;
            this.team = teamResource;
            this.loadSchedulingConfigurations();
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
       return this;
    }])
;
