/* global angular, console */
'use strict';

angular.module('emmiManager')

/**
 * This controls the Tags panel when viewing a team.
 */
    .controller('TeamTagsController', ['$scope', '$alert', 'Client', 'TeamTag', 'Tag', '$modal', '$popover', '$q', 'arrays',
        function ($scope, $alert, Client, TeamTag, Tag, $modal, $popover, $q, arrays) {

            var loadAllOptions = Tag.loadGroups($scope.teamClientResource.clientResource).then(function (tagGroups) {
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
                return tagGroupToDisplay; // must return something to not break the promise chain
            });

            var loadCurrentlySelected = TeamTag.loadSelectedTags($scope.teamClientResource.teamResource)
                .then(function (tags) {
                    $scope.teamClientResource.teamResource.tags = tags;
                    $scope.teamClientResource.checkTagsForChanges = tags;
                    return tags; // must return something to not break the promise chain
                });

            // make sure we've loaded everything before 'enabling' the dropdown
            $q.all([loadAllOptions, loadCurrentlySelected]).then(function (results) {
                $scope.team.tags = results[0];
                $scope.existingTags = results[1];

                // watch for changes to existing tags, if more are added post an alert
                $scope.$watch('existingTags', function (current, old) {
                    if (current && old && current.length > old.length) {
                        var existingTags = arrays.convertToObject('id', 'name', old);
                        angular.forEach(current, function (currentTag) {
                            if (!existingTags[currentTag.id]) {
                                $alert({
                                    content: '<b>' + currentTag.name + '</b> has been added successfully.',
                                    container: '#messages-container',
                                    type: 'success',
                                    placement: 'top',
                                    show: true,
                                    duration: 5,
                                    dismissable: true
                                });
                            }
                        });
                    }
                });
            });

            /**
             * This is called by the emmi.chosen plugin just before
             * a remove happens.
             *
             * @param element trying to be removed
             * @param performDelete callback to actually delete the element
             */
            $scope.chosenBeforeRemoveHook = function (element, performDelete) {
                $scope.performTagRemove = function () {
                    performDelete();
                };
                $popover(element, {
                    title: 'Are you sure?',
                    container: 'body',
                    scope: $scope,
                    show: true,
                    autoClose: true,
                    placement: 'top',
                    trigger: 'manual',
                    contentTemplate: 'admin-facing/partials/team/tags/remove_tag_popover.tpl.html'
                });
            };

            /**
             * Called when collection changes
             */
            $scope.saveTagState = function () {

                TeamTag.save($scope.teamClientResource.teamResource).then(function (savedTags) {
                    $scope.existingTags = savedTags;
                    $scope.fireUpdatedEvent();
                });
            };

            var showClientTagsModal = $modal({
                scope: $scope,
                template: 'admin-facing/partials/team/tags/client_tags_modal.html',
                animation: 'none',
                backdropAnimation: 'emmi-fade',
                show: false,
                backdrop: 'static'
            });
            $scope.client = $scope.teamClientResource.clientResource.entity;
            Client.setClient($scope.teamClientResource.clientResource);

            $scope.showClientTags = function () {
                showClientTagsModal.$promise.then(showClientTagsModal.show);
            };
            $scope.hideClientTags = function () {
                showClientTagsModal.hide();
            };
        }])

;
