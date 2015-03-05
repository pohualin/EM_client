'use strict';

angular.module('emmiManager')
    .controller('AdminTagsCtrl', function ($scope, $translate, $locale, tmhDynamicLocale, focus, Tag, $q) {

        /**
         * Loads existing reference data for groups and tags
         */
        $scope.loadExisting = function () {
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
        };

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
        $scope.cancelEditMode = function (tagGroup, restore) {
            if (restore) {
                angular.extend(tagGroup, tagGroup.original);
            }
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
        $scope.update = function (tagGroup, groupIndex) {
            Tag.updateReferenceGroup(tagGroup).then(function (editedGroup) {
                $scope.cancelEditMode(tagGroup, false);
            });
        };

        /**
         * Called when the save button is clicked on a new tag group
         *
         * @param tagGroup to be saved
         */
        $scope.saveNewGroup = function (tagGroup) {
            tagGroup.tags = $scope.newTagGroupTags;
            Tag.createReferenceGroup(tagGroup).then(function (newGroup) {
                delete $scope.newTagGroup;
                delete $scope.newTagGroupTags;
                $scope.loadExisting();
            });
        };

        /**
         * Called when 'cancel' is clicked on the Add new group panel
         */
        $scope.cancelNew = function () {
            $scope.newTagGroupForm.newTagGroup.$setValidity('unique', true);
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

        // start by loading the current tag libraries
        $scope.loadExisting();

    })

    /**
     * Check for tag groups with the same name
     */
    .directive('groupTitleUnique', function(){
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: false,
            link: function(scope, ele, attrs, ctrl){
                // add a parser that will process each time the value is
                // parsed into the model when the user updates it.
                ctrl.$parsers.unshift(function(value) {
                    if (value) {
                        var newGroupTitle = value.toLowerCase().replace(/[^a-z0-9]+/g, '');
                        var found = false;
                        angular.forEach(scope.tagGroups, function(group, key){
                            var normalizedTitle = group.entity.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
                            if (newGroupTitle === normalizedTitle) {
                                found = true;
                            }
                        });
                        ctrl.$setValidity('unique', !found);
                    } else {
                        ctrl.$setValidity('unique', true);
                    }

                    return value;
                });
            }
        };
    })

;
