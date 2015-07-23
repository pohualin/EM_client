(function (angular) {

    'use strict';
    angular.module('emmiManager')

    /**
     * This service is responsible fetch operations for program resources
     */
        .service('PatientSupportViewProgramHistoryService', ['$q', '$http', 'UriTemplate',
            function ($q, $http, UriTemplate) {
                return {
                    save: function (programResource) {
                        return $http.put(UriTemplate.create(programResource.link.self).stringify(),
                            programResource.entity).then(
                            function ok(response) {
                                return response.data;
                            });
                    }
                };
            }
        ])
    ;

})(window.angular);
