'use strict';

angular.module('emmiManager').config(function($routeProvider, USER_ROLES) {

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
		templateUrl: 'partials/location/search.html',
        controller: 'LocationsSearchController',
        access: {
            authorizedRoles: [USER_ROLES.admin]
        },
        title: 'Location Search',
        reloadOnSearch: false,
        resolve: requiredResources
	}).when('/locations/:id', {
        templateUrl: 'partials/location/editor/editor.html',
        controller: 'LocationEditorController',
        access: {
            authorizedRoles: [USER_ROLES.admin]
        },
        reloadOnSearch: false,
        resolve: locationRequiredResource
    });

});
