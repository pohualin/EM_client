'use strict';

angular.module('emmiManager')

    .service('AddProgramService', ['$http', 'UriTemplate', 'moment',
        function ($http, UriTemplate, moment) {
            return {

                /**
                 * Finds Programs
                 *
                 * @param teamResource for this team
                 * @param sort order
                 * @param pageSize how many per page
                 * @returns {*}
                 */
                findPrograms: function (teamResource, sort, pageSize, specialty) {
                    return $http.get(UriTemplate.create(teamResource.link.programs).stringify({
                            sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                            size: pageSize,
                            s: specialty ? specialty.entity.id : ''
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

                },

                /**
                 * Creates a new scheduled program object
                 * @returns {{provider: string, location: string, program: string, viewByDate: *}}
                 */
                newScheduledProgram: function () {
                    return {
                        provider: '',
                        location: '',
                        program: '',
                        specialty: '',
                        viewByDate: moment().add(30, 'days').format('YYYY-MM-DD')
                    };
                },

                /**
                 * Loads all possible team locations
                 *
                 * @param teamResource to find the locations link
                 * @param teamProviderResource to narrow the locations
                 * @returns {*}
                 */
                loadLocations: function (teamResource, teamProviderResource) {
                    var locations = [];
                    return $http.get(UriTemplate.create(teamResource.link.locations).stringify({
                        teamProviderId: teamProviderResource && teamProviderResource.entity ?
                            teamProviderResource.entity.id : ''
                    })).then(function success(response) {
                        var page = response.data;
                        locations.push.apply(locations, page.content);
                        if (page.link && page.link['page-next']) {
                            return $http.get(page.link['page-next']).then(function (response) {
                                return success(response);
                            });
                        }
                        return locations;
                    });
                },

                /**
                 * Loads all possible team providers
                 *
                 * @param teamResource to find the providers link
                 * @param teamLocationResource to narrow the providers list
                 * @returns {*}
                 */
                loadProviders: function (teamResource, teamLocationResource) {
                    var providers = [];
                    return $http.get(UriTemplate.create(teamResource.link.providers).stringify({
                        teamLocationId: teamLocationResource && teamLocationResource.entity ?
                            teamLocationResource.entity.id : ''
                    })).then(function success(response) {
                        var page = response.data;
                        providers.push.apply(providers, page.content);
                        if (page.link && page.link['page-next']) {
                            return $http.get(page.link['page-next']).then(function (response) {
                                return success(response);
                            });
                        }
                        return providers;
                    });
                },

                /**
                 * Loads all possible program specialties
                 *
                 * @param teamResource to find the providers link
                 * @returns {*}
                 */
                loadSpecialties: function (teamResource) {
                    var specialties = [];
                    return $http.get(UriTemplate.create(teamResource.link.specialties).stringify())
                        .then(function success(response) {
                            var page = response.data;
                            specialties.push.apply(specialties, page.content);
                            if (page.link && page.link['page-next']) {
                                return $http.get(page.link['page-next']).then(function (response) {
                                    return success(response);
                                });
                            }
                            return specialties;
                        });
                }
            };
        }])
;
