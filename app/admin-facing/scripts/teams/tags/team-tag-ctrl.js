'use strict';

angular.module('emmiManager')

    .controller('TeamTagsController', function ($scope, Client, TeamTag, Tag, $modal) {
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

        var showClientTagsModal = $modal({scope: $scope, template: 'admin-facing/partials/team/tags/client_tags_modal.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, placement: 'center', backdrop: 'static'});
        $scope.client = $scope.teamClientResource.clientResource.entity;
        Client.setClient($scope.teamClientResource.clientResource);

        $scope.showClientTags = function () {
            showClientTagsModal.$promise.then(showClientTagsModal.show);
        };
        $scope.hideClientTags = function () {
            showClientTagsModal.hide();
        };
    })
;
