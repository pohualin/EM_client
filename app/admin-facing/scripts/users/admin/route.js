'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES, MENU) {

        var requiredResources = {
            'account' : [ 'AuthSharedService', function(AuthSharedService) {
                return AuthSharedService.currentUser();
            } ]
        };

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
                        if (userResource) {
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
                templateUrl: 'admin-facing/partials/user/main.html',
                controller: 'UsersMainCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.god, USER_ROLES.admin]
                },
                activeMenu: MENU.settings,
                resolve: requiredResources,
                reloadOnSearch: false
            }).when('/users/new', {
                templateUrl: 'admin-facing/partials/user/create/new.html',
                controller: 'UsersCreateController',
                access: {
                    authorizedRoles: [USER_ROLES.god, USER_ROLES.admin]
                },
                activeMenu: MENU.settings,
                resolve: requiredResources,
                reloadOnSearch: false
            }).when('/users/:userId', {
                templateUrl: 'admin-facing/partials/user/create/editor.html',
                controller: 'UsersEditorController',
                access: {
                    authorizedRoles: [USER_ROLES.god, USER_ROLES.admin]
                },
                activeMenu: MENU.settings,
                reloadOnSearch: false,
                resolve: {
                    'userEditorResource': userEditorResources
                }
            }).when('/admin', {
                templateUrl: 'admin-facing/partials/admin.html',
                controller: 'MainCtrl',
                title: 'Admin Functions | ClientManager',
                activeMenu: MENU.settings,
                resolve: requiredResources,
                access: {
                    authorizedRoles: [USER_ROLES.god, USER_ROLES.admin]
                }
            }).when('/admin/tags', {
            	templateUrl: 'admin-facing/partials/admin/tags/editor.html',
                controller: 'MainCtrl',
                title: 'Emmi Groups & Tags Library | ClientManager',
                activeMenu: MENU.settings,
                resolve: requiredResources,
                access: {
                    authorizedRoles: [USER_ROLES.god, USER_ROLES.admin]
                }
            });
    })

;
