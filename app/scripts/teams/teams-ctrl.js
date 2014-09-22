'use strict';

angular.module('emmiManager')

    .controller('TeamCtrl',function ($scope,$http, Session, UriTemplate, Client, Team, $alert){
        $scope.team = {
	        'name': null,
	        'description': null,
	        'active': true,
	        'phone': null,
	        'fax': null,
	        'client': null
	    };
        $scope.team.client = Client.selectedClient;
     
        $scope.save = function (isValid) {
        	$scope.formSubmitted = true;
        	if(isValid){        		
                Team.insertTeams($scope.team).then(function (team) {
                	$scope.team = team.data.entity;
                    Team.viewTeam($scope.team);
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
    });
