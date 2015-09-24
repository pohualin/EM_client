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
        .when('/clients/:clientId/teams/:teamId/configuration/email_reminders', {
           	templateUrl: 'admin-facing/partials/team/configuration/email/main.html',
            controller: 'ClientTeamEmailConfigurationCtrl',
            title: 'Team Configurations - Email Notifications & Print Instructions | ClientManager',
            activeMenu: MENU.setup,
            access: {
                authorizedRoles: USER_ROLES.all
            },
            activeSidebarMenu: 'email_reminders',
            resolve: {
                   'teamResource' : teamResource
            }
        })
        .when('/clients/:clientId/teams/:teamId/configuration/phone_reminders', {
            templateUrl: 'admin-facing/partials/team/configuration/phone/main.html',
            controller: 'ClientTeamPhoneConfigurationCtrl',
            title: 'Team Configurations - Phone Reminders | ClientManager',
            activeMenu: MENU.setup,
            access: {
                authorizedRoles: USER_ROLES.all
            },
            activeSidebarMenu: 'phone_reminders',
            resolve: {
                   'teamResource' : teamResource
            }
        })
        .when('/clients/:clientId/teams/:teamId/configuration/scheduling', {
            templateUrl: 'admin-facing/partials/team/configuration/scheduling/main.html',
            controller: 'ClientTeamSchedulingConfigurationCtrl',
            title: 'Team Configurations - Scheduling | ClientManager',
            activeMenu: MENU.setup,
            access: {
                authorizedRoles: USER_ROLES.all
            },
            activeSidebarMenu: 'scheduling',
            resolve: {
                   'teamResource' : teamResource
            }
        })
        .when('/clients/:clientId/teams/:teamId/configuration/self_registration', {
            templateUrl: 'admin-facing/partials/team/configuration/self-registration/main.html',
            controller: 'SelfRegistrationController',
            title: 'Team Configurations - Self Registration | ClientManager',
            activeMenu: MENU.setup,
            access: {
                authorizedRoles: USER_ROLES.all
            },
            activeSidebarMenu: 'self_registration',
            resolve: {
                   'teamResource' : teamResource
            }
        });

    })
;

