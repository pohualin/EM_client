(function (angular) {

    'use strict';
    angular.module('emmiManager')

    /**
     * This service is responsible fetch operations for Patient resources
     */
        .service('PatientSupportViewService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Session',
            'PatientSupportViewReferenceData',
            function ($filter, $q, $http, UriTemplate, CommonService, Session, refData) {

                /**
                 * Ensure that nullable attributes are present on the entity
                 *
                 * @param patientResource to ensure
                 * @returns {*} the patientResource
                 */
                function handleNullableFields(patientResource) {
                    if (patientResource) {
                        if (angular.isUndefined(patientResource.entity.email)) {
                            patientResource.entity.email = '';
                        }
                        if (angular.isUndefined(patientResource.entity.phone)) {
                            patientResource.entity.phone = '';
                        }
                        if (angular.isUndefined(patientResource.entity.optOutPreference)) {
                            patientResource.entity.optOutPreference = null;
                        }
                    }
                    return patientResource;
                }

                return {
                    /**
                     * Loads a patient by id
                     * @param patientId to load
                     * @returns {promise}
                     */
                    load: function (patientId) {
                        return $http.get(UriTemplate.create(Session.link.patientById).stringify({
                            patientId: patientId
                        })).then(function (response) {
                            return handleNullableFields(response.data);
                        });
                    },

                    /**
                     * Saves a patient
                     * @param patientResource to be saved
                     * @returns {*}
                     */
                    save: function (patientResource) {
                        return $http.put(UriTemplate.create(patientResource.link.self).stringify(),
                            patientResource.entity).then(
                            function ok(response) {
                                return handleNullableFields(response.data);
                            });
                    },

                    /**
                     * Returns the reference data for the patient
                     *
                     * @param patientResource on which to find the link for reference data
                     * @returns {promise}
                     */
                    loadReferenceData: function (patientResource) {
                        var deferred = $q.defer();
                        if (!refData.referenceData()) {
                            $http.get(patientResource.link.referenceData).then(function (response) {
                                deferred.resolve(refData.create(response.data).referenceData());
                            });
                        } else {
                            deferred.resolve(refData.referenceData());
                        }
                        return deferred.promise;
                    },

                    /**
                     * Loads all of the scheduled programs for a patient
                     * @param patientResource to load programs
                     * @returns {promise}
                     */
                    loadScheduledPrograms: function (patientResource) {
                        var deferred = $q.defer(),
                            scheduledPrograms = [];

                        $http.get(UriTemplate.create(patientResource.link.scheduledPrograms).stringify({
                            size: 50,
                            sort: ["active,desc", "id,desc"],
                            expired: true,
                            patient: patientResource.entity.id
                        })).then(function load(response) {
                            var page = response.data;
                            CommonService.convertPageContentLinks(page);

                            angular.forEach(page.content, function (scheduledProgram) {
                                scheduledPrograms.push(scheduledProgram);
                            });

                            if (page.link && page.link['page-next']) {
                                return $http.get(page.link['page-next']).then(function (response) {
                                    return load(response);
                                });
                            }
                            deferred.resolve(scheduledPrograms);
                        });
                        return deferred.promise;
                    }
                };
            }])

    /**
     * Stores the reference data
     */
        .factory('PatientSupportViewReferenceData', [function () {
            this.create = function (referenceData) {
                this._referenceData = referenceData;
                return this;
            };

            this.referenceData = function () {
                return this._referenceData;
            };

            return this;
        }]);

})(window.angular);
