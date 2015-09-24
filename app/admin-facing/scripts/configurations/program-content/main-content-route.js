'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES, MENU) {

        var clientDetailRequiredResources = {
            'clientResource': ['AuthSharedService', 'Client', '$route', '$q', function (AuthSharedService, Client, $route, $q) {
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
            }]
        };

        // Routes
        $routeProvider
            .when('/clients/:clientId/program_content', {
                templateUrl: 'admin-facing/partials/configurations/program-content/main.html',
                controller: 'MainContentConfigurationController',
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                reloadOnSearch: false,
                title: 'Client Configurations - Program Content | ClientManager',
                activeMenu: MENU.setup,
                activeSidebarMenu: 'program_content',
                resolve: clientDetailRequiredResources
            });
    })

;
