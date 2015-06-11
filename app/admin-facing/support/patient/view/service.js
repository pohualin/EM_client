(function (angular) {

    'use strict';
    angular.module('emmiManager')

    /**
     * This service is responsible fetch operations for Patient resources
     */
        .service('PatientSupportViewService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Session',
            function ($filter, $q, $http, UriTemplate, CommonService, Session) {

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
                            return response.data;
                        });
                    }
                };
            }]);

})(window.angular);
