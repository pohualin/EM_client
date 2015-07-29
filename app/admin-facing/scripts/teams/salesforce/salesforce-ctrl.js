'use strict';

angular.module('emmiManager')

    .controller('SalesForceCtrl',function ($scope, SalesForce, team, debounce, focus, $timeout){
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
            if (account && !account.teamName) {
                $scope.teamToSave.salesForceAccount = account;
                $scope.updatingSalesForceAccount = false;
                // set focus on Salesforce update button after typeahead loses focus
                $timeout(function() {
                    angular.element('[data-focus-after-typeahead]')[0].focus();
                });
                return true;
            } else {
                return false;
            }
        };

        $scope.hasMore = function () {
            return !$scope.sfResult.complete && $scope.sfResult.account.length > 0;
        };

        $scope.revertSfAccount = function () {
            $scope.updatingSalesForceAccount = false;
        };

        $scope.changeSfAccount = function () {
            $scope.sfSearch.searchQuery = $scope.teamToSave.salesForceAccount.name;
            $scope.sfResult.account = [];
            $scope.updatingSalesForceAccount = true;
            focus('TeamSfSearch');
        };

    })
;
