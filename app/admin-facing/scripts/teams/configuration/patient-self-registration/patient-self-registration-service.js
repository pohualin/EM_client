'use strict';

angular.module('emmiManager')
    .service('PatientSelfRegService', ['$http', 'API', 'UriTemplate', function($http, API, UriTemplate){
        return{
            get: function (team) {
                return $http.get(UriTemplate.create(team.link.patientSelfRegConfig).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            },
            create: function (team, config) {
                return $http.post(UriTemplate.create(team.link.patientSelfRegConfig).stringify(), config)
                    .success(function (response) {
                        return response.data;
                    });
            },
            update: function (team, config) {
                return $http.put(UriTemplate.create(team.link.patientSelfRegConfig).stringify(), config)
                    .success(function (response) {
                        return response.data;
                    });
            },
            refData: function (team) {
                return $http.get(UriTemplate.create(API.patientSelfRegReferenceData).stringify()).then(function (response) {
                    return response.data.idLabelTypes;
                });
            },
        }
    }])
;
