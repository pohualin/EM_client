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
            $scope.findNormalizedNameLink = refData.link.findByNormalizedName;

            Client.getOwnersReferenceDataList(refData.link.potentialOwners)
                .then(function (owners) {
                    $scope.contractOwners = owners;         	
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
            if (isValid && $scope.client.salesForceAccount) {
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
            if (isValid && $scope.client.salesForceAccount) {
                Client.insertClient($scope.client).then(function (client) {
                    $scope.client = client.data.entity;
                    $scope.save = $scope.saveUpdate;
                    // saved client successfully, switch to saveUpdate if other updates fail
                    $scope.client.tagGroups = client.config.data.tagGroups;

                    var insertGroups = Tag.insertGroups(Client.getClient()),
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
            if (isValid && $scope.client.salesForceAccount) {
                Client.updateClient($scope.client).then(function () {
                    // update locations for the client
                	
                	var insertGroups = Tag.insertGroups(Client.getClient()),
                	updateLocation = Location.updateForClient(Client.getClient());
                	
                	$q.all([insertGroups, updateLocation]).then(function() {
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
        $scope.edit = function () {
            Client.editClient($scope.client);
        };
    })
;