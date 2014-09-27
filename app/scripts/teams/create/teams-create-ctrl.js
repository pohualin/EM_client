'use strict';

angular.module('emmiManager')
    /**
     * Create a Single Team
     */
    .controller('ClientTeamCreateCtrl',function ($scope,$http, $routeParams, Session, UriTemplate, CreateTeam, ViewTeam, $alert, debounce){
        $scope.team = {
            'name': null,
            'description': null,
            'active': true,
            'phone': null,
            'fax': null,
            'client': { 
                'id':null
            }
        };        

        $scope.team.client.id = $routeParams.clientId;
        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if(isValid){                                
                CreateTeam.insertTeams($scope.team).then(function (team) {
                    $scope.team = team.data.entity;
                    ViewTeam.viewTeam($scope.team);
                });
            }
            else {
                $scope.showError();
            }
        };

        $scope.sfSearch = {};
        $scope.sfResult = {};
        $scope.sfResult.account = [];
        $scope.formSubmitted = false;

        CreateTeam.getReferenceData().then(function (refData) {
            $scope.findTeamSalesForceAccountLink = refData.link.findTeamSalesForceAccount;
            $scope.findSalesForceAccount = function () {
                CreateTeam.findSalesForceAccount(refData.link.findTeamSalesForceAccount, $scope.sfSearch.searchQuery).then(function (searchResults) {
                    if (searchResults.entity) {
                        $scope.sfResult = searchResults.entity;
                    } else {
                        $scope.sfResult = null;
                    }
                });
            };
        });

        $scope.findAccount = debounce(function (term) {
            CreateTeam.findSalesForceAccount($scope.findTeamSalesForceAccountLink, term).then(function (searchResults) {
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
            if (account ) {
                $scope.team.teamSalesForceAccount = account;
                return true;
            } else {
                return false;
            }
        };

       $scope.changeSfAccount = function () {
            $scope.sfSearch.searchQuery = $scope.team.teamSalesForceAccount.name;
            $scope.sfResult.account = [];
            $scope.team.teamSalesForceAccount = null;
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
;
