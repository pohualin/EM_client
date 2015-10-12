'use strict';

angular.module('emmiManager').config(function($routeProvider, USER_ROLES) {

    var requiredResources = {
        /**
         * Load the current team for the client, set up patient information if the route contains patient id
         */
        'team' : ['AuthSharedService', 'ScheduleService', '$q', '$route', 'ViewPatientService',
            function (AuthSharedService, ScheduleService, $q, $route, ViewPatientService) {
                var deferred = $q.defer();
                    AuthSharedService.currentUser().then(function (loggedInUser) {
                        ScheduleService.loadTeam(loggedInUser.clientResource, $route.current.params.teamId)
                            .then(function (response) {
                                if ($route.current.params.patientId) {
                                    ViewPatientService.loadPatient(response.data, $route.current.params.patientId).then(function (patientResponse) {
                                        response.data.patient = patientResponse.data;
                                        deferred.resolve(response.data);
                                    });
                                } else {
                                    response.data.patient = {};
                                    deferred.resolve(response.data);
                                }
                            }, function error() {
                                deferred.reject();
                            });
                    });
                return deferred.promise;
            }
        ],

        /**
         * Load the client from the logged in user
         */
        'client': ['AuthSharedService', '$q', '$route', function (AuthSharedService, $q) {
            var deferred = $q.defer();

            AuthSharedService.currentUser().then(function (loggedInUser) {
                deferred.resolve(loggedInUser.clientResource);
            });

            return deferred.promise;
        }]
    };

    $routeProvider
        .when('/teams/:teamId/patient/:patientId', {
            templateUrl: 'client-facing/schedule/patient/view/details.html',
            controller: 'PatientScheduleDetailsController',
            controllerAs: 'PatientScheduleDetailsController',
            access: {
                authorizedRoles: [USER_ROLES.teamScheduler, USER_ROLES.admin]
            },
            resolve: requiredResources
        });

});
