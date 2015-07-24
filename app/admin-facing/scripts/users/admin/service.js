'use strict';
angular.module('emmiManager')

    .service('UsersService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Session',
        function ($filter, $q, $http, UriTemplate, CommonService, Session) {
            var selectedUser;
            var pattern = /[a-z0-9!@#$%^&*()<>?]$/;

            return {
                /**
                 * Create a new User placeholder
                 */
                newUser: function () {
                    return {
                        firstName: null,
                        lastName: null,
                        email: null,
                        login: null,
                        useEmail: true,
                        webApiUser: false,
                        active: true
                    };
                },

                userAssembler: function (user) {
                    var userAdmin = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        login: user.email,
                        id: user.id,
                        active: user.active,
                        webApiUser: user.webApiUser,
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

                /**
                 * Set deactivationPopoverOpen to isOpen for the user
                 */
                deactivatePopoverOpen: function (user, isOpen) {
                    user.deactivationPopoverOpen = isOpen;
                },

                updateUser: function (userToBeEdit) {
                    return $http.put(UriTemplate.create(Session.link.users).stringify(), this.userAssembler(userToBeEdit))
                        .success(function (response) {
                            selectedUser = response;
                            selectedUser.currentlyActive = selectedUser.active;
                            return response;
                        });
                },

                /**
                 * Saves a password on the user
                 * @param userWithPassword
                 */
                savePassword: function(userWithPassword){
                    return $http.put(UriTemplate.create(userWithPassword.link.password).stringify(), {
                        password: userWithPassword.password
                    })
                        .success(function (response) {
                            selectedUser = response;
                            selectedUser.currentlyActive = selectedUser.active;
                            return response;
                        });
                },

                /**
                 * Toggle between active/inactive for an Emmi User
                 */
                toggleActivation: function (user) {
                    var external = this;
                    user.active = !user.active;
                    return this.setUser(user.id).then(function (response) {
                        user.role = {};
                        user.role.entity = response.roles[0];
                        user.version = response.version;
                        return external.updateUser(user);
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
                            if (selectedUser) {
                                selectedUser.currentlyActive = selectedUser.active;
                                angular.forEach(selectedUser.roles, function (role) {
                                    if (role.name === 'SYSTEM') {
                                        selectedUser.isSystemUser = true;
                                    }
                                });
                            }
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
                getDefaultRole: function (roles) {
                    var roleToDefault = {};
                    angular.forEach(roles, function (role) {
                        if (role.entity.defaultRole) {
                            roleToDefault = role.entity;
                        }
                    });
                    return roleToDefault;
                },

                generatePassword: function () {
                    var char = '', n, length = 25, prefix = '' ;
                    while (prefix.length < length) {
                        n = Math.floor(Math.random() * 94) + 33;
                        char = String.fromCharCode(n);
                        if (char.match(pattern)) {
                            prefix = '' + prefix + char;
                        }
                    }
                    return prefix;
                }

            };
        }])
;
