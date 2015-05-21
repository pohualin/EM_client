'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        var requiredResources = {
            /**
             * Load the current team for the client
             */
            'team': ['AuthSharedService', 'ScheduleService', '$q', '$route',
                function (AuthSharedService, ScheduleService, $q, $route) {
                    var deferred = $q.defer();
                    AuthSharedService.currentUser().then(function (loggedInUser) {
                        ScheduleService.loadTeam(loggedInUser.clientResource, $route.current.params.teamId)
                            .then(function (response) {
                                deferred.resolve(response.data);
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
            .when('/teams/:teamId/schedule/patient', {
                templateUrl: 'client-facing/schedule/main.html',
                controller: 'ScheduleController',
                access: {
                    authorizedRoles: [USER_ROLES.teamScheduler, USER_ROLES.admin]
                },
                resolve: requiredResources

            })
            .when('/teams/:teamId/schedule/patients', {
                templateUrl: 'client-facing/schedule/patient/search/search.html',
                controller: 'SearchPatientController',
                access: {
                    authorizedRoles: [USER_ROLES.teamScheduler, USER_ROLES.admin]
                },
                resolve: requiredResources
            })
            .when('/teams/:teamId/schedule/:scheduleId/instructions', {
                templateUrl: 'client-facing/schedule/instructions/main.html',
                controller: 'ScheduleProgramInstructionsViewController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    'scheduledProgram': ['$q', '$route', 'AuthSharedService', 'ScheduleService',
                        function ($q, $route, AuthSharedService, ScheduleService) {
                            var deferred = $q.defer();
                            AuthSharedService.currentUser().then(function (loggedInUser) {
                                ScheduleService.loadSchedule(loggedInUser.clientResource,
                                    $route.current.params.teamId,
                                    $route.current.params.scheduleId)
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
                }
            })
        ;
    })


;

