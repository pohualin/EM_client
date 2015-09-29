'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {
        // Routes
        $routeProvider
            .when('/validateEmail/:validationKey/:trackingToken?', {
                templateUrl: 'client-facing/auth/login.html',
                controller: 'validateEmail',
                title: 'Validate Email',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    validationKey: ['$route', '$q', function ($route, $q) {
                        var deferred = $q.defer();
                        if ($route.current.params.validationKey) {
                            deferred.resolve($route.current.params.validationKey);
                        } else {
                            deferred.reject();
                        }
                        return deferred.promise;
                    }],
                    trackingToken: ['$route', '$q', function ($route) {
                        return $route.current.params.trackingToken;
                    }]
                }
            });
    })
;
