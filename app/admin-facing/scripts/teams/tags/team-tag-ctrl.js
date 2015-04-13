'use strict';

angular.module('emmiManager')

    .controller('TeamTagsController',['$scope', 'Client', 'TeamTag', 'Tag', '$modal',
      function ($scope, Client, TeamTag, Tag, $modal) {

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

        TeamTag.loadSelectedTags($scope.teamClientResource.teamResource).then(function(response){
            $scope.existingTags = response;
        });

        $scope.saveTagState = function () {
            TeamTag.save($scope.teamClientResource.teamResource);
            $scope.hideRemoveTagPopover();
        };

        $scope.cancelRemoveTag = function(){
            $scope.hideRemoveTagPopover();
            TeamTag.loadSelectedTags($scope.teamClientResource.teamResource).then(function(response){
                $scope.existingTags = response;
            });
        };

        $scope.hideRemoveTagPopover = function () {
            if($scope.removeTagWarning){
                $scope.removeTagWarning.hide();
            }
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
    }])
    .directive('removeTagPopover', ['$popover', 'TeamTag', function ($popover, TeamTag) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                element.on('change', function (event) {

                    event.stopPropagation();
                    TeamTag.isExistingTagRemoved(scope.existingTags, scope.teamClientResource.teamResource.tags)
                        .then(function(response){
                        if(!response){
                            scope.saveTagState();
                            return;
                        }

                        // pop a warning dialog
                        if (!scope.removeTagWarning) {
                            scope.removeTagWarning = $popover(element.parent(), {
                                title: 'Are you sure?',
                                scope: scope,
                                show: true,
                                autoClose: false,
                                placement: 'bottom',
                                trigger: 'manual',
                                contentTemplate: 'admin-facing/partials/team/tags/remove_tag_popover.tpl.html'
                            });
                        } else {
                            scope.removeTagWarning.show();
                        }
                    });


                });
            }
        };
    }])
;
