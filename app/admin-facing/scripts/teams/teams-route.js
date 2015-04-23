'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES, MENU) {

        var requiredResources = {
            'account': ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
            }]
        };

        var clientResource = ['AuthSharedService', 'Client', '$route', '$q', function (AuthSharedService, Client, $route, $q) {
            var deferred = $q.defer();
            AuthSharedService.currentUser().then(function () {
                Client.selectClient($route.current.params.clientId).then(function (clientResource) {
                    if (clientResource) {
                        deferred.resolve(clientResource);
                    } else {
                        deferred.reject();
                    }
                });
            });
            return deferred.promise;
        }];

        // Routes
        $routeProvider
            .when('/clients/:clientId/teams/new', {
                templateUrl: 'admin-facing/partials/team/team_new.html',
                controller: 'ClientTeamCreateCtrl',
                title: 'New Team',
                activeMenu: MENU.setup,
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                resolve: {
                    'clientResource': clientResource
                }
            })
            .when('/teams', {
                templateUrl: 'admin-facing/partials/team/team_search.html',
                controller: 'TeamSearchController',
                title: 'Team Search',
                activeMenu: MENU.setup,
                resolve: requiredResources,
                reloadOnSearch: false,
                access: {
                    authorizedRoles: USER_ROLES.all
                }
            });
    })


;

