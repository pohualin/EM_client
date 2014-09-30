'use strict';

angular.module('emmiManager')
	/**
	 * Create a Single Team
	 */
    .controller('ClientTeamCreateCtrl',function ($scope,$http, $routeParams, Session, UriTemplate, CreateTeam, ViewTeam, $alert, clientResource){
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
        
        $scope.team.client = clientResource.entity;
        $scope.url = clientResource.link.findByNormalizedName;
        
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
