'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES, MENU) {

        var userClientEditorResources = ['AuthSharedService', 'Client', 'UsersClientService', '$route', '$q',
             function (AuthSharedService, Client, UsersClientService, $route, $q) {
                 var deferred = $q.defer();
                 var ret = {
                     clientResource: null,
                     userClientResource: null
                 };
                 AuthSharedService.currentUser().then(function () {
                     Client.selectClient($route.current.params.clientId).then(function (clientResource) {
                         if (clientResource) {
                             if ($route.current.params.userClientId) {
                                 // load the UserClient if in params
                                 UsersClientService.setUserClient($route.current.params.userClientId).then(function (userClientResource) {
                                     if (userClientResource) {
                                         ret.userClientResource = userClientResource;
                                         ret.clientResource = clientResource;
                                         deferred.resolve(ret);
                                     } else {
                                         deferred.reject();
                                     }
                                 });
                             } else {
                                 UsersClientService.setUserClient(null);
                                 ret.clientResource = clientResource;
                                 deferred.resolve(ret);
                             }
                         } else {
                             deferred.reject();
                         }
                     });
                 });
                 return deferred.promise;
             }];
        
        // Routes
        $routeProvider
            .when('/support/clients/:clientId/users/:userClientId', {
                templateUrl: 'admin-facing/support/client-users/editor/editor.html',
                controller: 'UsersClientSupportEditorController',
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                activeMenu: MENU.support,
                reloadOnSearch: false,
                resolve: {
                    'clientEditorResource': userClientEditorResources
                }
            });
    })

;
