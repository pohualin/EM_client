'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

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
            .when('/clients/:clientId/roles', {
                templateUrl: 'partials/role/client/main.html',
                controller: 'ManageClientRolesMainCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: clientDetailRequiredResources
            });
    })

;
