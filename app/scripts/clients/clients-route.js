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
            .when('/clients', {
                templateUrl: 'partials/client/clients.html',
                controller: 'ClientListCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                title: 'Client Search',
                resolve: requiredResources
            })
            .when('/clients/new', {
                templateUrl: 'partials/client/create/editor.html',
                controller: 'ClientCreateController',
                title: 'New Client',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: requiredResources
            })
            .when('/clients/:clientId', {
                templateUrl: 'partials/client/edit/editor.html',
                controller: 'ClientDetailCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: clientDetailRequiredResources
            });
    })



;

