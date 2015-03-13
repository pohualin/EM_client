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
                    'team': ['AuthSharedService', 'MainService', 'ScheduleService', '$q', '$route',
                        function (AuthSharedService, MainService, ScheduleService, $q, $route) {
                            var deferred = $q.defer();
                            AuthSharedService.currentUser().then(function (loggedInUser) {
                                MainService.specificTeamsHavingLink(loggedInUser, 'schedulePrograms').then(function (teams) {
                                    var ret;
                                    angular.forEach(teams, function (team) {
                                        if ($route.current.params.teamId === team.entity.id + '') {
                                            ret = team;
                                        }
                                    });
                                    if (ret) {
                                        // user has a special permission for this team
                                        deferred.resolve(ret);
                                    } else {
                                        // try to load the team for this user (maybe they are an admin)
                                        ScheduleService.loadTeam(loggedInUser.clientResource, $route.current.params.teamId)
                                            .then(function (response) {
                                                deferred.resolve(response.data);
                                            }, function error() {
                                                deferred.reject();
                                            });
                                    }
                                });
                            });
                            return deferred.promise;
                        }]
                }
            });
    })


;

