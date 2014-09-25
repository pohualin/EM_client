'use strict';

angular.module('emmiManager')

    .controller('TeamSearchController',function ($scope, Client, TeamSearch){

        $scope.option = 'Teams';
        var teamsProperty = 'teams';

        Client.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });
        
        $scope.searchTeams = function () {
            $scope.loading = true;
            TeamSearch.search($scope.query).then(function (teamPage) {
                $scope.sortProperty.reset();
                $scope.searchPerformed = true;
                $scope.handleResponse(teamPage, teamsProperty);
                $scope.removeStatusFilterAndTotal = $scope.total <= 0;
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };
        
        $scope.handleResponse = function (teamPage, teamsPropertyName) {
            if (teamPage) {
            	for (var sort = 0, size = teamPage.content.length; sort < size; sort++ ){
                    var content = teamPage.content[sort];
                    content.sortIdx = sort;
                }
            	
                this[teamsPropertyName] = teamPage.content;

                $scope.total = teamPage.page.totalElements;
                $scope.links = [];
                for (var i = 0, l = teamPage.linkList.length; i < l; i++) {
                    var aLink = teamPage.linkList[i];
                    if (aLink.rel.indexOf('self') === -1) {
                        $scope.links.push({
                            order: i,
                            name: aLink.rel.substring(5),
                            href: aLink.href
                        });
                    }
                }
                $scope.load = teamPage.link.self;
                $scope.currentPage = teamPage.page.number;
                $scope.currentPageSize = teamPage.page.size;
                $scope.pageSizes = [5, 10, 15, 25];
                $scope.status = teamPage.filter.status;
            } else {
                $scope.total = 0;
                $scope[teamsPropertyName] = null;
            }
            $scope.noSearch = false;
            $scope.loading = false;
        };
        
        $scope.viewTeam = function (team) {
        	TeamSearch.viewTeam(team);
        };

        $scope.sortProperty = {
            property: null,
            ascending: null,
            resetOnNextSet: false,
            setProperty: function (property) {
                if (this.property === property) {
                    if (!this.resetOnNextSet) {
                        if (this.ascending !== null) {
                            // this property has already been sorted on once
                            // the next click after this one should turn off the sort
                            this.resetOnNextSet = true;
                        }
                        this.ascending = !this.ascending;
                    } else {
                        this.reset();
                    }
                } else {
                    this.property = property;
                    this.ascending = true;
                    this.resetOnNextSet = false;
                }
            },
            reset: function () {
                this.property = null;
                this.ascending = null;
                this.resetOnNextSet = false;
            }
        };

        // when a column header is clicked
        $scope.sort = function (property) {
            $scope.sortProperty.setProperty(property);
            $scope.loading = true;
            TeamSearch.search($scope.query, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (teamPage) {
                $scope.handleResponse(teamPage, teamsProperty);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };
        
        // when a page size link is used
        $scope.changePageSize = function (pageSize) {
            $scope.loading = true;
            TeamSearch.search($scope.query, $scope.status, $scope.sortProperty, pageSize).then(function (teamPage) {
                $scope.handleResponse(teamPage, teamsProperty);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };
        
     // when a pagination link is used
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            TeamSearch.fetchPage(href).then(function (teamPage) {
                $scope.handleResponse(teamPage, teamsProperty);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };
        

        // when the status change select changes
        $scope.statusChange = function(){
            $scope.loading = true;
            TeamSearch.search($scope.query, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (teamPage) {
                $scope.handleResponse(teamPage, teamsProperty);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };
    });