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
                        if (!refData.get()) {
                            $http.get(patientResource.link.referenceData).then(function (response) {
                                deferred.resolve(refData.create(response.data));
                            });
                        } else {
                            deferred.resolve(refData);
                        }
                        return deferred.promise;
                    }
                };
            }])

    /**
     * Stores the reference data
     */
        .factory('PatientSupportViewReferenceData', [function () {
            this.create = function (referenceData) {
                this.referenceData = referenceData;
                return this.get();
            };

            this.get = function () {
                return this.referenceData;
            };

            return this;
        }]);

})(window.angular);
