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
                        firstName: null,
                        lastName: null,
                        email: null,
                        login: null,
                        useEmail: true
                    };
                    return newUser;
                },

                /**
                 * Call server to create User
                 */
                createUser: function (userToBeEdit) {
                    if (userToBeEdit.useEmail) {
                        userToBeEdit.login = userToBeEdit.email;
                    }

                    return $http.post(UriTemplate.create(Session.link.users).stringify(), {
                        firstName: userToBeEdit.firstName,
                        lastName: userToBeEdit.lastName,
                        email: userToBeEdit.emai,
                        login: userToBeEdit.login,
                        id: userToBeEdit.id
                        })
                        .success(function (response) {
                            return response;
                        });
                },

                toggleActivation: function (userClientResource) {
                    userClientResource.active = !userClientResource.active;
                    return $http.put(UriTemplate.create(userClientResource.link.self).stringify(), userClientResource)
                        .success(function (response) {
                            angular.extend(userClientResource, response);
                            return response;
                        });
                },

                /**
                 * Call server to get a list of User
                 */
                list: function (query, sort) {
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
                 * Call server to fetch next batch of User
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
                getUser: function () {
                    return selectedUser;
                }
            };
        }])
;
