'use strict';

angular.module('emmiManager')
    .controller('AdminTagsCtrl', function ($scope, $translate, $locale, tmhDynamicLocale, focus, Tag, $q) {

        // load the groups for this client as well as the tag libraries
        Tag.loadReferenceData().then(function (response) {
            var tagLibraries = response;

            angular.forEach(tagLibraries, function(group){
                Tag.loadReferenceTags(group).then( function (response) {
                    group.tags = response;
                });
            });

            $scope.tagGroups = tagLibraries;
        });

        /**
         * Puts a group into a mode where the group name is editable
         * @param tagGroup to be put in edit name mode
         */
        $scope.startEditMode = function (tagGroup) {
            tagGroup.editMode = true;
            tagGroup.original = angular.copy(tagGroup);
            tagGroup.watcher = $scope.$watch(function() { return [tagGroup.title, tagGroup.tags]; }, function(newValue, oldValue) {
                if (tagGroup.title !== tagGroup.original.title || !angular.equals(tagGroup.tags, tagGroup.original.tags, true)) {
                    tagGroup.changed = true;
                } else {
                    tagGroup.changed = false;
                }
            }, true);
            focus('focus-' + tagGroup.entity.id);
        };

        /**
         * Called when 'cancel' is clicked on an existing panel
         *
         * @param tagGroup
         */
        $scope.cancelEditMode = function (tagGroup) {
            angular.extend(tagGroup, tagGroup.original);
            tagGroup.editMode = false;
            tagGroup.watcher();
            delete tagGroup.original;
            delete tagGroup.watcher;
        };

        /**
         * Called when a client role resource 'save' button is clicked for
         * an existing role
         *
         * @param tagGroup to be updated
         */
        $scope.update = function (tagGroup) {
            Tag.updateReferenceGroup(tagGroup);
        };

        /**
         * Called when the save button is clicked on a new tag group
         *
         * @param clientTeamRoleEntity to be saved
         */
        $scope.saveNewGroup = function (tagGroup) {
            tagGroup.tags = $scope.newTagGroupTags;
            Tag.createReferenceGroup(tagGroup).then(function () {
                delete $scope.newTagGroup;
                //$scope.loadExisting();
            });
        };

        /**
         * Called when 'cancel' is clicked on the create new tag group panel
         */
        $scope.cancelNew = function () {
            delete $scope.newTagGroup;
            delete $scope.newTagGroupTags;
        };

        /**
         * Called when 'create new tag group' is clicked
         */
        $scope.createNewTagGroup = function () {
            //$scope.newTagGroup = ManageUserTeamRolesService.newClientTeamRoleEntity();
            $scope.newTagGroup = {};
            focus('focus-new-group');
        };

    })
;
