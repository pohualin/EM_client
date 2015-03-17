'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider) {

        var requiredResources = {
        		'account': ['AuthSharedService', 'ProfileService', '$q', function (AuthSharedService, ProfileService, $q) {
                    var deferred = $q.defer();
                	AuthSharedService.currentUser().then(function (loggedInUser){
                        if (!loggedInUser.notLoggedIn){
                            ProfileService.get(loggedInUser).then(function (refreshedUserResponse){
                                deferred.resolve(refreshedUserResponse);
                            });
                        }deferred.resolve(loggedInUser);
                    });
                	return deferred.promise;
                }]
        };

        // Routes
        $routeProvider
            .when('/', {
                templateUrl: 'client-facing/main/main.html',
                controller: 'MainCtrl',
                title: 'Home',
                resolve: requiredResources
            })
            .when('/error', {
                templateUrl: 'client-facing/main/err.html'
            })
            .when('/403', {
                templateUrl: 'client-facing/main/403.html',
                resolve: requiredResources,
                title: 'Access Denied'
            })
            .when('/500', {
                templateUrl: 'client-facing/main/500.html',
                resolve: requiredResources,
                title: 'Server Error'
            })
            .when('/docs', {
                templateUrl: 'client-facing/doc/docs.html',
                title: 'Documentation',
                resolve: requiredResources
            })
            .otherwise({
                redirectTo: '/',
                resolve: requiredResources
            });
    })
;

