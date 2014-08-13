'use strict';

angular.module('emmiManager')

    .controller('ClientCtrl', function ($scope, Client, $http, Session, UriTemplate, $location) {

        var fetchPage = function (href) {
            $scope.clients = [];
            Client.getClients(href).then(function (clientPage) {
                if (clientPage) {
                    $scope.clients = clientPage.content;
                    $scope.total = clientPage.page.totalElements;
                    $scope.links = [];
                    for (var i = 0, l = clientPage.linkList.length; i < l; i++) {
                        var aLink = clientPage.linkList[i];
                        if (aLink.rel.indexOf('self') === -1) {
                            $scope.links.push({
                                order: i,
                                name: aLink.rel.substring(5),
                                href: aLink.href
                            });
                        }
                    }
                    $scope.load = clientPage.link.self;
                    $scope.currentPage = clientPage.page.number;
                    $scope.currentPageSize = clientPage.page.size;
                    $scope.pageSizes = [10, 25, 50, 100];
                    $scope.status = clientPage.filter.status;
                } else {
                    $scope.total = 0;
                }
            });
        };

        Client.getReferenceData().then(function (refData) {
            $scope.clientTypes = refData.clientType;
            $scope.clientRegions = refData.clientRegion;
            $scope.clientTiers = refData.clientTier;
            Client.getOwnersReferenceDataList(refData.link.potentialOwners)
                .then(function (ownerPage) {
                    $scope.contractOwners = ownerPage.content;
                });
        });
        $scope.client = {
            'name': null,
            'type': null,
            'active': true,
            'contractOwner': null,
            'contractStart': null,
            'contractEnd': null,
            'region': null
        };

        $scope.save = function () {
            Client.insertClient($scope.client).then(function () {
                $location.path('/clients');
            });
        };

        $scope.search = function(term) {
            if(!term) {
                $scope.clients = [];
            } else {
                fetchPage(UriTemplate.create(Session.link.clients).stringify({name: term, status: 'ALL'}));
            }
            return $scope.clients;
        };


        $scope.select = function(album) {
            // console.log('album selected!', album);
            // $scope.term = album.name;
            //return album.name;
        };


    })

    .controller('ClientListCtrl', function ($scope, Client, $http, Session, UriTemplate, $location) {
        var fetchPage = function (href) {
            $scope.clients = null;
            Client.getClients(href).then(function (clientPage) {
                if (clientPage) {
                    $scope.clients = clientPage.content;
                    $scope.total = clientPage.page.totalElements;
                    $scope.links = [];
                    for (var i = 0, l = clientPage.linkList.length; i < l; i++) {
                        var aLink = clientPage.linkList[i];
                        if (aLink.rel.indexOf('self') === -1) {
                            $scope.links.push({
                                order: i,
                                name: aLink.rel.substring(5),
                                href: aLink.href
                            });
                        }
                    }
                    $scope.load = clientPage.link.self;
                    $scope.currentPage = clientPage.page.number;
                    $scope.currentPageSize = clientPage.page.size;
                    $scope.pageSizes = [10, 25, 50, 100];
                    $scope.status = clientPage.filter.status;
                } else {
                    $scope.total = 0;
                }
            });
        };

        Client.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });

        $scope.search = function() {
            fetchPage(UriTemplate.create(Session.link.clients).stringify({name: $scope.query, status: $scope.status}));
        };

        $scope.clearSearch = function() {
            $scope.query = '';
            $scope.search();
        };

        $scope.selectClient = function (href) {
            Client.selectClient(href).then(function () {
                $location.path('/clients/edit');
            });
        };

        $scope.fetchPage = function (href) {
            fetchPage(href);
        };

        $scope.changePageSize = function (loadLink, pageSize) {
            fetchPage(UriTemplate.create(loadLink).stringify({size: pageSize}));
        };

        // initial load of clients
        fetchPage(UriTemplate.create(Session.link.clients).stringify());
    })

    .controller('ClientDetailCtrl', function ($scope, $location, Client) {

        Client.getReferenceData().then(function (refData) {
            $scope.clientTypes = refData.clientType;
            $scope.clientRegions = refData.clientRegion;
            $scope.clientTiers = refData.clientTier;
            Client.getOwnersReferenceDataList(refData.link.potentialOwners)
                .then(function (ownerPage) {
                    $scope.contractOwners = ownerPage.content;
                });
        });

        var client = Client.getClient();
        if (client) {
            $scope.client = client;
        } else {
            $location.path('/clients');
        }

        $scope.save = function () {
            Client.updateClient($scope.client).then(function () {
                $location.path('/clients');
            });
        };
    })
;
