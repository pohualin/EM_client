'use strict';

angular.module('emmiManager')

    .controller('ViewEditCommon', function ($scope, Client, focus, debounce, $alert) {

        $scope.sfSearch = {};
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
                Client.findSalesForceAccount(refData.link.findSalesForceAccount, $scope.sfSearch.searchQuery).then(function (searchResults) {
                    if (searchResults.entity) {
                        $scope.sfResult = searchResults.entity;
                    } else {
                        $scope.sfResult = null;
                    }
                });
            };
        });

        $scope.findAccount = debounce(function (term) {
            Client.findSalesForceAccount($scope.findSalesForceAccountLink, term).then(function (searchResults) {
                if (searchResults.entity) {
                    $scope.sfResult = searchResults.entity;
                } else {
                    // No results returned
                    $scope.sfResult = {};
                    $scope.sfResult.account = [];
                }
            });
        }, 333);

        $scope.chooseAccount = function (account) {
            if (account && !account.clientName) {
                $scope.client.salesForceAccount = account;
                return true;
            } else {
                return false;
            }
        };

        $scope.handleResponse = function (entityPage, scopePropertyNameForEntity) {
            if (entityPage) {
                for (var sort = 0, size = entityPage.content.length; sort < size; sort++ ){
                    var content = entityPage.content[sort];
                    content.sortIdx = sort;
                }
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
                if ($scope.sortProperty && entityPage.sort){
                    angular.extend($scope.sortProperty, entityPage.sort);
                }
            } else {
                this[scopePropertyNameForEntity] = null;
                $scope.total = 0;
            }
            $scope.searchPerformed = true;
            $scope.loading = false;
        };

        $scope.hasMore = function () {
            return !$scope.sfResult.complete && $scope.sfResult.account.length > 0;
        };

        $scope.changeSfAccount = function () {
            $scope.sfSearch.searchQuery = $scope.client.salesForceAccount.name;
            $scope.sfResult.account = [];
            $scope.client.salesForceAccount = null;
            focus('SfSearch');
        };

        $scope.showError = function(){
            if (!$scope.errorAlert) {
                $scope.errorAlert = $alert({
                    title: ' ',
                    content: 'Please correct the below information.',
                    container: '#alerts-container',
                    type: 'danger',
                    show: true,
                    dismissable: false
                });
            }
        };
    })

/**
 * Create new controller
 */
    .controller('ClientCtrl', function ($scope, Client, $controller, Location, Tag, $q) {

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
                $scope.showError();
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
                    $scope.client.tagGroups = client.config.data.tagGroups;

                    var insertGroups = Tag.insertGroups($scope.client),
                    	updateLocation = Location.updateForClient(Client.getClient());
                    $q.all([insertGroups, updateLocation]).then(function () {
                    	Client.viewClient($scope.client);
                    });

                });
            } else {
                $scope.showError();
            }
        };

    })

/**
 *  Show list of clients
 */
    .controller('ClientListCtrl', function ($scope, Client, $http, Session, UriTemplate, $controller) {

        $controller('ViewEditCommon', {$scope: $scope});

        Client.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });

        // when the search button is used
        $scope.search = function () {
            $scope.loading = true;
            Client.find( $scope.query).then(function (clientPage) {
                $scope.sortProperty.reset();
                $scope.handleResponse(clientPage, 'clients');
                $scope.removeStatusFilterAndTotal = $scope.total <= 0;
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        // when the view link is used
        $scope.selectClient = function (client) {
            Client.viewClient(client);
        };

        // when a pagination link is used
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            Client.fetchPage(href).then(function (clientPage) {
                $scope.handleResponse(clientPage, 'clients');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        // when the status change select changes
        $scope.statusChange = function(){
            $scope.loading = true;
            Client.find( $scope.query, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (clientPage) {
                $scope.handleResponse(clientPage, 'clients');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        // when a page size link is used
        $scope.changePageSize = function (pageSize) {
            $scope.loading = true;
            Client.find( $scope.query, $scope.status, $scope.sortProperty, pageSize).then(function (clientPage) {
                $scope.handleResponse(clientPage, 'clients');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.sortProperty = {
            property: null,
            ascending: null,
            resetOnNextSet: false,
            setProperty: function (property){
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
            reset: function(){
                this.property = null;
                this.ascending = null;
                this.resetOnNextSet = false;
            }
        };

        // when a column header is clicked
        $scope.sort = function(property){
            $scope.sortProperty.setProperty(property);
            $scope.loading = true;
            Client.find( $scope.query, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (clientPage) {
                $scope.handleResponse(clientPage, 'clients');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };
    })

/**
 *  Edit a single client
 */
    .controller('ClientDetailCtrl', function ($scope, Client, $controller, Location, clientResource, Tag, $q) {

        $controller('ViewEditCommon', {$scope: $scope});

        if (clientResource) {
            $scope.client = clientResource.entity;
            clientResource.currentlyActive = clientResource.entity.active;
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

                	var insertGroups = Tag.insertGroups($scope.client),
                	updateLocation = Location.updateForClient(Client.getClient());

                	$q.all([insertGroups, updateLocation]).then(function(result) {
                		Client.viewClient($scope.client);
                	});

                });
            } else {
                $scope.showError();
            }
        };
    })

/**
 * View a single client
 */
    .controller('ClientViewCtrl', function ($scope, clientResource, Client, Location, $controller) {
        $controller('ViewEditCommon', {$scope: $scope});

        if (clientResource) {
            $scope.client = clientResource.entity;
            Client.setClient(clientResource);
        } else {
            Client.viewClientList();
        }

        Location.findForClient(clientResource).then(function (locationPage) {
            $scope.handleResponse(locationPage, 'clientLocations');
        });
        $scope.edit = function () {
            Client.editClient($scope.client);
        };
    })
;
