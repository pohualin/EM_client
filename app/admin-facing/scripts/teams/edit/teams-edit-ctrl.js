'use strict';

angular.module('emmiManager')

    .controller('TeamEditController', function ($scope, teamClientResource, EditTeam, ViewTeam, $controller) {

        $controller('TeamErrorController', {$scope: $scope});

        if (teamClientResource && teamClientResource.teamResource) {
            $scope.teamClientResource = teamClientResource;
            $scope.teamResource = teamClientResource.teamResource;
            $scope.team = teamClientResource.teamResource.entity;
            ViewTeam.setTeam(teamClientResource.teamResource);
            $scope.team.currentlyActive = teamClientResource.teamResource.entity.active;
            $controller('SalesForceCtrl', {$scope: $scope, team: $scope.team});
        }

        function setTitle(){
            $scope.page.setTitle('Team ' + $scope.team.id + ' - ' + $scope.team.name);
        }

        setTitle();

        $scope.url = teamClientResource.clientResource.link.findByNormalizedName;

        $scope.cancel = function (teamForm) {
            $scope.hideError();
            teamForm.$setPristine();
            $scope.editMode = false;
            $scope.formSubmitted = false;
            delete $scope.teamToSave;
            _paq.push(['trackEvent', 'Form Action', 'Team Edit', 'Cancel']);
        };

        $scope.edit = function () {
            $scope.editMode = true;
            $scope.teamToSave = angular.copy($scope.team);
            $scope.teamToSave.origSalesForceAccount = $scope.teamToSave.salesForceAccount.accountNumber;
            if (!$scope.team.description) { $scope.teamToSave.description = ''; } // EM-517: TODO: this should be fixed with a larger refactor to that angular.extend is not necessary
            focus('teamName');
            _paq.push(['trackEvent', 'Form Action', 'Team Edit', 'Edit']);
        };

        $scope.save = function (teamForm) {
            var isValid = teamForm.$valid;
            $scope.formSubmitted = true;
            if (isValid && $scope.teamToSave.salesForceAccount) {
                teamForm.$setPristine();
                EditTeam.save($scope.teamToSave, teamClientResource.teamResource.link.self).then(function (team) {
                    if (!team.data.entity.description) { team.data.entity.description = ''; } // EM-517: TODO: this should be fixed with a larger refactor to that angular.extend is not necessary
                    angular.extend($scope.team, team.data.entity);
                    angular.extend($scope.teamResource, team.data);
                    setTitle();
                    $scope.teamClientResource.teamResource = $scope.teamResource;
                    $scope.editMode = false;
                });
                _paq.push(['trackEvent', 'Form Action', 'Team Edit', 'Save']);
            } else {
                $scope.showError();
                // Loop through the form's validation errors and log to Piwik
                var formErrors = $scope.teamForm.$error;
                for (var errorType in formErrors) {
                    if (formErrors.hasOwnProperty(errorType)) {
                        for (var i = 0; i < formErrors[errorType].length; i++) {
                            _paq.push(['trackEvent', 'Validation Error', 'Team Edit', formErrors[errorType][i].$name+' '+errorType]);
                        }
                    }
                }
            }
        };


    })
;
