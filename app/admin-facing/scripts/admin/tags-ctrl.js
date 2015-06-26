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
            $scope.startEditName = function (tagGroup) {
                tagGroup.activePanel = 0;
                tagGroup.editName = true;
                focus('focus-' + tagGroup.entity.id);
            };

            /**
             * When a group panel is opened or closed. Copy the original
             * resource into an .original property and setup a watcher.
             *
             * @param clientTeamRoleResource for the panel
             * @param form for unsaved changes
             */
            $scope.panelStateChange = function (tagGroup, form) {
                if (tagGroup.activePanel === 0 && !tagGroup.original) {
                    // copy the original and setup a watcher
                    tagGroup.original = angular.copy(tagGroup);
                    // unbind the watcher
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
                } else {
                    // Set the form back to pristine after initialization
                    form.$setPristine();
                }
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
                $scope.whenSaving = true;
                AdminManageGroupService.remove(group).then(function () {
                    $scope.loadExisting();
                }).finally(function () {
                    $scope.whenSaving = false;
                });
            };

            /**
             * Called when 'cancel' is clicked on an existing panel
             *
             * @param tagGroup to be canceled
             * @param restore to put the original back
             * @param form the form
             */
            $scope.cancelEditMode = function (tagGroup, restore, form) {
                tagGroup.activePanel = -1;
                tagGroup.editName = false;
                if (restore) {
                    angular.extend(tagGroup, tagGroup.original);
                }
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
             * @param form the form
             */
            $scope.update = function (tagGroup, form) {
                form.$setPristine();
                $scope.whenSaving = true;
                Tag.updateReferenceGroup(tagGroup).then(function (editedGroup) {
                    $scope.cancelEditMode(tagGroup, false, form);
                    angular.extend(tagGroup, editedGroup);
                }).finally(function () {
                    $scope.whenSaving = false;
                });
            };

            /**
             * Called when the save button is clicked on a new tag group
             *
             * @param tagGroup to be saved
             * @param form the form
             */
            $scope.saveNewGroup = function (tagGroup, form) {
                tagGroup.tags = $scope.newTagGroupTags;
                $scope.whenSaving = true;
                Tag.createReferenceGroup(tagGroup).then(function () {
                    delete $scope.newTagGroup;
                    delete $scope.newTagGroupTags;
                    $scope.loadExisting();
                    form.$setPristine();
                }).finally(function () {
                    $scope.whenSaving = false;
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
            $scope.toggleActiveInactive = function(tagGroup, form){
                tagGroup.entity.active = tagGroup.entity.active ? false : true;
                $scope.whenSaving = true;
                Tag.updateReferenceGroup(tagGroup).then(function (editedGroup) {
                    $scope.cancelEditMode(tagGroup, false, form);
                    angular.extend(tagGroup, editedGroup);
                }).finally(function () {
                    $scope.whenSaving = false;
                });
            };

            // start by loading the current tag libraries
            $scope.loadExisting();

        }])
    .filter('tagGroupOrderBy', function () {
        function alphaSort (a, b) {
            return a.title.localeCompare(b.title);
        }
        return function (arr) {
            var active = [];
            var inactive = [];
            angular.forEach(arr, function (item) {
                if (!item.deletable && !item.entity.active) {
                    inactive.push(item);
                } else {
                    active.push(item);
                }
            });
            active.sort(alphaSort);
            inactive.sort(alphaSort);
            return active.concat(inactive);
        };
    })
;
