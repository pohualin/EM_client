'use strict';

angular.module('emmiManager')
    .controller('AdminTagsCtrl', ['$scope', 'focus', 'Tag', 'AdminManageGroupService',
        function ($scope, focus, Tag, AdminManageGroupService) {

            /**
             * Loads existing reference data for groups and tags
             */
            $scope.loadExisting = function () {
                // load the groups for this client as well as the tag libraries
                Tag.loadReferenceData().then(function (response) {
                    var tagLibraries = response;

                    angular.forEach(tagLibraries, function (group) {
                        Tag.loadReferenceTags(group).then(function (response) {
                            group.tags = response;
                        });
                        AdminManageGroupService.setDeleteFlag(group);
                    });

                    $scope.tagGroups = tagLibraries;
                });
            };

            /**
             * Puts a group into a mode where the group name is editable
             * @param tagGroup to be put in edit name mode
             */
            $scope.startEditMode = function (tagGroup, forceOpen) {
                if (forceOpen) {
                    tagGroup.activePanel = 0;
                }
                tagGroup.editMode = true;
                tagGroup.original = angular.copy(tagGroup);
                if (tagGroup.watcher) {
                    tagGroup.watcher();
                }
                tagGroup.watcher = $scope.$watch(
                    function () {
                        return [tagGroup.title, tagGroup.tags];
                    },
                    function () {
                        if (tagGroup.title !== tagGroup.original.title || !angular.equals(tagGroup.tags, tagGroup.original.tags, true)) {
                            tagGroup.changed = true;
                        } else {
                            tagGroup.changed = false;
                        }
                    },
                    true);
                focus('focus-' + tagGroup.entity.id);
            };

            /**
             * Happens when the warning popover is opened or closed
             *
             * @param group being warned about
             * @param open true means warning is open
             */
            $scope.warningToggle = function (group, open) {
                group.warningOpen = open;
                if (group.original) {
                    // this solves the click remove, expand to edit, click no on remove, cancel flow
                    group.original.warningOpen = open;
                }
            };

            /**
             * When the 'ok' is clicked inside the delete warning popover
             *
             * @param group to remove
             */
            $scope.remove = function (group) {
                AdminManageGroupService.remove(group).then(function () {
                    $scope.loadExisting();
                });
            };

            /**
             * Called when 'cancel' is clicked on an existing panel
             *
             * @param tagGroup to be canceled
             * @param restore to put the original back
             */
            $scope.cancelEditMode = function (tagGroup, restore, form) {
                if (restore) {
                    angular.extend(tagGroup, tagGroup.original);
                }
                tagGroup.activePanel = 1;
                tagGroup.editMode = false;
                if (tagGroup.watcher) {
                    tagGroup.watcher();
                }
                form.$setPristine(true);
                delete tagGroup.original;
                delete tagGroup.watcher;
            };

            /**
             * Called when a client role resource 'save' button is clicked for
             * an existing role
             *
             * @param tagGroup to be updated
             */
            $scope.update = function (tagGroup, index, form) {
                form.$setPristine();
                Tag.updateReferenceGroup(tagGroup).then(function (editedGroup) {
                    angular.extend(tagGroup, editedGroup);
                    $scope.cancelEditMode(tagGroup, false);
                });
            };

            /**
             * Called when the save button is clicked on a new tag group
             *
             * @param tagGroup to be saved
             */
            $scope.saveNewGroup = function (tagGroup, form) {
                tagGroup.tags = $scope.newTagGroupTags;
                Tag.createReferenceGroup(tagGroup).then(function () {
                    delete $scope.newTagGroup;
                    delete $scope.newTagGroupTags;
                    $scope.loadExisting();
                    form.$setPristine();
                });
            };

            /**
             * Called when 'cancel' is clicked on the Add new group panel
             */
            $scope.cancelNew = function (form) {
                $scope.newTagGroupForm.newTagGroup.$setValidity('unique', true);
                form.$setPristine(true);
                delete $scope.newTagGroup;
                delete $scope.newTagGroupTags;
            };

            /**
             * Called when 'Add new group' is clicked
             */
            $scope.createNewTagGroup = function () {
                $scope.newTagGroup = {};
                $scope.newTagGroupTags = [];
                focus('focus-new-group');
            };

            /**
             * Toggle between active/inactive for a group that is not tied to any team.
             */
            $scope.toggleActiveInactive = function(tagGroup){
                tagGroup.entity.active = tagGroup.entity.active ? false : true;
                Tag.updateReferenceGroup(tagGroup).then(function (editedGroup) {
                    angular.extend(tagGroup, editedGroup);
                    $scope.cancelEditMode(tagGroup, false);
                });
            };

            // start by loading the current tag libraries
            $scope.loadExisting();

        }])

;
