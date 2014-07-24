'use strict';

angular.module('emmiManager', [
    'http-auth-interceptor',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngResource',
    'ngRoute',
    'hateoas',
    'emmiManager.api',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'mgcrea.ngStrap.datepicker'
])

    .constant('USER_ROLES', {
        all: '*',
        admin: 'PERM_GOD',
        user: 'PERM_USER'
    })

    .config(function ($routeProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider, USER_ROLES, HateoasInterceptorProvider, $datepickerProvider) {

        var requiredResources = {
            'account': ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
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
                resolve: requiredResources,
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/logout', {
                templateUrl: 'partials/main.html',
                controller: 'LogoutCtrl',
                resolve: requiredResources,
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .otherwise({
                redirectTo: '/',
                resolve: requiredResources,
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            });

        // Initialize angular-translate
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();

        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');

        // make sure the server knows that an AJAX call is happening
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        // enable HATEOAS link array --> object parsing on $get
        HateoasInterceptorProvider.transformAllResponses();

        // ensure dates are compatible with back-end
        angular.extend($datepickerProvider.defaults, {
            dateFormat: 'MM/dd/yyyy',
            modelDateFormat: 'yyyy-MM-dd',
            dateType: 'string'
        });
    })

    .run(function ($rootScope, $location, $http, AuthSharedService, Session, USER_ROLES) {

        $rootScope.$on('$routeChangeStart', function (event, next) {
            $rootScope.userRoles = USER_ROLES;
            $rootScope.isAuthorized = AuthSharedService.isAuthorized;
            AuthSharedService.authorizedRoute((next.access) ? next.access.authorizedRoles : [USER_ROLES.all]);
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

    });
