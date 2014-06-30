'use strict';

var emmiManagerApp = angular.module('emmiManager', [
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngResource',
    'ngRoute',
    'pascalprecht.translate',
    'mgcrea.ngStrap.datepicker',
    'emClientControllers',
    'emClientServices'
]);

emmiManagerApp.config(function ($routeProvider, $translateProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/main.html',
            controller: 'MainCtrl'
        })
        .when('/clients', {
            templateUrl: 'partials/clients.html',
            controller: 'ClientListCtrl'
        })
        .when('/clients/new', {
            templateUrl: 'partials/createClient.html',
            controller: 'ClientCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    // Initialize angular-translate
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');

});
