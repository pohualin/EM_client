'use strict';

var emmiManager = angular.module('emmiManager', [
    'http-auth-interceptor',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngResource',
    'ngRoute',
    'pascalprecht.translate',
    'mgcrea.ngStrap.datepicker'
]);

emmiManager.constant('USER_ROLES', {
    all: '*',
    admin: 'ROLE_ADMIN',
    user: 'ROLE_USER'
});

emmiManager
    .config(function ($routeProvider, $httpProvider, $translateProvider, USER_ROLES) {

        var requiredResources = {
            'api': ['Api', function (Api) {
                return Api.load();
            }]
        };

        // Routes
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: requiredResources
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: requiredResources
            })
            .when('/clients', {
                templateUrl: 'partials/clients.html',
                controller: 'ClientListCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: requiredResources
            })
            .when('/clients/new', {
                templateUrl: 'partials/createClient.html',
                controller: 'ClientCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: requiredResources
            })
            .when('/403', {
                templateUrl: 'partials/403.html',
                resolve: requiredResources
            })
            .otherwise({
                redirectTo: '/',
                resolve: requiredResources
            });

        // Initialize angular-translate
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');

        // make sure the server knows that an AJAX call is happening
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    })
    .run(function ($rootScope, $location, $http, AuthSharedService, Session, USER_ROLES) {

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // if route requires auth and user is not logged in
            $rootScope.currentUser = null;
            $rootScope.userRoles = USER_ROLES;
            $rootScope.isAuthorized = AuthSharedService.isAuthorized;
            AuthSharedService.valid((next.access) ? next.access.authorizedRoles : []);
        });

        // Call when the the client is confirmed
        $rootScope.$on('event:auth-loginConfirmed', function (data) {
            $rootScope.authenticated = true;
            if ($location.path() === '/login') {
                $location.path('/').replace();
            }
        });

        // Call when the 401 response is returned by the server
        $rootScope.$on('event:auth-loginRequired', function (rejection) {
            Session.destroy();
            $rootScope.authenticated = false;
            if ($location.path() !== '/' && $location.path() !== '' && $location.path() !== '/register' && $location.path() !== '/activate') {
                $location.path('/login').replace();
            }
        });

        // Call when the 403 response is returned by the server
        $rootScope.$on('event:auth-notAuthorized', function (rejection) {
            //$rootScope.errorMessage = 'errors.403';
            $location.path('/403').replace();
        });

        // Call when the user logs out
        $rootScope.$on('event:auth-loginCancelled', function () {
            $location.path('');
        });

    })
;
