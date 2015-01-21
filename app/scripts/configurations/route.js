'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

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
            .when('/clients/:clientId/password_policy', {
                templateUrl: 'partials/configurations/password/main.html',
                controller: 'ClientPasswordConfigurationsMainController',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: clientDetailRequiredResources
            });
    })

;
