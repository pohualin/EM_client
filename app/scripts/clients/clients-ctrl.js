'use strict';

angular.module('emmiManager')

    .controller('ViewEditCommon', function ($scope, Client, focus, debounce, $alert) {

        $scope.sfResult = {};
        $scope.sfResult.account = [];
        $scope.formSubmitted = false;

        Client.getReferenceData().then(function (refData) {
            $scope.clientTypes = refData.clientType;
            $scope.clientRegions = refData.clientRegion;
            $scope.clientTiers = refData.clientTier;
            $scope.findSalesForceAccountLink = refData.link.findSalesForceAccount;
            Client.getOwnersReferenceDataList(refData.link.potentialOwners)
                .then(function (ownerPage) {
                    $scope.contractOwners = ownerPage.content;
                });
            $scope.findSalesForceAccount = function () {
                Client.findSalesForceAccount(refData.link.findSalesForceAccount, $scope.searchQuery).then(function (searchResults) {
                    if (searchResults.entity) {
                        $scope.sfResult = searchResults.entity;
                    } else {
                        $scope.sfResult = null;
                    }
                });
            };
        });

        $scope.findAccount = debounce(function (term) {
            if (term.length < 3) {
                $scope.sfResult.account = [];
            } else {
                Client.findSalesForceAccount($scope.findSalesForceAccountLink, term).then(function (searchResults) {
                    if (searchResults.entity) {
                        $scope.sfResult = searchResults.entity;
                    } else {
                        // No results returned
                        $scope.sfResult = {};
                        $scope.sfResult.account = [];
                    }
                });
            }

        }, 333);

        $scope.chooseAccount = function (account) {
            if (account && !account.clientName) {
                $scope.searchQuery = account.name;
                $scope.client.salesForceAccount = account;
                return true;
            } else {
                return false;
            }
        };

        $scope.handleResponse = function (entityPage, scopePropertyNameForEntity) {
            if (entityPage) {
                this[scopePropertyNameForEntity] = entityPage.content;

                $scope.total = entityPage.page.totalElements;
                $scope.links = [];
                for (var i = 0, l = entityPage.linkList.length; i < l; i++) {
                    var aLink = entityPage.linkList[i];
                    if (aLink.rel.indexOf('self') === -1) {
                        $scope.links.push({
                            order: i,
                            name: aLink.rel.substring(5),
                            href: aLink.href
                        });
                    }
                }
                $scope.load = entityPage.link.self;
                $scope.currentPage = entityPage.page.number;
                $scope.currentPageSize = entityPage.page.size;
                $scope.pageSizes = [5, 10, 15, 25];
                $scope.status = entityPage.filter.status;
            } else {
                $scope.total = 0;
            }
            $scope.noSearch = false;
        };

        $scope.hasMore = function () {
            return !$scope.sfResult.complete && $scope.sfResult.account.length > 0;
        };

        $scope.changeSfAccount = function () {
            $scope.searchQuery = $scope.client.salesForceAccount.name;
            $scope.sfResult.account = [];
            $scope.client.salesForceAccount = null;
            focus('SfSearch');
        };

        $scope.errorAlert = $alert({
            title: ' ',
            content: 'Please correct the below information.',
            container: '#alerts-container',
            type: 'danger',
            show: false,
            dismissable: false
        });
    })

/**
 * Create new controller
 */
    .controller('ClientCtrl', function ($scope, Client, $controller, Location) {

        $controller('ViewEditCommon', {$scope: $scope});

        $scope.client = Client.newClient().entity;

        $scope.saveUpdate = function (isValid) {
            // this will get called if the client form saves but any child calls fail
            $scope.formSubmitted = true;
            if (isValid) {
                Client.updateClient($scope.client).then(function () {
                    // update locations for the client
                    Location.updateForClient(Client.getClient()).then(function () {
                        Client.viewClient($scope.client);
                    });
                });
            } else {
                $scope.errorAlert.show();
            }
        };

        $scope.cancel = function () {
            Client.viewClientList();
        };

        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid) {
                Client.insertClient($scope.client).then(function (client) {
                    $scope.client = client.data.entity;
                    $scope.save = $scope.saveUpdate;
                    // saved client successfully, switch to saveUpdate if other updates fail
                    Location.updateForClient(Client.getClient()).then(function () {
                        Client.viewClient($scope.client);
                    });
                });
            } else {
                $scope.errorAlert.show();
            }
        };

    })

/**
 *  Show list of clients
 */
    .controller('ClientListCtrl', function ($scope, Client, $http, Session, UriTemplate, $controller) {

        $controller('ViewEditCommon', {$scope: $scope});

        var fetchPage = function (href) {
            $scope.clients = null;
            Client.getClients(href).then(function (clientPage) {
                $scope.handleResponse(clientPage, 'clients');
            });
        };

        Client.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });

        $scope.search = function () {
            $scope.searchPerformed = true;
            fetchPage(UriTemplate.create(Session.link.clients).stringify({name: $scope.query, status: $scope.status}));
        };

        $scope.selectClient = function (client) {
            Client.viewClient(client);
        };

        $scope.fetchPage = function (href) {
            fetchPage(href);
        };

        $scope.changePageSize = function (loadLink, pageSize) {
            fetchPage(UriTemplate.create(loadLink).stringify({size: pageSize}));
        };
    })

/**
 *  Edit a single client
 */
    .controller('ClientDetailCtrl', function ($scope, Client, $controller, Location, clientResource) {

        $controller('ViewEditCommon', {$scope: $scope});

        if (clientResource) {
            $scope.client = clientResource.entity;
        } else {
            Client.viewClientList();
        }

        $scope.cancel = function () {
            Client.viewClient($scope.client);
        };

        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid) {
                Client.updateClient($scope.client).then(function () {
                    // update locations for the client
                    Location.updateForClient(Client.getClient()).then(function () {
                        Client.viewClient($scope.client);
                    });
                });
            } else {
                $scope.errorAlert.show();
            }
        };
    })

/**
 * View a single client
 */
    .controller('ClientViewCtrl', function ($scope, clientResource, Client, Location) {
        if (clientResource) {
            $scope.client = clientResource.entity;
        } else {
            Client.viewClientList();
        }
        Location.findForClient(clientResource).then(function (locationPage) {
            $scope.handleResponse(locationPage, 'clients');
        });
        $scope.edit = function () {
            Client.editClient($scope.client);
        };
    })
;
