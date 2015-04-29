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
    'emmi.navbar',
    'emmi.typeahead',
    'localytics.directives',
    'ngTagsInput',
    'mgcrea.ngStrap',
    'emmi.inputMask',
    'angularMoment',
    'emmi-angular-multiselect',
    'truncate',
    'emmi.noDirtyCheck'
])

    .constant('USER_ROLES', {
        all: '*',
        admin: 'PERM_CLIENT_SUPER_USER',
        teamScheduler: 'PERM_CLIENT_TEAM_SCHEDULE_PROGRAM',
        user: 'PERM_USER'
    })

    .constant('URL_PARAMETERS', {
        SELECTED_GROUP: 'g',
        SELECTED_TAGS: 'st',
        CLIENT: 'c',
        TEAM: 't',
        PROVIDER: 'p',
        LOCATION: 'l',
        USER: 'u',
        QUERY: 'q',
        PAGE: 'p',
        STATUS: 'status',
        SORT: 'sort',
        DIRECTION: 'dir',
        SIZE: 'size',
        INACTIVE_TEAMS: 'i'
    })

    .constant('PATTERN', {
        EMAIL: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/
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
            dateType: 'string',
            iconLeft: 'fa-angle-left',
            iconRight: 'fa-angle-right'
        });
    })

    .run(function ($rootScope, $location, $http, AuthSharedService, Session, USER_ROLES, PATTERN, arrays, $document, ConfigurationService, $modal, $timeout, moment, ErrorMessageTranslateService) {

        var modals = [], alerts = [];

        $rootScope.authenticated = false;

        // auto track $modal windows
        $rootScope.$on('modal.show', function (e, $modal) {
            // if modal is not already in list
            if (modals.indexOf($modal) === -1) {
                modals.push($modal);
            }
            if (modals.length >= 0) {
                $document.find('body').addClass('modal-open');
            }
        });

        // un-track $modal windows on hide
        $rootScope.$on('modal.hide', function (e, $modal) {
            var modalIndex = modals.indexOf($modal);
            modals.splice(modalIndex, 1);
            if (modals.length === 0) {
                $document.find('body').removeClass('modal-open');
            }
        });

        // auto track $alert windows
        $rootScope.$on('alert.show', function (e, $alert) {
            // if alert is not already in list
            if (alerts.indexOf($alert) === -1) {
                alerts.push($alert);
            }
        });

        // un-track $alert windows on hide
        $rootScope.$on('alert.hide', function (e, $alert) {
            var idx = modals.indexOf($alert);
            alerts.splice(idx, 1);
        });


        /**
         * Hide all $modal windows
         */
        $rootScope.killAllModals = function () {
            if (modals.length) {
                angular.forEach(modals, function ($modal) {
                    $modal.$promise.then($modal.hide);
                });
                modals = [];
            }
        };

        /**
         * Hide all $alert windows
         */
        $rootScope.killAllAlerts = function () {
            if (alerts.length) {
                angular.forEach(alerts, function ($alert) {
                    $alert.$promise.then($alert.hide);
                });
                alerts = [];
            }
        };

        $rootScope.page = {
            setTitle: function (title) {
                if (title) {
                    this.title = title + ' | Emmi Manager';
                    // only call Piwik if we've gotten a page title; and after we've gotten the correct one (this funtion is called twice on some pages)
                    _paq.push(['setDocumentTitle', title]); // overide document title as document.title reports the previous page
                    _paq.push(['setCustomUrl', $location.path()]); // need to check and see if the hashes are tracking okay now with the setting from the Admin Panel changed
                    _paq.push(['trackPageView']);
                } else {
                    title = 'Emmi Manager';
                    this.title = title;
                }
            }
        };

        $rootScope.emailPattern = PATTERN.EMAIL;

        /**
         * Special routes that are system level.
         * These routes are not authorized.
         *
         * @returns {boolean}
         */
        $rootScope.isSystemRoute = function () {
            var path = $location.path();
            return path === '/logout' ||
                path === '/login' ||
                path === '/error' ||
                path === '/403' ||
                path === '/500' ||
                path === '/unauthorized';
        };

        /**
         * These are routes where alerts should be closed
         * when navigating to them, these routes are authorized
         *
         * @returns {boolean}
         */
        $rootScope.shouldCloseAlertsRoute = function () {
            var path = $location.path();
            return path === '/editSecurityQuestions' ||
                path === '/viewSecurityQuestions';
        };

        $rootScope.$on('$routeChangeStart', function (event, next) {
            $rootScope.isAuthorized = AuthSharedService.isAuthorized;
            $rootScope.userRoles = USER_ROLES;
            if (!$rootScope.isSystemRoute()) {
                // authorize all routes other than some known system routes
                AuthSharedService.valid((next.access) ? next.access.authorizedRoles : [USER_ROLES.all]);
            }
        });

        $rootScope.$on('$routeChangeError', function () {
            $location.path('/error').replace();
        });

        $rootScope.$on('$routeChangeSuccess', function (e, current) {
            $rootScope.currentRouteQueryString = arrays.toQueryString(current.params);
            // hide all modals
            $rootScope.killAllModals();
            if ($rootScope.isSystemRoute() || $rootScope.shouldCloseAlertsRoute()) {
                $rootScope.killAllAlerts();
            }
            var pageTitle = current && current.$$route && current.$$route.title;
            $rootScope.page.setTitle(pageTitle);
        });

        // Call when the the client is confirmed
        $rootScope.$on('event:auth-loginConfirmed', function () {
            $rootScope.authenticated = true;
            ConfigurationService.routeUser();
        });

        $rootScope.$on('event:auth-credentialsExpired', function (event, rejection) {
            $rootScope.expiredCredentials = rejection.credentials;
            $rootScope.expiredClient = rejection.client;
            $location.path('/credentials/expired').replace();
        });

        $rootScope.$on('event:auth-totallyNotAuthorized', function () {
            $location.path('/unauthorized').replace();
        });

        // Call when the 401 response is returned by the server
        $rootScope.$on('event:auth-loginRequired', function (event, rejection) {
            if ($rootScope.account) {
                $rootScope.username = $rootScope.account.login;
            }
            Session.destroy();
            $rootScope.locationBeforeLogin = rejection.location;
            $location.path('/login').replace();
        });

        // Call when the 403 response is returned by the server
        $rootScope.$on('event:auth-notAuthorized', function () {
            $timeout(function () {
                $location.path('/403').replace();
            });
        });

        // Call when 409 response is returned by the server
        $rootScope.$on('event:optimistic-lock-failure', function (event, rejection) {
            console.log('409: ' + rejection.data.detail);
            $modal({
                title: 'Object Already Modified',
                content: 'You have attempted to save an object that has already been modified by another user.' +
                ' Please refresh the page to load the latest changes before attempting to save again.',
                animation: 'none',
                backdropAnimation: 'emmi-fade',
                backdrop: 'static',
                show: true
            });
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
                if (!(d.tagName.toUpperCase() === 'INPUT' &&
                    (d.type.toUpperCase() === 'TEXT' ||
                    d.type.toUpperCase() === 'PASSWORD'))) {
                    event.preventDefault();
                }
            }
        });

        ErrorMessageTranslateService.getLockErrorMessages().then(function(ERROR_MESSAGE){
        	moment.locale('en', {
            	relativeTime: {
            		future: ERROR_MESSAGE.LOCK_PART_1 + 'in %s' + ERROR_MESSAGE.LOCK_PART_2,
                    past: ERROR_MESSAGE.LOCK_EXPIRED,
                    s:  'a few seconds',
                    m:  'a minute',
                    mm: '%d minutes',
                    h:  'an hour',
                    hh: '%d hours',
                    d:  'a day',
                    dd: '%d days',
                    M:  'a month',
                    MM: '%d months',
                    y:  'a year',
                    yy: '%d years'
            	}
            });
        });
    });
