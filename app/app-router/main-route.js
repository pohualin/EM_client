'use strict';

angular.module('emmiRouter')
    .config(function ($routeProvider) {

        // Routes
        $routeProvider
            .when('/', {
                templateUrl: 'app-router/main.html',
                controller: 'MainCtrl',
                title: 'Home'
            })
            .otherwise({
                redirectTo: '/'
            });
    })


;

