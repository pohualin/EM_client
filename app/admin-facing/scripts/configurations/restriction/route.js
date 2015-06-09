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
            .when('/clients/:clientId/restriction', {
                templateUrl: 'admin-facing/partials/configurations/restriction/main.html',
                controller: 'ClientRestrictConfigurationMainController',
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                reloadOnSearch: false,
                activeMenu: MENU.setup,
                activeSidebarMenu: 'restriction',
                resolve: clientDetailRequiredResources
            });
    })

;
