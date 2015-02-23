'use strict';

angular.module('emmiManager').config(
    function($routeProvider, USER_ROLES) {

        var requiredResources = {
            'account': ['AuthSharedService',
                function(AuthSharedService) {
                    return AuthSharedService.currentUser();
                }
            ]
        };

        var providerRequiredResource = {
            'providerResource': [
                'AuthSharedService',
                'ProviderService',
                '$route',
                '$q',
                function(AuthSharedService, ProviderService, $route, $q) {
                    var deferred = $q.defer();
                    AuthSharedService.currentUser().then(
                        function() {
                            ProviderService.getProviderById($route.current.params.id)
                                .then(function(providerResource) {
                                    if (providerResource) {
                                        deferred.resolve(providerResource);
                                    } else {
                                        deferred.reject();
                                    }
                                });
                        });
                    return deferred.promise;
                }
            ]
        };

        $routeProvider.when('/providers', {
            templateUrl: 'partials/provider/search.html',
            controller: 'ProvidersSearchController',
            access: {
                authorizedRoles: USER_ROLES.all
            },
            title: 'Provider Search',
            reloadOnSearch: false,
            resolve: requiredResources
        }).when('/providers/:id', {
            templateUrl: 'partials/provider/editor/editor.html',
            controller: 'ProviderEditorController',
            access: {
                authorizedRoles: USER_ROLES.all
            },
            reloadOnSearch: false,
            resolve: providerRequiredResource
        });

    });
