'use strict';
angular.module('emmiManager')

/**
 * This service is responsible LCRUD operations for UserClient resources
 */
    .service('UsersClientService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client', 'Session', 'TeamsFilter',
        function ($filter, $q, $http, UriTemplate, CommonService, Client, Session, TeamService) {
            var selectedUserClient;

            /**
             * Sets attributes on the resource that are necessary for
             * UI components
             *
             * @param userClientResource to modify
             */
            function updateResourceForUi(userClientResource) {
                if (angular.equals(userClientResource.entity.email,
                        userClientResource.entity.login)) {
                    userClientResource.useEmail = true;
                }
                userClientResource.currentlyActive = userClientResource.entity.active;
            }

            return {
                /**
                 * Create a new UserClient placeholder
                 */
                newUserClient: function () {
                    return {
                        entity: {
                            firstName: null,
                            lastName: null,
                            email: null,
                            login: null,
                            active: true
                        },
                        useEmail: true
                    };
                },

                /**
                 * Call server to create UserClient
                 */
                createUserClient: function (client, userClientToBeEdit) {
                    if (userClientToBeEdit.useEmail) {
                        userClientToBeEdit.entity.login = userClientToBeEdit.entity.email;
                    }
                    userClientToBeEdit.entity.client = client.entity;
                    return $http.post(UriTemplate.create(client.link.users).stringify(), userClientToBeEdit.entity)
                        .success(function (response) {
                            return response;
                        });
                },

                /**
                 * Calls server side update of the user client
                 *
                 * @param userClientResource to save
                 * @returns a promise
                 */
                update: function (userClientResource) {
                    if (userClientResource.useEmail) {
                        userClientResource.entity.login = userClientResource.entity.email;
                    }
                    return $http.put(UriTemplate.create(userClientResource.link.self).stringify(), userClientResource.entity)
                        .success(function (response) {
                            angular.extend(userClientResource, response);
                            delete userClientResource.currentTarget; //this gets set via the deactivate directive
                            selectedUserClient = userClientResource;
                            updateResourceForUi(selectedUserClient);
                            updateResourceForUi(response);
                            return response;
                        });
                },

                /**
                 * Switches the active boolean and then calls server side update
                 *
                 * @param userClientResource to toggle the active and save
                 * @returns a promise
                 */
                toggleActivation: function (userClientResource) {
                    userClientResource.entity.active = !userClientResource.entity.active;
                    return this.update(userClientResource);
                },

                /**
                 * Call server to get a list of UserClient
                 */
                list: function (client, query, sort, status, teamTagFilter) {
                    var team, tag;
                    if (teamTagFilter) {
                        if (teamTagFilter.tag) {
                            tag = teamTagFilter.tag;
                            team = teamTagFilter.teamWithinTag;
                        } else {
                            team = teamTagFilter.team;
                        }
                    }
                    return $http.get(UriTemplate.create(client.link.users).stringify({
                        term: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        teamId: team && team.entity ? team.entity.id : '',
                        tagId: tag ? tag.id : ''
                    })).then(function (response) {
                        CommonService.convertPageContentLinks(response.data);
                        return response.data;
                    });
                },

                /**
                 * Call server to fetch next batch of UserClient
                 */
                fetchPage: function (href) {
                    return $http.get(UriTemplate.create(href).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },

                /**
                 * Call when UserClientId is passed in as route param
                 * get UserClient by userClientId and set it to selectedUserClient
                 */
                setUserClient: function (userClientId) {
                    if (userClientId === null) {
                        // Reset selectedUserClient
                        selectedUserClient = null;
                    } else {
                        // Call server to get UserClient by userClientId
                        return $http.get(UriTemplate.create(Session.link.userClientById).stringify({id: userClientId})).then(function (userClient) {
                            selectedUserClient = userClient.data;
                            updateResourceForUi(selectedUserClient);
                            return selectedUserClient;
                        });
                    }
                },

                /**
                 * Getter of selectedUserClient
                 */
                getUserClient: function () {
                    return selectedUserClient;
                },

                /**
                 * Creates a new team tag filter from scratch
                 *
                 * @returns {{team: null, teamWithinTag: null, tag: null, reset: Function}}
                 */
                createNewTeamTagFilter: function () {
                    return {
                        team: null,
                        teamWithinTag: null,
                        tag: null,
                        reset: function () {
                            this.tag = null;
                            this.teamWithinTag = null;
                            this.team = null;
                        }
                    };
                },

                /**
                 * Creates an updated team tag filter from the response object (response of a search)
                 *
                 * @param teamTagFilter the starting point
                 * @param response the paginated search response
                 * @returns {*}
                 */
                updateTeamTagFilterFromResponse: function (teamTagFilter, response) {
                    if (teamTagFilter) {
                        if (response) {
                            // already had a filter and we got a response with data
                            teamTagFilter.reset();
                            if (response.filter) {
                                // update the passed filter with the response
                                if (response.filter.tag && response.filter.tag.id) {
                                    // a tag filter was on the response
                                    if (response.filter.team && response.filter.team.id) {
                                        teamTagFilter.teamWithinTag = {
                                            entity: response.filter.team
                                        };
                                    }
                                    teamTagFilter.tag = response.filter.tag;

                                } else if (response.filter.team && response.filter.team.id) {
                                    //a team filter was on the response (which means it can't have a tag)
                                    teamTagFilter.team = {
                                        entity: response.filter.team
                                    };
                                }
                            }
                        }
                    } else {
                        // no filter passed in, create a new shell
                        teamTagFilter = this.createNewTeamTagFilter();
                    }
                    return teamTagFilter;
                },

                /**
                 * Finds all valid teams for the passed teamTagFilter object
                 *
                 * @param teamTagFilter to inspect
                 * @returns an array of team 'resources'
                 */
                findTeamsValidForFilter: function (teamTagFilter) {
                    var deferred = $q.defer();
                    if (teamTagFilter && teamTagFilter.tag) {
                        teamTagFilter.teamWithinTag = null;   // reset any already selected team
                        TeamService.getTeamTags([teamTagFilter.tag]).then(function (teamTags) {
                            // find team tags for the selected filter tag
                            TeamService.getTeamsFromTeamTags(teamTags).then(function (teams) {
                                var teamsWithinTag = [];
                                angular.forEach(teams, function (team) {
                                    teamsWithinTag.push({
                                        entity: team
                                    });
                                });
                                deferred.resolve(teamsWithinTag);
                            });
                        });
                    }
                    return deferred.promise;
                }
            };
        }])
;
