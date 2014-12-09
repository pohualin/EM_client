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
    'angularMoment',
    'emmi-angular-multiselect'
])

    .constant('USER_ROLES', {
        all: '*',
        admin: 'PERM_GOD',
        user: 'PERM_USER'
    })

    .config(function ($httpProvider, $translateProvider, tmhDynamicLocaleProvider, HateoasInterceptorProvider, $datepickerProvider, API) {

        // Initialize angular-translate
        $translateProvider.useUrlLoader(API.messages);
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

    .run(function ($rootScope, $location, $http, AuthSharedService, Session, USER_ROLES, arrays, $document) {

        var modals = [];

        $rootScope.$on('modal.show', function (e, $modal) {
            // if modal is not already in list
            if (modals.indexOf($modal) === -1) {
                modals.push($modal);
            }
        });

        $rootScope.$on('modal.hide', function (e, $modal) {
            var modalIndex = modals.indexOf($modal);
            modals.splice(modalIndex, 1);
        });

        $rootScope.page = {
            setTitle: function (title) {
                this.title = title + ' | Emmi Manager';
            }
        };

        $rootScope.$on('$routeChangeStart', function (event, next) {
            $rootScope.userRoles = USER_ROLES;
            $rootScope.isAuthorized = AuthSharedService.isAuthorized;
            AuthSharedService.authorizedRoute((next.access) ? next.access.authorizedRoles : [USER_ROLES.all]);
        });

        $rootScope.$on('$routeChangeError', function (event, next) {
            $location.path('/').replace();
        });

        $rootScope.$on('$routeChangeSuccess', function (e, current) {
            $rootScope.currentRouteQueryString = arrays.toQueryString(current.params);
            // hide all modals
            if (modals.length) {
                angular.forEach(modals, function ($modal) {
                    $modal.$promise.then($modal.hide);
                });
                modals = [];
            }
            var pageTitle = current && current.$$route && current.$$route.title || 'Emmi Manager';
            var pageUrl = $location.path();
            $rootScope.page.setTitle(pageTitle);
            _paq.push(['setDocumentTitle', pageTitle]); // overide document title as document.title reports the previous page
            _paq.push(['setCustomUrl', pageUrl]); // need to check and see if the hashes are tracking okay now with the setting from the Admin Panel changed
            _paq.push(['trackPageView']);
        });

        // Call when the the client is confirmed
        $rootScope.$on('event:auth-loginConfirmed', function (data) {
            $rootScope.authenticated = true;
            if ($location.path() === '/login') {
                var priorRequestPath = $rootScope.locationBeforeLogin;
                if (priorRequestPath) {
                    $location.path(priorRequestPath.path()).replace();
                } else {
                    $location.path('/').replace();
                }
            }
        });

        // Call when the 401 response is returned by the server
        $rootScope.$on('event:auth-loginRequired', function (event, rejection) {
            Session.destroy();
            $rootScope.locationBeforeLogin = rejection.location;
            $rootScope.authenticated = false;
            if ($location.path() !== '/' && $location.path() !== '' && $location.path() !== '/register' && $location.path() !== '/activate') {
                $location.path('/login').replace();
            }
        });

        // Call when the 403 response is returned by the server
        $rootScope.$on('event:auth-notAuthorized', function (rejection) {
            $location.path('/403').replace();
        });

        // Call when the 500 response is returned by the server
        $rootScope.$on('event:server-error', function (event, rejection) {
            $rootScope.error = rejection;
            $location.path('/500').replace();
        });

        // Call when the user logs out
        $rootScope.$on('event:auth-loginCancelled', function () {
            $location.path('');
        });

        $document.bind('keydown keypress', function (event) {
            if (event.which === 8) {
                var d = event.srcElement || event.target;
                if (!(d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'TEXT')) {
                    event.preventDefault();
                }
            }
        });
    });
