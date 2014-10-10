'use strict';

angular.module('emmiManager')

    .controller('TeamTagsController', function ($scope, TeamTag, Client) {
        TeamTag.loadTags(Client.getClient()).then(function (tagGroups) {
            $scope.team.tags = tagGroups;
        });
        TeamTag.loadSelectedTags($scope.teamClientResource.teamResource);
    })
;
