'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        /**
         * Loads the Client and UserClient if the userClientId parameter is available
         * Resolves into an object:
         *  {
         *      clientResource: null,
         *      userClientResource: null
         *  }
         */
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
            .when('/clients/:clientId/users', {
                templateUrl: 'partials/user/client/main.html',
                controller: 'UsersClientMainCtrl',
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                reloadOnSearch: false,
                resolve: {
                    'clientEditorResource': userClientEditorResources
                }
            }).when('/clients/:clientId/users/new', {
                templateUrl: 'partials/user/client/metadata/new.html',
                controller: 'UsersClientCreateController',
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                reloadOnSearch: true,
                resolve: {
                    'clientEditorResource': userClientEditorResources
                }
            }).when('/clients/:clientId/users/:userClientId', {
                templateUrl: 'partials/user/client/editor.html',
                controller: 'UsersClientEditorController',
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                reloadOnSearch: false,
                resolve: {
                    'clientEditorResource': userClientEditorResources
                }
            });
    })

;
