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
                    if ($scope.clientToEdit) {
                        angular.forEach(searchResults.entity.account, function(value, key) {
                            if (value.id) {
                                // Remove the clientName from the Account if it matches the id of the current client (so you can re-select the account when editing)
                                if ($scope.clientToEdit.id === value.id) {
                                    value.clientName = null;
                                }
                            }
                        });
                    }
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
                $scope.clientToEdit.salesForceAccount = account;
                return true;
            } else {
                return false;
            }
        };

        $scope.hasMore = function () {
            return !$scope.sfResult.complete && $scope.sfResult.account.length > 0;
        };

        $scope.changeSfAccount = function () {
            $scope.sfSearch.searchQuery = $scope.clientToEdit.salesForceAccount.name;
            $scope.sfResult.account = [];
            // save the previous salesforce account in case they blur the input without re-searching
            $scope.clientToEdit.prevSalesForceAccount = $scope.clientToEdit.salesForceAccount;
            $scope.clientToEdit.salesForceAccount = null;
            focus('SfSearch');
        };

        $scope.revertSfAccount = function () {
            if (!$scope.clientToEdit.salesForceAccount && $scope.clientToEdit.prevSalesForceAccount) {
                // make sure the search term hasn't been changes
                if ($scope.sfSearch.searchQuery === $scope.clientToEdit.prevSalesForceAccount.name) {
                    $scope.clientToEdit.salesForceAccount = $scope.clientToEdit.prevSalesForceAccount;
                }
            }
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

;
