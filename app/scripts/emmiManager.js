'use strict';

var emmiManagerApp = angular.module('emmiManager', [
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngResource',
    'ngRoute',
    'emClientControllers',
    'emClientServices',
    'mgcrea.ngStrap.datepicker'
]);

emmiManagerApp.config(function ($routeProvider) {
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
});
