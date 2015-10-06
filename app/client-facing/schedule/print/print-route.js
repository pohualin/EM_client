'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        // Routes
        $routeProvider
            .when('/teams/:teamId/encounter/:encounterId/instructions/en/print', {
                templateUrl: 'client-facing/schedule/print/print_en.html',
                controller: 'PrintEnglishInstructionsController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    'scheduledPrograms': ['$q', '$route', 'AuthSharedService', 'ScheduleService',
                        function ($q, $route, AuthSharedService, ScheduleService) {
                            var deferred = $q.defer();
                            AuthSharedService.currentUser().then(function (loggedInUser) {
                                ScheduleService.loadEncounter(loggedInUser.clientResource,
                                    $route.current.params.teamId, 
                                    $route.current.params.encounterId,
                                    'viewByDate')
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
            
            .when('/teams/:teamId/encounter/:encounterId/instructions/es/print', {
                templateUrl: 'client-facing/schedule/print/print_es.html',
                controller: 'PrintSpanishInstructionsController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    'scheduledPrograms': ['$q', '$route', 'AuthSharedService', 'ScheduleService',
                        function ($q, $route, AuthSharedService, ScheduleService) {
                            var deferred = $q.defer();
                            AuthSharedService.currentUser().then(function (loggedInUser) {
                                ScheduleService.loadEncounter(loggedInUser.clientResource,
                                    $route.current.params.teamId, 
                                    $route.current.params.encounterId,
                                    'viewByDate')
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
