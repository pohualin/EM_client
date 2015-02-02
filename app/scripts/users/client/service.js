'use strict';
angular.module('emmiManager')

/**
 * This service is responsible LCRUD operations for UserClient resources
 */
    .service('UsersClientService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client', 'Session',
        function ($filter, $q, $http, UriTemplate, CommonService, Client, Session) {
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
                 * Sets an attribute on userClientResource named deactivationPopoverOpen
                 * to the value of isOpen
                 *
                 * @param userClientResource to set it on
                 * @param isOpen the value
                 */
                deactivatePopoverOpen: function (userClientResource, isOpen) {
                    userClientResource.deactivationPopoverOpen = isOpen;
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
                        teamId: team ? team.id : '',
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
                 * @returns {{team: null, teamWithinTag: null, tag: null}}
                 */
                createNewTeamTagFilter: function () {
                    return {
                        team: null,
                        teamWithinTag: null,
                        tag: null
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
                            teamTagFilter.tag = null;
                            teamTagFilter.teamWithinTag = null;
                            teamTagFilter.team = null;
                            if (response.filter) {
                                // update the passed filter with the response
                                if (response.filter.tag && response.filter.tag.id) {
                                    // a tag filter was on the response
                                    if (response.filter.team && response.filter.team.id) {
                                        teamTagFilter.teamWithinTag = response.filter.team;
                                    }
                                    teamTagFilter.tag = response.filter.tag;

                                } else if (response.filter.team && response.filter.team.id) {
                                    //a team filter was on the response (which means it can't have a tag)
                                    teamTagFilter.team = response.filter.team;
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
                    var deferred = $q.defer(), me = this;

                    if (teamTagFilter && teamTagFilter.tag) {
                        teamTagFilter.teamsWithinTag = null;   // reset any already selected team
                        me.getTeamTags([teamTagFilter.tag]).then(function (teamTags) {
                            // find team tags for the selected filter tag
                            me.getTeamsFromTeamTags(teamTags).then(function (teams) {
                                var teamsWithinTag = [];
                                angular.forEach(teams, function (team) {
                                    teamsWithinTag.push(team);
                                });
                                deferred.resolve(teamsWithinTag);
                            });
                        });
                    }
                    return deferred.promise;
                },

                /**
                 * Load all TeamTags for the passed tags
                 *
                 * @param filterTags for which to load TeamTags
                 * @returns array of TeamTag entities
                 */
                getTeamTags: function (filterTags) {
                    var deferred = $q.defer();
                    var teamTags = [];
                    var tagIds = [];

                    angular.forEach(filterTags, function (filterTag) {
                        tagIds.push(filterTag.id);
                    });

                    $http.get(UriTemplate.create(Client.getClient().link.teamTagsWithTags).stringify({
                            tagIds: tagIds
                        })
                    ).then(function load(response) {
                            var page = response.data;
                            CommonService.convertPageContentLinks(page);
                            angular.forEach(page.content, function (teamTag) {
                                teamTags.push(teamTag.entity);
                            });
                            if (page.link && page.link['page-next']) {
                                $http.get(page.link['page-next']).then(function (response) {
                                    load(response);
                                });
                            }
                            deferred.resolve(teamTags);
                        });
                    return deferred.promise;
                },

                /**
                 * Get the distinct teams from an array of teamTags
                 *
                 * @param teamTags to loop over
                 * @returns an object keyed by team.id whose value is the team entity
                 */
                getTeamsFromTeamTags: function (teamTags) {
                    var deferred = $q.defer();
                    var teams = {};

                    angular.forEach(teamTags, function (teamTag) {
                        if (teamTag.team.active) {
                            teams[teamTag.team.id] = teamTag.team;
                        }
                    });

                    deferred.resolve(teams);
                    return deferred.promise;
                },

                /**
                 * Get all of the teams on a client
                 *
                 * @returns array of team entities
                 */
                getClientTeams: function () {
                    var teams = [];
                    return $http.get(UriTemplate.create(Client.getClient().link.teams).stringify()).then(function load(response) {
                        var page = response.data;
                        angular.forEach(page.content, function (team) {
                            teams.push(team.entity);
                        });
                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        return teams;
                    });
                },

                /**
                 * Fetch all of the client tags for the client
                 *
                 * @returns array of tag entities with the group property populated
                 */
                getClientTagsWithGroups: function () {
                    var deferred = $q.defer();
                    var groups = [];

                    $http.get(UriTemplate.create(Client.getClient().link.groups).stringify({
                        sort: 'name,asc'
                    })).then(function load(response) {
                        var page = response.data;
                        CommonService.convertPageContentLinks(page);

                        angular.forEach(page.content, function (group) {
                            group.entity.tag.sort(function (a, b) {
                                a.name.localeCompare(b.name);
                            });
                            groups.push(group);
                        });

                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        // put the group back on the tag object
                        var clientTagsInGroups = [];
                        angular.forEach(groups, function (group) {
                            var localGroup = angular.copy(group.entity);
                            localGroup.title = group.name;

                            //rebuild groups on each tag
                            localGroup.tag = null;
                            angular.forEach(group.entity.tag, function (tag) {
                                tag.group = localGroup;
                                tag.text = tag.name;
                                clientTagsInGroups.push(tag);
                            });
                        });
                        deferred.resolve(clientTagsInGroups);
                    });

                    return deferred.promise;
                }
            };
        }])
;
