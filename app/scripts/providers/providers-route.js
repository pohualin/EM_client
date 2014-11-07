'use strict';

angular.module('emmiManager').config(function($routeProvider, USER_ROLES) {

	var requiredResources = {
		'account' : [ 'AuthSharedService', function(AuthSharedService) {
			return AuthSharedService.currentUser();
		} ]
	};

	$routeProvider.when('/providers', {
		templateUrl: 'partials/provider/provider_search.html',
        controller: 'ProvidersSearchController',
        access: {
            authorizedRoles: [USER_ROLES.admin]
        },
        reloadOnSearch: false,
        resolve: requiredResources
	});

});