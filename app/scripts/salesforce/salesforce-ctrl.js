'use strict';

angular.module('emmiManager')

    .controller('SalesForceCtrl',function ($scope, SalesForce, salesForceAccount, debounce){      
        $scope.sfSearch = {};
        $scope.sfResult = {};
        $scope.sfResult.account = [];

        SalesForce.getReferenceData().then(function (refData) {
            $scope.findSalesForceAccountLink = refData.link.findSalesForceAccount;
        });

        $scope.findAccount = debounce(function (term) {
            SalesForce.findSalesForceAccount($scope.findSalesForceAccountLink, term).then(function (searchResults) {
                if (searchResults.entity) {
                    $scope.sfResult = searchResults.entity;
                } else {
                    $scope.sfResult = {};
                    $scope.sfResult.account = [];
                }
            });
        }, 333);

        $scope.chooseAccount = function (account) {
            if (account ) {
                salesForceAccount.salesForceAccount = account;
                return true;
            } else {
                return false;
            }
        };

       $scope.changeSfAccount = function (account) {
            $scope.sfSearch.searchQuery = account.name;
            $scope.sfResult.account = [];
            salesForceAccount.salesForceAccount = null;
            focus('SfSearch');
        };

    })
;
