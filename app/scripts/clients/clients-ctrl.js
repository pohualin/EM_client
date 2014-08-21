'use strict';

angular.module('emmiManager')

    .controller('ViewEditCommon',function ($scope, Client, focus, debounce){

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
            $scope.findSalesForceAccount = function (){
                Client.findSalesForceAccount(refData.link.findSalesForceAccount, $scope.searchQuery).then(function (searchResults){
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
                Client.findSalesForceAccount($scope.findSalesForceAccountLink, term).then(function (searchResults){
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
            if (!account.clientName) {
                $scope.searchQuery = account.name;
                $scope.client.salesForceAccount = account;
                return true;
            } else {
                return false;
            }
        };

        $scope.noSearch = true;
        $scope.createMode = false;
        $scope.tagGroups = [];
        var selectedTagGroupIndex = -1;

        $scope.hasMore = function () {
            return !$scope.sfResult.complete && $scope.sfResult.account.length > 0;
        };

        $scope.changeSfAccount = function (){
            $scope.searchQuery = $scope.client.salesForceAccount.name;
            $scope.sfResult.account = [];
            focus('SfSearch');
        };

        $scope.enterCreateMode = function (){
            $scope.createMode = true;
            $scope.newTagGroupTitle = '';
            focus('createMode');
        };

        $scope.exitCreateMode = function (){
            $scope.createMode = false;
        };

        $scope.newTagGroup = function (){
            var tagGroup = {
                title: $scope.newTagGroupTitle,
                tags: []
            };
            $scope.tagGroups.push(tagGroup);
            $scope.createMode = false;
        };

        $scope.selectTagGroup = function (groupIndex) {
            console.log(groupIndex);
            if (selectedTagGroupIndex === groupIndex) {
                console.log('Edit Group!');
                $scope.tagGroups[groupIndex].editMode = true;
                selectedTagGroupIndex = -1;
            } else {
                selectedTagGroupIndex = groupIndex;
            }
        };

        $scope.removeTagGroup = function (groupIndex) {
            $scope.tagGroups.splice(groupIndex, 1);
        };

        $scope.changeTagGroupTitle = function (groupIndex) {
            // Title already gets changed from data binding, so really just need to hide the edit form
            $scope.tagGroups[groupIndex].editMode = false;
        };

        $scope.tagExists = function (tag, groupIndex) {
            for (var j = 0; j < $scope.tagGroups[groupIndex].tags.length; j++) {
                if ($scope.tagGroups[groupIndex].tags[j].text === tag.text) {
                    return true;
                }
            }
            return false;
        };

        $scope.pasteTags = function (event, groupIndex) {
            event.preventDefault();
            var tags = event.originalEvent.clipboardData.getData('text/plain').split(' ');
            for (var i = 0, numTags = tags.length; i < numTags; i++) {
                var tag = {};
                tag.text = tags[i];
                if (tag.text.length > 0 && !$scope.tagExists(tag, groupIndex)) {
                    console.log(tag);
                    $scope.tagGroups[groupIndex].tags.push(tag);
                }
            }
        };

    })

    .controller('ClientCtrl', function ($scope, $location, Client, $controller) {

        $controller('ViewEditCommon',{$scope: $scope});

        $scope.client = {
            'name': null,
            'type': null,
            'active': true,
            'contractOwner': null,
            'contractStart': null,
            'contractEnd': null,
            'region': null,
            'salesForceAccount':  null
        };

        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid) {
                Client.insertClient($scope.client).then(function () {
                    $location.path('/clients');
                });
            }
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

    .controller('ClientDetailCtrl', function ($scope, $location, Client, $controller) {

        $controller('ViewEditCommon',{$scope: $scope});

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
