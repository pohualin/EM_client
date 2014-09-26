'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        var requiredResources = {
            'account': ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
            }]
        };

        var teamRequiredResources = {
            'teamResource': ['AuthSharedService','ViewTeam', '$route', '$q', function (AuthSharedService, ViewTeam, $route, $q){
                var deferred = $q.defer();
                AuthSharedService.currentUser().then(function (){
                    ViewTeam.selectTeam($route.current.params.teamId).then(function (teamResource){
                        deferred.resolve(teamResource);
                    });
                });
                return deferred.promise;
            }]
        };

        // Routes
        $routeProvider
            .when('/teams/:teamId/view', {
                templateUrl: 'partials/team/team_view.html',
                controller: 'ClientTeamViewCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: teamRequiredResources
            })
            .when('/teams', {
                templateUrl: 'partials/client/team_search.html',
                controller: 'TeamSearchController',
                resolve: requiredResources,
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            });
    })



;

