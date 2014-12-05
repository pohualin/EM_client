'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        var clientDetailRequiredResources = {
            'clientResource': ['AuthSharedService','Client', '$route', '$q', function (AuthSharedService, Client, $route, $q){
                var deferred = $q.defer();
                AuthSharedService.currentUser().then(function (){
                    Client.selectClient($route.current.params.clientId).then(function (clientResource){
                        clientResource ? deferred.resolve(clientResource) : deferred.reject();
                    });
                });
                return deferred.promise;
            }]
        };

        // Routes
        $routeProvider
            .when('/clients/:clientId/users', {
                templateUrl: 'partials/user/client/main.html',
                controller: 'ManageClientUsersMainCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: clientDetailRequiredResources
            }).when('/clients/:clientId/users/new', {
                templateUrl: 'partials/user/client/create/editor.html',
                controller: 'ClientUsersEditorCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: clientDetailRequiredResources
            });
    })

;
