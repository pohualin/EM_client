(function (angular) {
    'use strict';

    angular.module('emmiManager')
        .config(function ($routeProvider, USER_ROLES, MENU) {

            $routeProvider
                .when('/support/patients/:patientId', {
                    templateUrl: 'admin-facing/support/patient/view/view.html',
                    controller: 'PatientSupportViewController',
                    access: {
                        authorizedRoles: USER_ROLES.all
                    },
                    activeMenu: MENU.support,
                    reloadOnSearch: false,
                    resolve: {
                        patient: ['$q', '$route', 'AuthSharedService', 'PatientSupportViewService',
                            function ($q, $route, AuthSharedService, PatientSupportViewService) {
                                var deferred = $q.defer();
                                AuthSharedService.currentUser().then(function () {
                                    PatientSupportViewService.load($route.current.params.patientId).then(
                                        function ok(patientResource) {
                                            deferred.resolve(patientResource);
                                        },
                                        function error() {
                                            deferred.reject();
                                        });
                                }, function error() {
                                    deferred.reject();
                                });
                                return deferred.promise;
                            }]
                    }
                });
        });

})(window.angular);
