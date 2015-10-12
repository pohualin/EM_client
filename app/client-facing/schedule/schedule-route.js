'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

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
                }],
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

        // Routes
        $routeProvider
            .when('/teams/:teamId/schedule/patient/:patientId?', {
                templateUrl: 'client-facing/schedule/main.html',
                controller: 'ScheduleController',
                access: {
                    authorizedRoles: [USER_ROLES.teamScheduler, USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: requiredResources,
                title: 'Select Programs to Schedule'

            })
            .when('/teams/:teamId/schedule/patients', {
                templateUrl: 'client-facing/schedule/patient/search/search.html',
                controller: 'SearchPatientController',
                access: {
                    authorizedRoles: [USER_ROLES.teamScheduler, USER_ROLES.admin]
                },
                reloadOnSearch: true,
                resolve: requiredResources,
                title: 'Search Patients'
            })
            .when('/teams/:teamId/encounter/:encounterId/instructions', {
                templateUrl: 'client-facing/schedule/instructions/main.html',
                controller: 'ScheduleProgramInstructionsViewController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                reloadOnSearch: false,
                resolve: {
                    'scheduledPrograms': ['$q', '$route', 'AuthSharedService', 'ScheduleService',
                        function ($q, $route, AuthSharedService, ScheduleService) {
                            var deferred = $q.defer();
                            AuthSharedService.currentUser().then(function (loggedInUser) {
                                ScheduleService.loadEncounter(loggedInUser.clientResource,
                                    $route.current.params.teamId,
                                    $route.current.params.encounterId)
                                    .then(function (response) {
                                        if (response) {
                                            deferred.resolve(response);
                                        } else {
                                            deferred.reject();
                                        }
                                    }, function error() {
                                        deferred.reject();
                                    });
                            });
                            return deferred.promise;
                        }
                    ]
                },
                title: 'Schedule Summary'
            })
            .when('/teams/:teamId/allPatients', {
                templateUrl: 'client-facing/schedule/patient/view/list.html',
                controller: 'ViewPatientController',
                access: {
                    authorizedRoles: [USER_ROLES.teamScheduler, USER_ROLES.admin]
                },
                resolve: requiredResources,
                title: 'All Patients'
            })
            .when('/teams/:teamId/patient/:patientId', {
                templateUrl: 'client-facing/schedule/patient/view/details.html',
                controller: 'PatientScheduleDetailsController',
                access: {
                    authorizedRoles: [USER_ROLES.teamScheduler, USER_ROLES.admin]
                },
                resolve: requiredResources,
                title: 'Encounter History'
            })
        ;
    })


;
