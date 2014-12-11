'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

    	// First call AuthSharedService to get current user
    	// Second call ClientService to get current client
    	// Third call UserClientService to get current UserClient if userClientId is passed in param
        var userClientEditorResources = 
    	['AuthSharedService','Client', 'UsersClientService', '$route', '$q', function (AuthSharedService, Client, UsersClientService, $route, $q){
            var deferred = $q.defer();
            AuthSharedService.currentUser().then(function (){
                Client.selectClient($route.current.params.clientId).then(function (clientResource){
            		if (clientResource) {
            			if($route.current.params.userClientId){
            				UsersClientService.setUserClient($route.current.params.userClientId).then(function(userClientResource){
            					if(userClientResource){
            						deferred.resolve(userClientResource);
            					} else {
            						deferred.reject();
            					}
            				});
            			} else{
            				UsersClientService.setUserClient(null);
            				deferred.resolve(clientResource);
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
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: userClientEditorResources
            }).when('/clients/:clientId/users/new', {
                templateUrl: 'partials/user/client/create/editor.html',
                controller: 'UsersClientEditorController',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: userClientEditorResources
            }).when('/clients/:clientId/users/:userClientId', {
                templateUrl: 'partials/user/client/create/editor.html',
                controller: 'UsersClientEditorController',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: userClientEditorResources
            });
    })

;
