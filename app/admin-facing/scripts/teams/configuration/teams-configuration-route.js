'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES, MENU) {

        var requiredResources = {
            'account': ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
            }]
        };

        var teamResource = ['AuthSharedService', 'Client', 'ViewTeam', '$route', '$q', function (AuthSharedService, Client, ViewTeam, $route, $q) {
        	var deferred = $q.defer();
            AuthSharedService.currentUser().then(function () {
                Client.selectClient($route.current.params.clientId).then(function (clientResource) {
                    if (clientResource) {
                    	ViewTeam.selectTeam(clientResource.link.teamByTeamId, $route.current.params.teamId).then(function (teamResource) {
                            deferred.resolve(teamResource);
                        });      
                    } else {
                        deferred.reject();
                    }
                });
            });
             return deferred.promise;
        }];
        

        // Routes
        $routeProvider
         .when('/clients/:clientId/teams/:teamId/configuration', {
           	templateUrl: 'admin-facing/partials/team/configuration/email/configuration.html',
            controller: 'ClientTeamEmailConfigurationCtrl',
            title: 'Team Configuration',
            activeMenu: MENU.setup,
            access: {
            authorizedRoles: USER_ROLES.all
            },
            resolve: {
                   'teamResource' : teamResource
            }
        });
          
    })
;

