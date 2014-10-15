'use strict';

angular.module('emmiManager')
    .controller('TeamTagsViewController', function ($scope, TeamTag) {
        TeamTag.loadSelectedTags($scope).then(function (tagGroups) {
            $scope.tags = tagGroups;
        });
    });