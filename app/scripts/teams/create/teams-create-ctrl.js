'use strict';

angular.module('emmiManager')
/**
 * Create a Single Team
 */
    .controller('ClientTeamCreateCtrl', function ($scope, $http, $routeParams, Session, UriTemplate, CreateTeam, ViewTeam, $controller, clientResource, Client) {

        $controller('TeamErrorController', {$scope: $scope});

        $scope.teamToSave = CreateTeam.newTeam().entity;

        $scope.teamClientResource = {
            teamResource: {
                entity: {}
            },
            clientResource: clientResource
        };

        $controller('SalesForceCtrl', {$scope: $scope, team: $scope.teamToSave});

        $scope.teamToSave.client = clientResource.entity;
        $scope.url = clientResource.link.findByNormalizedName;
        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid && $scope.teamToSave.salesForceAccount) {
                CreateTeam.insertTeams($scope.teamToSave).then(function (team) {
                    ViewTeam.viewTeam(team.data.entity);
                });
                _paq.push(['trackEvent', 'Form Action', 'Team Create', 'Save']);
            } else {
                $scope.showError();
                // Loop through the form's validation errors and log to Piwik
                var formErrors = $scope.teamForm.$error;
                for (var errorType in formErrors) {
                    if (formErrors.hasOwnProperty(errorType)) {
                        for (var i = 0; i < formErrors[errorType].length; i++) {
                            _paq.push(['trackEvent', 'Validation Error', 'Team Create', formErrors[errorType][i].$name+' '+errorType]);
                        }
                    }
                }
            }
        };

        $scope.cancel = function () {
            Client.viewClient($scope.teamToSave.client);
        };

    })
;
