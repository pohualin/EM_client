'use strict';

angular.module('emmiManager', [
    'http-auth-interceptor',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngResource',
    'ngRoute',
    'ngAnimate',
    'hateoas',
    'emmiManager.api',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'emmi.typeahead',
    'localytics.directives',
    'ngTagsInput',
    'mgcrea.ngStrap',
    'emmi.inputMask',
    'angularMoment'
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

        var clientDetailRequiredResources = {
            'clientResource': ['AuthSharedService','Client', '$route', '$q', function (AuthSharedService, Client, $route, $q){
                var deferred = $q.defer();
                AuthSharedService.currentUser().then(function (){
                    Client.selectClient($route.current.params.clientId).then(function (clientResource){
                          deferred.resolve(clientResource);
                    });
                });
                return deferred.promise;
            }]
        };
        
        var teamRequiredResources = {
            'teamResource': ['AuthSharedService','ViewTeam', '$route', '$q', function (AuthSharedService, ViewTeam, $route, $q){
                var deferred = $q.defer();
                AuthSharedService.currentUser().then(function (){
                    ViewTeam.selectTeam($route.current.params.teamId).then(function (teamResource){
                          deferred.resolve(teamResource);
                    });
                });
                return deferred.promise;
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
                templateUrl: 'partials/client/clients.html',
                controller: 'ClientListCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: requiredResources
            })
            .when('/clients/new', {
                templateUrl: 'partials/client/client_edit.html',
                controller: 'ClientCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: requiredResources
            })
            .when('/clients/:clientId/edit', {
                templateUrl: 'partials/client/client_edit.html',
                controller: 'ClientDetailCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: clientDetailRequiredResources
            })
            .when('/clients/:clientId/view', {
                templateUrl: 'partials/client/client_view.html',
                controller: 'ClientViewCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: clientDetailRequiredResources
            })
            .when('/clients/:clientId/teams/new', {
                templateUrl: 'partials/team/team_edit.html',
                controller: 'ClientTeamCreateCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: clientDetailRequiredResources
            })
            .when('/teams/:teamId/view', {
                templateUrl: 'partials/team/team_view.html',
                controller: 'ClientTeamViewCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: teamRequiredResources
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
        
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};    
        }
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get.Pragma = 'no-cache';
        
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
