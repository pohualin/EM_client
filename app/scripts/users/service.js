'use strict';
angular.module('emmiManager')

    .service('UsersService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Session',
        function ($filter, $q, $http, UriTemplate, CommonService, Session) {
            var selectedUser;
            return {
                /**
                 * Create a new User placeholder
                 */
                newUser: function () {
                    var newUser = {
                        entity: {
                            firstName: null,
                            lastName: null,
                            email: null,
                            login: null,
                            active: true
                        },
                        useEmail: true
                    };
                    return newUser;
                },

                /**
                 * Call server to create User
                 */
                createUser: function (userToBeEdit) {
                    if (userToBeEdit.useEmail) {
                        userToBeEdit.entity.login = userToBeEdit.entity.email;
                    }

                    return $http.post(UriTemplate.create(Session.link.users).stringify(), userToBeEdit.entity)
                        .success(function (response) {
                            return response;
                        });
                },

                toggleActivation: function (userClientResource) {
                    userClientResource.entity.active = !userClientResource.entity.active;
                    return $http.put(UriTemplate.create(userClientResource.link.self).stringify(), userClientResource.entity)
                        .success(function (response) {
                            angular.extend(userClientResource, response);
                            return response;
                        });
                },

                /**
                 * Call server to get a list of UserClient
                 */
                list: function (client, query, sort) {
                    return $http.get(UriTemplate.create(Session.link.users).stringify(
                        {
                            term: query,
                            sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''
                        }))
                        .then(function (response) {
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
                 * Call when UserId is passed in as route param
                 * get User by userId and set it to selectedUser
                 */
                setUser: function (userId) {
                    if (userId === null) {
                        // Reset selectedUser
                        selectedUser = null;
                    } else {
                        // Call server to get User by userId
                        return $http.get(UriTemplate.create(Session.link.userById).stringify({id: userId})).then(function (user) {
                            selectedUser = user.data;
                            return selectedUser;
                        });
                    }
                },

                /**
                 * Getter of selectedUser
                 */
                getUserClient: function () {
                    return selectedUser;
                }
            };
        }])
;
