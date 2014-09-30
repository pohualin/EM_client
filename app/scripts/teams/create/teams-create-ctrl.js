'use strict';

angular.module('emmiManager')
	/**
	 * Create a Single Team
	 */
    .controller('ClientTeamCreateCtrl',function ($scope,$http, $routeParams, Session, UriTemplate, CreateTeam, ViewTeam, $controller){

        $controller('TeamErrorController', {$scope: $scope});

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

    })
;
