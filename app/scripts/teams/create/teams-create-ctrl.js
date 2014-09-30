'use strict';

angular.module('emmiManager')
	/**
	 * Create a Single Team
	 */
    .controller('ClientTeamCreateCtrl',function ($scope,$http, $routeParams, Session, UriTemplate, CreateTeam, ViewTeam, $controller, clientResource){

        $controller('TeamErrorController', {$scope: $scope});

        $scope.team = {
	        'name': null,
	        'description': null,
	        'active': true,
	        'phone': null,
	        'fax': null,
            'client': {
            	'id':null
            },
            'normalizedTeamName' : null
	    };

        $controller('SalesForceCtrl', {$scope: $scope, team: $scope.team});
        
        $scope.team.client = clientResource.entity;
        $scope.url = clientResource.link.findByNormalizedName;
        $scope.save = function (isValid) {
        	$scope.formSubmitted = true;
        	if(isValid && $scope.team.salesForceAccount){
                CreateTeam.insertTeams($scope.team).then(function (team) {
                	$scope.team = team.data.entity;
                    ViewTeam.viewTeam($scope.team);
                });
        	} else {
                $scope.showError();
            }
        };

    })
;
