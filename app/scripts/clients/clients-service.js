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
                        angular.extend(client, response.entity);
                        return response;
                    });
            },
            deleteClient: function (id) {

            },
            viewClient: function (clientEntity) {
                $location.path('/clients/' + clientEntity.id + '/view');
            },
            viewClientList: function () {
                $location.path('/clients');
            },
            editClient: function (clientEntity) {
                $location.path('/clients/' + clientEntity.id + '/edit');
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
            getOwnersReferenceDataList: function (href, field) {
            	var owners = [];
                return $http.get(UriTemplate.create(href).stringify({sort: field, size: 1}))
                    .then(function load(response) {
                    	var page = response.data;
                        angular.forEach(page.content, function(a){
                            owners.push(a);	
                        });                        
                        if (page.link && page.link['page-next']) {
                        	$http.get(page.link['page-next']).then(function(response){
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
            }
        };

    })
    .directive('cancelClick', ['$popover', 'Client', 'Location', '$timeout', '$translate', function ($popover, Client, Location, $timeout, $translate) {
        return {
            restrict: 'EA',
            scope: {
                'ok': '&onOk'
            },
            link: function (scope, element) {
                scope.cancel = function () {
                    scope.cancelWarning.hide();
                };
                element.on('click', function () {
                    if (Location.hasLocationModifications(Client.getClient())) {
                        // pop a warning dialog
                        if (!scope.cancelWarning) {
                            $translate('client_edit_page.cancel_dialog.title').then(function (title) {
                                scope.cancelWarning = $popover(element, {
                                    title: title,
                                    scope: scope,
                                    show: true,
                                    placement: 'top',
                                    contentTemplate: 'partials/client/cancel_popover.tpl.html'
                                });
                            });
                        }
                    } else {
                        $timeout(function () {
                            scope.ok();
                        });
                    }
                });
            }
        };
    }])

    .directive('saveClick', ['$popover', 'Client', '$timeout', '$translate', function ($popover, Client, $timeout, $translate) {
        return {
            restrict: 'EA',
            scope: {
                'okDeactivatePopover': '&onOk'
            },
            link: function (scope, element) {
                scope.cancelDeactivatePopover = function () {
                    scope.saveWarning.hide();
                };
                element.on('click', function () {
                    var clientResource = Client.getClient();
                    if (!clientResource.entity.active && clientResource.currentlyActive) {
                        // pop a warning dialog
                        if (!scope.saveWarning) {
                            $translate('client_edit_page.deactivate_dialog.title').then(function (title) {
                                scope.saveWarning = $popover(element, {
                                    title: title,
                                    scope: scope,
                                    show: true,
                                    placement: 'top',
                                    contentTemplate: 'partials/client/deactivate_popover.tpl.html'
                                });
                            });
                        }
                    } else {
                        $timeout(function () {
                            scope.okDeactivatePopover();
                        });
                    }
                });
            }
        };
    }])

;
