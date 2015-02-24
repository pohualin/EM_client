'use strict';
angular.module('emmiManager')
    .service('Client', function ($http, $q, Session, UriTemplate, $location) {
        var selectedClient;
        var referenceData;
        return {
            find: function (query, status, sort, pageSize) {
                return $http.get(UriTemplate.create(Session.link.clients).stringify({
                        name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
                    }
                )).then(function (response) {
                    return response.data;
                });
            },
            fetchPage: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        return response.data;
                    });

            },
            insertClient: function (client) {
                return $http.post(UriTemplate.create(Session.link.clients).stringify(), client)
                    .success(function (response) {
                        // update the selected client with the response
                        angular.extend(selectedClient.entity, response.entity);
                        selectedClient.link = response.link;
                        return response;
                    });
            },
            updateClient: function (client) {
                return $http.put(UriTemplate.create(Session.link.clients).stringify(), client)
                    .success(function (response) {
                        angular.extend(selectedClient.entity, response.entity);
                        return response;
                    });
            },
            viewClient: function (clientEntity) {
                $location.path('/clients/' + clientEntity.id);
            },
            viewClientList: function () {
                $location.path('/clients');
            },
            getClient: function () {
                return selectedClient;
            },
            setClient: function (clientResource) {
                selectedClient = clientResource;
            },
            newClient: function () {
                selectedClient = {
                    entity: {
                        'name': null,
                        'type': null,
                        'active': true,
                        'contractOwner': null,
                        'contractStart': null,
                        'contractEnd': null,
                        'region': null,
                        'salesForceAccount': null
                    }
                };
                return selectedClient;
            },
            selectClient: function (clientId) {
                return $http.get(UriTemplate.create(Session.link.clientById).stringify({id: clientId}))
                    .then(function (response) {
                        selectedClient = response.data;
                        return selectedClient;
                    });
            },
            getReferenceData: function () {
                var deferred = $q.defer();
                if (!referenceData) {
                    $http.get(Session.link.clientsReferenceData).then(function (response) {
                        referenceData = response.data;
                        deferred.resolve(referenceData);
                    });
                } else {
                    deferred.resolve(referenceData);
                }
                return deferred.promise;
            },
            getOwnersReferenceDataList: function (href) {
                var owners = [];
                return $http.get(UriTemplate.create(href).stringify())
                    .then(function load(response) {
                        var page = response.data;
                        owners.push.apply(owners, page.content);
                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        return owners;
                    });
            },
            findSalesForceAccount: function (href, searchString) {
                return $http.get(UriTemplate.create(href).stringify({q: searchString}))
                    .then(function (response) {
                        return response.data;
                    });
            },
            findNormalizedName: function (href, searchString) {
                return $http.get(UriTemplate.create(href).stringify({normalizedName: searchString}))
                    .then(function (response) {
                        return response.data;
                    });
            }
        };

    })

    .directive('uniqueClient', ['$popover', 'Client', '$translate', function ($popover, Client, $translate) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {

                var reset = function () {
                    if (scope.uniquePopup) {
                        scope.uniquePopup.hide();
                        ngModel.$setValidity('unique', true);
                    }
                };

                element.on('keydown', function () {
                    reset();
                });

                scope.$watch('editMode', function (value) {
                    if (!value) {
                        reset();
                    }
                });

                element.on('blur', function () {
                    scope.checkingForDupes = true;
                    Client.findNormalizedName(scope.findNormalizedNameLink, element.val()).then(function (searchResults) {
                        scope.existsClient = searchResults;
                        if (scope.existsClient.entity === undefined) {
                            ngModel.$setValidity('unique', true);
                            if (scope.uniquePopup) {
                                scope.uniquePopup.hide();
                            }
                        } else {
                            var clientResource = Client.getClient();
                            if (clientResource && clientResource.entity.id !== scope.existsClient.entity.id) {
                                ngModel.$setValidity('unique', false);
                                _paq.push(['trackEvent', 'Validation Error', 'Client', 'clientName unique']);
                                if (scope.uniquePopup) {
                                    scope.uniquePopup.show();
                                } else {
                                    $translate('client_edit_page.unique_popup_dialog.message').then(function (title) {
                                        scope.uniquePopup = $popover(element, {
                                            title: title,
                                            placement: 'top-right',
                                            scope: scope,
                                            trigger: 'manual',
                                            show: true,
                                            contentTemplate: 'admin-facing/partials/client/unique_client_popover.tpl.html'
                                        });
                                    });
                                }
                            }
                        }
                        scope.checkingForDupes = false;
                    });
                });
            }
        };
    }])

    .directive('saveClick', ['$popover', 'Client', '$timeout', '$translate', function ($popover, Client, $timeout, $translate) {
        return {
            restrict: 'EA',
            scope: {
                'okDeactivatePopover': '&onOk',
                'clientToEdit': '=clientToEdit',
                'checkingForDupes': '=checkingForDupes'
            },
            link: function (scope, element) {
                scope.cancelDeactivatePopover = function () {
                    scope.saveWarning.hide();
                    scope.clientToEdit.active = true;
                };
                element.on('click', function () {
                    var clientResource = Client.getClient();
                    if (!scope.clientToEdit.active && clientResource.entity.active) {
                        // pop a warning dialog
                        if (!scope.saveWarning) {
                            $translate('client_edit_page.deactivate_dialog.title').then(function (title) {
                                scope.saveWarning = $popover(element, {
                                    title: title,
                                    scope: scope,
                                    trigger: 'manual',
                                    show: true,
                                    placement: 'bottom',
                                    contentTemplate: 'admin-facing/partials/client/deactivate_popover.tpl.html'
                                });
                            });
                        } else {
                            scope.saveWarning.show();
                        }
                    } else {
                        scope.$watch(scope.checkingForDupes, function () {
                            if (scope.checkingForDupes === false) {
                                scope.okDeactivatePopover();
                            }
                        });
                    }
                });
            }
        };
    }])

    .filter('contractOwnerFilter', function () {
        return function (contractOwner) {
            var name = '';
            if (contractOwner) {
                if (contractOwner.firstName && contractOwner.lastName) {
                    name = contractOwner.firstName + ' ' + contractOwner.lastName;
                }
                else if (contractOwner.firstName) {
                    name = contractOwner.firstName;
                }
                else if (contractOwner.lastName) {
                    name = contractOwner.lastName;
                }
            }
            return name;
        };
    })

;
