'use strict';

angular.module('emmiManager')

    .controller('TeamCtrl',function ($scope,$http, Session, UriTemplate, $location, Client, Team){
        $scope.team = {
	        'name': null,
	        'description': null,
	        'active': true,
	        'phone': null,
	        'fax': null,
	        'client': null
	    };
        $scope.team.client = Client.selectedClient;
     
        $scope.save = function () {
            Team.insertTeams($scope.team).then(function () {
                $location.path('/clients');
            });
        };
    })
