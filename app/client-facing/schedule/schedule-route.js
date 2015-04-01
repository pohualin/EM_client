'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        // Routes
        $routeProvider
            .when('/teams/:teamId/schedule', {
                templateUrl: 'client-facing/schedule/main.html',
                controller: 'ScheduleController',
                access: {
                    authorizedRoles: [USER_ROLES.teamScheduler, USER_ROLES.admin]
                },
                resolve: {
                    /**
                     * Load the team from either the logged in user or from the back-end
                     * if the user is an administrator
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
                        }]
                }
            });
    })


;

