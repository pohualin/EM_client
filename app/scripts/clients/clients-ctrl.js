'use strict';

angular.module('emmiManager')

    .controller('ClientCtrl', function ($scope, $location, Client, Session, UriTemplate, $filter) {

        Client.getReferenceData(Session.link.clientsReferenceData).then(function (refData) {
            $scope.clientTypes = refData.clientType;
            $scope.clientRegions = refData.clientRegion;
            $scope.clientTiers = refData.clientTier;
            $scope.contractOwners = refData.contractOwner;
        });

        $scope.insertClient = function () {
            Client.insertClient(UriTemplate.create(Session.link.clients).stringify(),
                {
                    'name': $scope.newClient.name,
                    'type': $scope.newClient.type,
                    'contractOwner': $scope.newClient.contractOwner,
                    'contractStart': $scope.newClient.start,
                    'contractEnd': $scope.newClient.end,
                    'region': $scope.newClient.region
                }).then(function (response) {
                    $location.path('/clients');
                });
        };

    })

    .controller('ClientListCtrl', function ($scope, Client, $http, Session, UriTemplate) {
        var fetchPage = function (href) {
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
                    $scope.fetchedLink = null;
                    $scope.pageSizes = [10, 25, 50, 100];
                } else {
                    $scope.total = 0;
                }
            });
        };

        $scope.fetchLink = function (href) {
            $http.get(href)
                .then(function (data) {
                    $scope.fetchedLink = JSON.stringify(data.data);
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

    .controller('ClientDetailCtrl', function ($scope, $routeParams, Client) {
        // $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
        //   $scope.mainImageUrl = phone.images[0];
        // });

        // $scope.setImage = function(imageUrl) {
        //   $scope.mainImageUrl = imageUrl;
        // }
    })
;
