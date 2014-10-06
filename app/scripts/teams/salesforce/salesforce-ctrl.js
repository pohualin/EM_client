'use strict';

angular.module('emmiManager')

    .controller('SalesForceCtrl',function ($scope, SalesForce, team, debounce){      
        $scope.sfSearch = {};
        $scope.sfResult = {};
        $scope.sfResult.account = [];

        SalesForce.getReferenceData().then(function (refData) {
            $scope.findSalesForceAccountLink = refData.link.findTeamSalesForceAccount;
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
                team.salesForceAccount = account;
                return true;
            } else {
                return false;
            }
        };

        $scope.hasMore = function () {
            return !$scope.sfResult.complete && $scope.sfResult.account.length > 0;
        };        

       $scope.changeSfAccount = function (account) {
            $scope.sfSearch.searchQuery = account.name;
            $scope.sfResult.account = [];
            team.salesForceAccount = null;
            focus('SfSearch');
        };

    })
;
