'use strict';

angular.module('emmiManager')

    .service('AddProgramService', ['$http', 'UriTemplate',
        function ($http, UriTemplate) {
            return {

                /**
                 * Finds Programs
                 *
                 * @param teamResource for this team
                 * @param sort order
                 * @param pageSize how many per page
                 * @returns {*}
                 */
                findPrograms: function (teamResource, sort, pageSize) {
                    return $http.get(UriTemplate.create(teamResource.link.programs).stringify({
                            sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                            size: pageSize
                        }
                    )).then(function (response) {
                        return response.data;
                    });
                },

                /**
                 * Fetches the next page of programs
                 *
                 * @param href to use
                 * @returns {*}
                 */
                fetchProgramPage: function (href) {
                    return $http.get(href)
                        .then(function (response) {
                            return response.data;
                        });

                }
            };
        }])
;
