'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        /**
         * Loads the users
         * Resolves into an object:
         *  {
         *      userClientResource: null
         *  }
         */
        var userEditorResources = ['AuthSharedService', 'UsersService', '$route', '$q',
            function (AuthSharedService, UsersService, $route, $q) {
                var deferred = $q.defer();
                var ret = null;
                AuthSharedService.currentUser().then(function () {
                    UsersService.setUser($route.current.params.userId).then(function (userResource) {
                        if (userClientResource) {
                            ret = userResource;
                            deferred.resolve(ret);
                        } else {
                            deferred.reject();
                        }
                    });        
                });
                return deferred.promise;
            }];

        // Routes
        $routeProvider
            .when('/users/', {
                templateUrl: 'partials/user/main.html',
                controller: 'UsersMainCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: {
                    'userEditorResource': userEditorResources
                }
            }).when('/users/new', {
                templateUrl: 'partials/user/create/new.html',
                controller: 'UsersCreateController',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: {
                    'userEditorResource': userEditorResources
                }
            }).when('/users/:userClientId', {
                templateUrl: 'partials/user/create/editor.html',
                controller: 'UsersEditorController',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: {
                    'userEditorResource': userEditorResources
                }
            });
    })

;
