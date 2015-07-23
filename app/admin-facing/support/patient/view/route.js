(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Configure the routes to this module
     */
        .config(function ($routeProvider, USER_ROLES, MENU) {
            $routeProvider
                .when('/support/patients/:patientId', {
                    templateUrl: 'admin-facing/support/patient/view/main.html',
                    controller: 'PatientSupportViewController',
                    access: {
                        authorizedRoles: USER_ROLES.all
                    },
                    activeMenu: MENU.support,
                    reloadOnSearch: false,
                    resolve: {
                        patient: ['$q', '$route', 'AuthSharedService', 'PatientSupportViewService',
                            'PatientSupportDataHolder',
                            function ($q, $route, AuthSharedService, PatientSupportViewService, holder) {
                                var deferred = $q.defer();
                                holder.clear();
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
        })

    /**
     * Sets basic information for the module and loads any common data necessary across controllers
     */
        .controller('PatientSupportViewController', ['$scope', '$alert', 'patient', 'PatientSupportViewService',
            'PatientSupportDataHolder',
            function ($scope, $alert, patientResource, PatientSupportViewService, holder) {

                // make the loaded patient available to controllers
                holder.setPatient(patientResource);

                $scope._patient = patientResource.entity;

                var setTitle = function () {
                    $scope.page.setTitle('Patient - ' +
                        holder.patient().entity.firstName + ' ' +
                        holder.patient().entity.lastName + ' | ClientManager');
                };

                // when the patient is updated, update the title
                $scope.$on('patient-updated', function ($event, patientResource) {
                    holder.setPatient(patientResource);
                    $scope._patient = holder.patient().entity;
                    setTitle();
                });

                // scheduled programs are shared in child controllers
                PatientSupportViewService.loadScheduledPrograms(patientResource).then(function (scheduledPrograms) {
                    holder.setScheduledPrograms(scheduledPrograms);
                    $scope.$broadcast('scheduled-programs-loaded');
                });

                setTitle();

            }])

    /**
     * Holds the shared data across controllers within the module
     */
        .factory('PatientSupportDataHolder', [function () {
            this.setPatient = function (patientResource) {
                this._patientResource = patientResource;
                return this;
            };

            this.setScheduledPrograms = function (scheduledPrograms) {
                this._scheduledPrograms = scheduledPrograms;
                return this;
            };

            this.patient = function () {
                return this._patientResource;
            };

            this.scheduledPrograms = function () {
                return this._scheduledPrograms;
            };

            this.clear = function () {
                this._patientResource = null;
                this._scheduledPrograms = null;
            };

            return this;
        }])
    ;

})(window.angular);
