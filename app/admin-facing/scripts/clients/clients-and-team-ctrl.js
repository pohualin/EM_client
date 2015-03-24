'use strict';

angular.module('emmiManager')

/**
 *  Combined view for client and teams
 */
    .controller('ClientAndTeamCtrl', function ($scope, $rootScope, $route, $routeParams, $controller, clientResource, ViewTeam) {

        $scope.currentTeam = null;

        // Function to retrieve and initialize team-related code
        function setupTeam() {
            $scope.currentTeam = $routeParams.team;
            ViewTeam.selectTeam(clientResource.link.teamByTeamId, $routeParams.team).then(function (teamResource) {
                if (teamResource) {
                    $scope.showTeam = 'yes';
                    var teamClientResource = {};
                    teamClientResource.clientResource = clientResource;
                    teamClientResource.teamResource = teamResource;
                    $controller('TeamEditController', {$scope: $scope, teamClientResource: teamClientResource});
                } else {
                    console.log('No such team found!');
                }
            });
        }

        // Initialize Client-related code
        $scope.showTeam = 'no';
        $controller('ClientDetailCtrl', {$scope: $scope, clientResource: clientResource});

        if ($routeParams.team) {
            setupTeam();
            // If the team is included in the $routeParams, filter it out so that subsequent routing on the page doesn't get messed up
            $scope.currentRouteQueryString = $rootScope.currentRouteQueryString.replace(/(&team=)\w+/, '');
        }

        // Listen for changes to the Route. When the route
        // changes, load the relative controller
        $scope.$on(
            '$routeUpdate',
            function (event, $next) {
                if ($routeParams.team) {
                    // Make sure the team hasn't changed so it doesn't 'reload'
                    if ($routeParams.team !== $scope.currentTeam) {
                        $scope.showTeam = 'loading';
                        setupTeam();
                        // If the team is included in the $routeParams, filter it out so that subsequent routing on the page doesn't get messed up
                        $scope.currentRouteQueryString = $rootScope.currentRouteQueryString.replace(/(&team=)\w+/, '');
                    }
                } else {
                    $scope.showTeam = 'no';
                    // Reset page title
                    $scope.page.setTitle('Client ' + clientResource.entity.id + ' - ' + clientResource.entity.name);
                    // Reset team scope variables
                    $scope.teamClientResource = null;
                    $scope.teamResource = null;
                    $scope.team = null;
                }
            }
        );

    })
;