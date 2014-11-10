'use strict';

angular.module('emmiManager').config(function($routeProvider, USER_ROLES) {

	var requiredResources = {
		'account' : [ 'AuthSharedService', function(AuthSharedService) {
			return AuthSharedService.currentUser();
		} ]
	};

	$routeProvider.when('/locations', {
		templateUrl: 'partials/location/location_search.html',
        controller: 'LocationsSearchController',
        access: {
            authorizedRoles: [USER_ROLES.admin]
        },
        reloadOnSearch: false,
        resolve: requiredResources
	});

});