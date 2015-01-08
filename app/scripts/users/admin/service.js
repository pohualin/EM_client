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
                        useEmail: true,
                        active:true,
                    };
                    return newUser;
                },

                userAssembler: function (user) {
                    var userAdmin = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        login: user.email,
                        id: user.id,
                        active:user.active,
                        version: user.version
                    };

                    var request = {};
                    request.userAdmin = userAdmin;
                    request.roles = [user.role.entity];

                    return request;
                },

                /**
                 * Call server to create User
                 */
                createUser: function (userToBeEdit) {
                    return $http.post(UriTemplate.create(Session.link.users).stringify(), this.userAssembler(userToBeEdit))
                        .success(function (response) {
                            return response;
                        });
                },

                updateUser: function (userToBeEdit) {
                    return $http.put(UriTemplate.create(Session.link.users).stringify(), this.userAssembler(userToBeEdit))
                        .success(function (response) {
                        	selectedUser = response;
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
                 * Call server to get a list of User admin roles
                 */
                listUserAdminRoles: function () {
                    return $http.get(UriTemplate.create(Session.link.userAdminRoles).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                /**
                 * Getter of selectedUser
                 */
                getUser: function () {
                    return selectedUser;
                },
                /**
                 * Get the User role to default on the New user screen
                 */
                getDefaultRole: function(roles){
                	var roleToDefault = {};
                	angular.forEach(roles, function (role) {
                		if(role.entity.name === 'Emmi User'){                			
                			roleToDefault = role.entity;
                		}                		
                    });
                	return roleToDefault;
                }
            };
        }])
;
