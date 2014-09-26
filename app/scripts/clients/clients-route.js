'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        var requiredResources = {
            'account': ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
            }]
        };

        var clientDetailRequiredResources = {
            'clientResource': ['AuthSharedService','Client', '$route', '$q', function (AuthSharedService, Client, $route, $q){
                var deferred = $q.defer();
                AuthSharedService.currentUser().then(function (){
                    Client.selectClient($route.current.params.clientId).then(function (clientResource){
                        deferred.resolve(clientResource);
                    });
                });
                return deferred.promise;
            }]
        };

        // Routes
        $routeProvider
            .when('/clients', {
                templateUrl: 'partials/client/clients.html',
                controller: 'ClientListCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: requiredResources
            })
            .when('/clients/new', {
                templateUrl: 'partials/client/client_edit.html',
                controller: 'ClientCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: requiredResources
            })
            .when('/clients/:clientId/edit', {
                templateUrl: 'partials/client/client_edit.html',
                controller: 'ClientDetailCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: clientDetailRequiredResources
            })
            .when('/clients/:clientId/view', {
                templateUrl: 'partials/client/client_view.html',
                controller: 'ClientViewCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: clientDetailRequiredResources
            })
            .when('/clients/:clientId/teams/new', {
                templateUrl: 'partials/team/team_edit.html',
                controller: 'ClientTeamCreateCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: clientDetailRequiredResources
            });
    })



;

