'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        var requiredUserClientResources = {
            'client': ['AuthSharedService', '$q', '$route',
                function (AuthSharedService, $q, $route) {
                    var deferred = $q.defer();
                    AuthSharedService.currentUser().then(function (loggedInUser) {
                        deferred.resolve(loggedInUser.clientResource);
                    });
                    return deferred.promise;
                }]
        };

        var patientResource = {
            'patientResource': ['AuthSharedService', 'ViewPatientService', '$q', '$route',
                function (AuthSharedService, ViewPatientService, $q, $route) {
                    var deferred = $q.defer();
                    AuthSharedService.currentUser().then(function (loggedInUser) {
                        ViewPatientService.loadPatient(loggedInUser.clientResource, $route.current.params.patientId)
                            .then(function (response) {
                                deferred.resolve(response.data);
                            }, function error() {
                                deferred.reject();
                            });
                    });
                    return deferred.promise;
                }]
        };

        $routeProvider
            .when('/patients/new', {

                templateUrl: 'client-facing/patient/create/new.html',
                controller: 'CreatePatientController',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: requiredUserClientResources
            })
            .when('/patients', {
                templateUrl: 'client-facing/patient/search/search.html',
                controller: 'SearchPatientController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: requiredUserClientResources
            })
            .when('/patients/:patientId', {
                templateUrl: 'client-facing/patient/view/view.html',
                controller: 'ViewPatientController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: patientResource
            });
    })
;
