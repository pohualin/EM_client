'use strict';

angular.module('emmiManager')

    .controller('TeamTagsController',['$scope', '$alert', 'Client', 'TeamTag', 'Tag', '$modal',
      function ($scope, $alert, Client, TeamTag, Tag, $modal) {

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
            TeamTag.save($scope.teamClientResource.teamResource).then(function(response){
                TeamTag.loadSelectedTags($scope.teamClientResource.teamResource).then(function(response){
                    $scope.existingTags = response;
                    $scope.hideRemoveTagPopover();
                });
            });
        };

        $scope.cancelRemoveTag = function(){
            TeamTag.loadSelectedTags($scope.teamClientResource.teamResource).then(function(response){
                $scope.existingTags = response;
                $scope.hideRemoveTagPopover();
            });
        };
        
        /**
         * Show alert after a tag has been added
         */
        $scope.alertAfterTagAdded = function(){
            var existingTagIds = [];
            angular.forEach($scope.existingTags, function(tag) {
               existingTagIds.push(tag.id); 
            });
            
            angular.forEach($scope.teamClientResource.teamResource.tags, function(tag){
                if(existingTagIds.indexOf(tag.id) === -1){
                    $alert({
                        content: '<b>' + tag.name + '</b> has been added successfully.',
                        container: '#messages-container',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                    return;
                }
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
                            scope.alertAfterTagAdded();
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
