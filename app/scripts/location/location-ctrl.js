'use strict';

angular.module('emmiManager')

    .controller('LocationCommon', function ($scope, Location, Client) {
        Location.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });
        $scope.client = Client.getClient();
        $scope.noSearch = true;
    })

    .controller('LocationEditController', function ($scope, $controller) {

        $controller('LocationCommon', {$scope: $scope});

    })

    .controller('LocationListController', function ($scope, Location, $http, Session, UriTemplate, $controller) {

        $controller('LocationCommon', {$scope: $scope});

        var handleResponse = function (locationPage) {
            if (locationPage) {
                $scope.locations = locationPage.content;
                $scope.total = locationPage.page.totalElements;
                $scope.links = [];
                for (var i = 0, l = locationPage.linkList.length; i < l; i++) {
                    var aLink = locationPage.linkList[i];
                    if (aLink.rel.indexOf('self') === -1) {
                        $scope.links.push({
                            order: i,
                            name: aLink.rel.substring(5),
                            href: aLink.href
                        });
                    }
                }
                $scope.load = locationPage.link.self;
                $scope.currentPage = locationPage.page.number;
                $scope.currentPageSize = locationPage.page.size;
                $scope.pageSizes = [10, 25, 50, 100];
                $scope.status = locationPage.filter.status;
            } else {
                $scope.total = 0;
            }
            $scope.noSearch = false;
        };

        $scope.search = function () {
            $scope.locations = null;
            Location.find($scope.locationQuery, $scope.status).then(function (locationPage) {
                handleResponse(locationPage);
            });
        };

        $scope.fetchPage = function (href) {
            $scope.locations = null;
            Location.fetchPageLink(href).then(function (locationPage) {
                handleResponse(locationPage);
            });
        };

        $scope.changePageSize = function (pageSize) {
            $scope.locations = null;
            Location.find($scope.locationQuery, $scope.status, pageSize).then(function (locationPage) {
                handleResponse(locationPage);
            });
        };
    })

;