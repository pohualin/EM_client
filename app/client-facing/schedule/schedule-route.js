'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

      var requiredResources = {
          /**
           * Load the current team for the client
           */
            'team' : ['AuthSharedService', 'ScheduleService', '$q', '$route',
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
                }],
            'patientResource': ['AuthSharedService', 'ViewPatientService', '$q', '$route', 'ScheduleService',
                function (AuthSharedService, ViewPatientService, $q, $route, ScheduleService) {
                    var deferred = $q.defer();
                    if($route.current.params.patientId){
                        AuthSharedService.currentUser().then(function (loggedInUser) {
                            ScheduleService.loadTeam(loggedInUser.clientResource, $route.current.params.teamId).then(function (teamResource) {
                                ViewPatientService.loadPatient(teamResource.data, $route.current.params.patientId).then(function (patientResponse) {
                                    deferred.resolve(patientResponse.data);
                                }, function error() {
                                    deferred.reject();
                                });
                            }, function error() {

                            });
                        });
                    return deferred.promise;
                    }
                    else {
                        deferred.reject();
                    }
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
                resolve: requiredResources

            })
            .when('/teams/:teamId/schedule/patients', {
                templateUrl: 'client-facing/schedule/patient/search/search.html',
                controller: 'SearchPatientController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: requiredResources
            })
        ;
    })


;

