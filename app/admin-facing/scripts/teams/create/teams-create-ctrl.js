'use strict';

angular.module('emmiManager')
/**
 * Create a Single Team
 */
    .controller('ClientTeamCreateCtrl', ['$scope', 'CreateTeam', 'ViewTeam', '$controller', 'clientResource', 'Client', 'focus',
        function ($scope, CreateTeam, ViewTeam, $controller, clientResource, Client, focus) {

            $controller('TeamErrorController', {$scope: $scope});

            $scope.teamToSave = CreateTeam.newTeam().entity;

            $scope.teamClientResource = {
                teamResource: {
                    entity: {}
                },
                clientResource: clientResource
            };

            /**
             * Necessary for the directives to communicate
             * with each other
             *
             * @type {{now: boolean, click: boolean}}
             */
            $scope.checkingForDupes = {
                now: false,
                click: false
            };

            $scope.editMode = true;

            $controller('SalesForceCtrl', {$scope: $scope, team: $scope.teamToSave});

            if ($scope.cancelClickDereg){
                $scope.cancelClickDereg();
            }
            $scope.cancelClickDereg = $scope.$on('$unsaved-form-cancel-clicked', function () {
                $scope.editMode = true;
                focus('teamName');
            });

            $scope.teamToSave.client = clientResource.entity;
            $scope.url = clientResource.link.findByNormalizedName;
            $scope.save = function (teamForm) {
                var isValid = teamForm.$valid;
                $scope.formSubmitted = true;
                if (isValid && $scope.teamToSave.salesForceAccount) {
                    teamForm.$setPristine();
                    CreateTeam.insertTeams(clientResource, $scope.teamToSave).then(function (team) {
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
                                _paq.push(['trackEvent', 'Validation Error', 'Team Create', formErrors[errorType][i].$name + ' ' + errorType]);
                            }
                        }
                    }
                }
            };

            $scope.cancel = function () {
                $scope.editMode = false;
                Client.viewClient($scope.teamToSave.client);
            };

        }])
;
