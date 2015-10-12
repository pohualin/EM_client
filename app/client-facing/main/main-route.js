'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider) {

        var requiredResources = {
            'account': ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
            }]
        };

        // Routes
        $routeProvider
            .when('/', {
                templateUrl: 'client-facing/main/main.html',
                controller: 'MainCtrl',
                title: 'Home',
                reloadOnSearch: false,
                resolve: requiredResources
            })
            .when('/error', {
                templateUrl: 'client-facing/main/err.html',
                reloadOnSearch: false,
                title: 'Error'
            })
            .when('/403', {
                templateUrl: 'client-facing/main/403.html',
                resolve: requiredResources,
                reloadOnSearch: false,
                title: 'Access Denied'
            })
            .when('/500', {
                templateUrl: 'client-facing/main/500.html',
                resolve: requiredResources,
                reloadOnSearch: false,
                title: 'Server Error'
            })
            .when('/docs', {
                templateUrl: 'client-facing/doc/docs.html',
                title: 'Documentation',
                reloadOnSearch: false,
                resolve: requiredResources
            })
            .otherwise({
                redirectTo: '/',
                reloadOnSearch: false,
                resolve: requiredResources
            });
    })
;

