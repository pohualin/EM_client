'use strict';

angular.module('emmiManager')

    .controller('TeamTagsController', function ($scope, TeamTag, Tag) {
        Tag.loadGroups($scope.teamClientResource.clientResource).then(function (tagGroups) {
            var tagGroupToDisplay = [];
            angular.forEach(tagGroups, function (group) {
                var localGroup = angular.copy(group);
                localGroup.title = localGroup.name;
                //rebuild groups on each tag
                localGroup.tag = null;
                angular.forEach(group.tag, function (tag) {
                    tag.group = localGroup;
                    tag.text = tag.name;
                    tagGroupToDisplay.push(tag);
                });
            });
            $scope.team.tags = tagGroupToDisplay;

        });
        TeamTag.loadSelectedTags($scope.teamClientResource.teamResource);

        $scope.saveTagState = function () {
            TeamTag.save($scope.teamClientResource.teamResource);
        };
    })
;
