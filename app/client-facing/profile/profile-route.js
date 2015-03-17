'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        var requiredUserClientResources = {
        	'userClientReqdResource': ['AuthSharedService', 'ProfileService', '$q', function (AuthSharedService, ProfileService, $q) {
                var deferred = $q.defer();
            	AuthSharedService.currentUser().then(function (loggedInUser){
                	ProfileService.get(loggedInUser).then(function (refreshedUserResponse){
                		deferred.resolve(refreshedUserResponse);
                	});
                });
            	return deferred.promise;
            }]
        };

        // Routes
        $routeProvider
            .when('/profile', {
            	templateUrl: 'client-facing/profile/profile.html',
            	title: 'My Profile',
            	controller: 'ProfileCtrl',
            	access: {
            		authorizedRoles: [USER_ROLES.all]
            	},
            	resolve: requiredUserClientResources
            });
    })
;
