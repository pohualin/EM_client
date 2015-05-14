'use strict';

angular.module('emmiManager')
    .service('SearchPatientService', ['$http', 'API', '$q', 'UriTemplate',
        function ($http, API, $q, UriTemplate) {
            return {
                search: function (client, query, sort, pageSize, page) {
                    return $http.get(UriTemplate.create(client.link.patients).stringify({
                            name: query,
                            sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                            size: pageSize,
                            page: page
                        }
                    )).then(function (response) {
                        return response.data;
                    });
                },
                fetchPage: function (href) {
                    return $http.get(href).then(function (response) {
                        return response.data;
                    });
                }
            };
        }])
;
