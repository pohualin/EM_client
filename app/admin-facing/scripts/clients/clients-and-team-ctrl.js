'use strict';

angular.module('emmiManager')

/**
 *  Edit a single client
 */
    .controller('ClientAndTeamCtrl', function ($scope, $route, $routeParams, $controller, clientResource, ViewTeam) {

        // Function to retrieve and initialize team-related code
        function setupTeam() {
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
        }

        // Listen for changes to the Route. When the route
        // changes, load the relative controller
        $scope.$on(
            '$routeUpdate',
            function ($currentRoute, $previousRoute) {
                if ($routeParams.team) {
                    $scope.showTeam = 'loading';
                    setupTeam();
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
