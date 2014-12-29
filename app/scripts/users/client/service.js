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
                list: function (client, query, sort, status, team) {
                    return $http.get(UriTemplate.create(client.link.users).stringify({
                        term: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        teamId: team ? team.entity.id : ''
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
                }
            };
        }])
;
