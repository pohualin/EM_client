'use strict';

angular.module('emmiManager').config(function($routeProvider, USER_ROLES, MENU) {

	var requiredResources = {
		'account' : [ 'AuthSharedService', function(AuthSharedService) {
			return AuthSharedService.currentUser();
		} ]
	};

	var locationRequiredResource = {
        'locationResource': ['AuthSharedService', 'LocationService', '$route', '$q',
            function(AuthSharedService, LocationService, $route, $q) {
                var deferred = $q.defer();
                AuthSharedService.currentUser().then(
                    function() {
                        LocationService.getLocationById($route.current.params.id)
                            .then(function(locationResource) {
                                if (locationResource) {
                                    deferred.resolve(locationResource);
                                } else {
                                    deferred.reject();
                                }
                            });
                    });
                return deferred.promise;
            }
        ]
    };


	$routeProvider.when('/locations', {
		templateUrl: 'admin-facing/partials/location/search.html',
        controller: 'LocationsSearchController',
        access: {
            authorizedRoles: USER_ROLES.all
        },
        title: 'Location Search | ClientManager',
        activeMenu: MENU.setup,
        reloadOnSearch: false,
        resolve: requiredResources
	}).when('/locations/:id', {
        templateUrl: 'admin-facing/partials/location/editor/editor.html',
        controller: 'LocationEditorController',
        access: {
            authorizedRoles: USER_ROLES.all
        },
        reloadOnSearch: false,
        activeMenu: MENU.setup,
        resolve: locationRequiredResource
    });

});
