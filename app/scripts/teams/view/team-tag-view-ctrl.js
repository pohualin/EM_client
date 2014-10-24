'use strict';

angular.module('emmiManager')
    .controller('TeamTagsViewController', function ($scope, TeamTag) {
        TeamTag.loadSelectedTags($scope.teamClientResource.teamResource).then(function (tagGroups) {
            $scope.tags = tagGroups;
        });
    });