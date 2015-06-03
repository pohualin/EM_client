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
    'emmi.chosen',
    'ngTagsInput',
    'mgcrea.ngStrap',
    'emmi.inputMask',
    'angularMoment',
    'emmi-angular-multiselect',
    'truncate',
    'emmi.noDirtyCheck',
    'unsavedChanges',
    'ivh.treeview',
    'headroom',
    'ngTinyScrollbar'
])

    .constant('USER_ROLES', {
        all: '*',
        god: 'PERM_GOD',
        admin: 'PERM_ADMIN_SUPER_USER',
        user: 'PERM_ADMIN_USER'
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
        INACTIVE_TEAMS: 'i',
        CLIENT_USERS: 'cu'
    })
    
    .constant('STATUS', {
        'ALL': 'ALL',
        'ACTIVE_ONLY': 'ACTIVE_ONLY',
        'INACTIVE_ONLY': 'INACTIVE_ONLY'
    })

    .constant('PATTERN', {
        EMAIL: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/,
        PROVIDER_NAME: /^[a-zA-Z- '(),.]*$/
    })

    .config(
    function ($provide, $httpProvider, $translateProvider, tmhDynamicLocaleProvider, HateoasInterceptorProvider, $datepickerProvider, $alertProvider, API, unsavedWarningsConfigProvider) {

        // Initialize angular-translate
        $translateProvider.useUrlLoader(API.messages);
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.useCookieStorage();

        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');

        // make sure the server knows that an AJAX call is happening
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        // push the current full url into the request headers
        $httpProvider.interceptors.push(['$location', function ($location) {
            return {
                request: function (config) {
                    config.headers['X-Requested-Url'] = $location.absUrl();
                    return config;
                }
            };
        }]);

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

        // custom global angularstrap configurations
        angular.extend($alertProvider.defaults, {
            show: true,
            title: '',
            container: '#messages-container',
            type: 'success',
            // placement: 'top',
            duration: 5,
            dismissable: true,
            animation: 'am-fade-and-slide-top',
            template: 'admin-facing/partials/common/directives/alert/alert.tpl.html'
        });

        // extend ivh.treeview ivhTreeviewCheckbox directive so we can skin the checkboxes (EM-1046)
        $provide.decorator('ivhTreeviewCheckboxDirective', function ($delegate) {
            var directive = $delegate[0];
            var link = directive.link;
            directive.template = [
                '<span class="checkbox"><input id="ivhTreeviewCheckbox_{{elementId}}_{{node.name}}" type="checkbox"',
                'ng-model="isSelected"',
                'ng-disabled="isDisabled"',
                'ng-change="ctrl.select(node, isSelected)" />',
                '<label for="ivhTreeviewCheckbox_{{elementId}}_{{node.name}}"></label></span>'
            ].join('\n');
            directive.compile = function () {
                return function (scope, element, attrs, ctrl) {
                    link.apply(this, arguments);
                    // get the closest treeview container id
                    var elementId = angular.element(element).closest('.ivh-treeview-container').attr('id');
                    if (elementId) {
                        scope.elementId = elementId;
                    }

                    var node = scope.node;
                    var opts = ctrl.opts();
                    var disabledAttr = opts.userOptions.disabledAttribute;
                    scope.isDisabled = node[disabledAttr];

                    scope.$watch(function() {
                      return scope.node[disabledAttr];
                    }, function(newVal, oldVal) {
                      scope.isDisabled = newVal;
                    });
                };
            };
            return $delegate;
        });

        $provide.decorator('scrollbarDirective', function ($delegate) {
            var directive = $delegate[0];
            directive.template = '<div class="scroll-bar"><div class="scroll-thumb"></div></div><div class="scroll-viewport" sidebar-scroller><div class="scroll-overview" ng-transclude></div></div>';
            var compile = directive.compile;
            directive.compile = function (tElement, tAttrs) {
                var _me = this;
                var link = compile.apply(_me, arguments);
                return function (scope, elem, attrs) {
                    link.apply(this, arguments);
                    // extend the controller after link() has run
                    var controller = arguments[3];
                    if (!!attrs.rebuildOn) {
                        attrs.rebuildOn.split(' ').forEach(function (eventName) {
                            scope.$on(eventName, function () {
                                controller.update();
                            });
                        });
                    }
                };
            };
            return $delegate;
        });

        unsavedWarningsConfigProvider.logEnabled = false;
        unsavedWarningsConfigProvider.routeEvent = ['$locationChangeStart'];

    })

    .run(function ($rootScope, $location, $http, AuthSharedService, Session, USER_ROLES, PATTERN, arrays, $document, $modal, API) {

        var modals = [], tooltips = [];

        $rootScope.$on('modal.show', function (e, $modal) {
            // if modal is not already in list
            if (modals.indexOf($modal) === -1) {
                modals.push($modal);
            }
            if (modals.length >= 0) {
                $document.find('body').addClass('modal-open');
            }
        });

        $rootScope.$on('modal.hide', function (e, $modal) {
            var modalIndex = modals.indexOf($modal);
            modals.splice(modalIndex, 1);
            if (modals.length === 0) {
                $document.find('body').removeClass('modal-open');
            }
        });

        $rootScope.$on('tooltip.show', function (e, $tooltip) {
            // if tooltip is not already in list
            if (tooltips.indexOf($tooltip) === -1) {
                tooltips.push($tooltip);
            }
        });

        $rootScope.$on('tooltip.hide', function (e, $tooltip) {
            var tooltipIndex = tooltips.indexOf($tooltip);
            tooltips.splice(tooltipIndex, 1);
        });

        /**
         * Hide all $tooltip/$popover windows
         */
        $rootScope.killAllToolTips = function () {
            if (tooltips.length) {
                angular.forEach(tooltips, function ($tooltip) {
                    $tooltip.$promise.then($tooltip.hide);
                });
                tooltips = [];
            }
        };

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
        $rootScope.providerNamePattern = PATTERN.PROVIDER_NAME;
        $rootScope.isProduction = !!API.production;

        $rootScope.$on('$routeChangeStart', function (event, next) {
            $rootScope.killAllToolTips();
            $rootScope.userRoles = USER_ROLES;
            $rootScope.isAuthorized = AuthSharedService.isAuthorized;
            if ($location.path() !== '/logout' && $location.path() !== '/login') {
                AuthSharedService.authorizedRoute((next.access) ? next.access.authorizedRoles : [USER_ROLES.all]);
            }
        });

        $rootScope.$on('$routeChangeError', function () {
            $location.path('/').replace();
        });

        $rootScope.$on('$routeChangeSuccess', function (e, current) {
            $rootScope.currentRouteQueryString = arrays.toQueryString(current.params);
            $rootScope.killAllModals();
            var pageTitle = current && current.$$route && current.$$route.title;
            $rootScope.page.setTitle(pageTitle);
            $rootScope.activeMenu = current && current.$$route && current.$$route.activeMenu;
        });

        // Call when the the client is confirmed
        $rootScope.$on('event:auth-loginConfirmed', function () {
            $rootScope.authenticated = true;
            if ($location.path() === '/login') {
                var priorRequestPath = $rootScope.locationBeforeLogin;
                if (priorRequestPath) {
                    $location.path(priorRequestPath.path()).replace();
                } else {
                    $location.path('/').replace();
                }
            } else if ($location.path() === '/') {
                // special reload is required here because the path wasn't changed
                $location.path('reload...').replace();
            }
        });

        // Call when the 401 response is returned by the server
        $rootScope.$on('event:auth-loginRequired', function (event, rejection) {
            Session.destroy();
            $rootScope.locationBeforeLogin = rejection.location;
            $rootScope.authenticated = false;
            $location.path('/login').replace();
        });

        // Call when the 403 response is returned by the server
        $rootScope.$on('event:auth-notAuthorized', function () {
            $location.path('/403').replace();
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
            $location.path('/logout');
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
    });
