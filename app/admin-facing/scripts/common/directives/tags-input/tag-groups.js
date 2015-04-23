'use strict';

angular.module('emmiManager')

    .directive('tagGroups', function (focus, $filter, $timeout) {

        return {
            restrict: 'EA',
            require: '^ngModel',
            scope: {
                groups: '=ngModel',
                onChange: '=ngChange',
                formField: '=',
                taggingMode: '=',
                libraryGroups: '='
            },
            replace: false,
            transclude: false,
            templateUrl: 'admin-facing/partials/common/directives/tags-input/tag-groups.tpl.html',
            controller: ['$scope', function ($scope) {
                $scope.createMode = false;
                $scope.selectedTagGroupIndex = -1;
                $scope.groups = $scope.groups || [];

                $scope.enterCreateMode = function (){
                    $scope.createMode = true;
                    this.newTagGroupTitle = '';
                    focus('createMode');
                };

                $scope.exitCreateMode = function (){
                    $scope.createMode = false;
                    $scope.taggingMode = false;
                };

                $scope.newTagGroup = function (){
                    var me = this;
                    $scope.taggingMode = true; // Need to trigger tagging mode here instead of bs.dropdown because of $timeouts to prevent flicker of show/hide elements
                    $timeout(function () {
                        // will be executed after ngClick function in case of click
                        if (!$scope.createMode) {
                            // if the create mode is already exited, don't do anything
                            return;
                        }
                        if (me.newTagGroupTitle && me.newTagGroupTitle.length !== 0) {
                            $scope.createMode = false; //
                            var tagGroup = {
                                title: me.newTagGroupTitle,
                                isValid: true,
                                brandNew: true,
                                tags: []
                            };
                            $scope.groups.push(tagGroup);
                            $scope.onChange('add group');
                            $scope.$broadcast('tag:add', tagGroup);
                        }
                        return true;
                    }, 500);
                };

                $scope.selectTagGroup = function (groupIndex) {
                    if ($scope.selectedTagGroupIndex === groupIndex) {
                        $scope.groups[groupIndex].editMode = true;
                        //$scope.selectedTagGroupIndex = -1;
                        focus('editMode');
                    } else {
                        $scope.selectedTagGroupIndex = groupIndex;
                    }
                };

                $scope.removeTagGroup = function (groupIndex) {
                    $scope.groups.splice(groupIndex, 1);
                    $scope.selectedTagGroupIndex = -1;
                    $scope.taggingMode = false;
                    angular.forEach($scope.groups, function (group) {
                        // removing any group means none are 'new' anymore
                        group.brandNew = false;
                    });
                    $scope.onChange('remove group');
                };

                $scope.changeTagGroupTitle = function (groupIndex) {
                    $scope.formField.$setValidity('empty', !$scope.hasEmpties());

                    // Title already gets changed from data binding, so really just need to hide the edit form
                    $scope.groups[groupIndex].editMode = false;
                    $scope.selectedTagGroupIndex = -1;
                    $scope.onChange('change group title');
                };

                $scope.tagExists = function (tag, groupIndex) {
                    if ( $scope.groups) {
                        for (var j = 0; j < $scope.groups[groupIndex].tags.length; j++) {
                            if ($scope.groups[groupIndex].tags[j].text === tag.text) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                $scope.pasteTags = function (event, groupIndex) {
                    event.preventDefault();
                    var tags, createdTags;
                    if (event.originalEvent.clipboardData) {
                        tags = event.originalEvent.clipboardData.getData('text/plain').split('\n');
                    } else if (window.clipboardData) {
                        // IE event is attached to the window object and accepts different data type options
                        tags = window.clipboardData.getData('Text').split('\n');
                    } else {
                        tags = [];
                    }
                    for (var i = 0, numTags = tags.length; i < numTags; i++) {
                        var tag = {};
                        tag.text = tags[i];
                        if (tag.text.length > 0 && !$scope.tagExists(tag, groupIndex)) {
                            $scope.groups[groupIndex].tags.push(tag);
                            createdTags = true;
                        }
                    }
                    if (createdTags){
                        $scope.onChange('pasted tags');
                    }
                };

                $scope.tagGroupExists = function (title, ignoreIndex) {
                    if ($scope.groups) {
                        for (var k = 0; k < $scope.groups.length; k++) {
                            if ($scope.groups[k].title === title && ignoreIndex !== k) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                $scope.hasEmpties = function () {
                    $scope.validateGroupTitles();
                    var ret = false;
                    if ($scope.groups) {
                        for (var l = 0; l < $scope.groups.length; l++) {
                            var tagGroup = $scope.groups[l];
                            if (tagGroup.tags.length === 0 && !tagGroup.brandNew) {
                                tagGroup.isValid = false;
                                tagGroup.invalidDueToEmpty = true;
                                if (!tagGroup.isValidMessage) {
                                    tagGroup.isValidMessage = 'Tag groups must contain at least one tag';
                                }
                                ret = true;
                            } else {
                                tagGroup.invalidDueToEmpty = false;
                            }
                        }
                    }
                    return ret;
                };

                $scope.getDupes = function () {
                    var unique = {};
                    var dupes = [];
                    angular.forEach($scope.groups, function (x, i) {
                        if (x.title) {
                            var groupTitle = x.title.toLowerCase().replace(/[^a-z0-9]+/g, '');
                            if (!unique[groupTitle]) {
                                unique[groupTitle] = true;
                            } else {
                                dupes.push(i);
                            }
                        }
                    });
                    return dupes;
                };

                $scope.validateGroupTitles = function () {
                    var dupeIndices = $scope.getDupes();
                    var blankIndices = [];
                    $scope.formField.$setValidity('unique', !dupeIndices.length);
                    angular.forEach($scope.groups, function (x, i) {
                        if (dupeIndices.indexOf(i) >= 0) {
                            $scope.groups[i].isValid = false;
                            $scope.groups[i].invalidDueToDuplicate = true;
                            $scope.groups[i].isValidMessage = 'This tag group already exists';
                        } else if (!x.title || x.title.length === 0) {
                            blankIndices.push(i);
                            $scope.groups[i].isValid = false;
                            $scope.groups[i].invalidDueToBlankTitle = true;
                            $scope.groups[i].isValidMessage = 'Group titles cannot be blank';
                        } else {
                            $scope.groups[i].isValid = true;
                            delete $scope.groups[i].isValidMessage;
                            $scope.groups[i].invalidDueToBlankTitle = false;
                            $scope.groups[i].invalidDueToDuplicate = false;
                        }
                    });
                    $scope.formField.$setValidity('blankTitle', !blankIndices.length);
                };

            }],
            link: function (scope, element) {

                var addBtn = element.find('.btn-add-group'),
                    origAddBtnText = addBtn.text();

                // watch for removed tags and re-check for uniqueness
                scope.$watchCollection('groups', function (newVal) {
                    // tag added or removed
                    scope.formField.$setValidity('empty', !scope.hasEmpties());
                    if (newVal && newVal.length === 0) {
                        addBtn.text(origAddBtnText);
                    } else {
                        addBtn.text(addBtn.data('swapText'));
                    }
                });

                scope.$on('tag:add', function (event, tagGroup) {
                    $timeout(function () {
                        if (tagGroup.isValid ||
                            (tagGroup.invalidDueToEmpty && !tagGroup.invalidDueToDuplicate)) {
                            var btnGroup = element.find('.btn-group').last();
                            btnGroup.find('.dropdown-toggle').trigger('click.bs.dropdown');
                            btnGroup.find('.tags-input .input').focus();
                            tagGroup.brandNew = false;
                        }
                    });
                });

                element.on('show.bs.dropdown', function () {
                    scope.$apply(function () {
                        scope.taggingMode = true;
                    });
                });

                element.on('hide.bs.dropdown', function () {
                    scope.$apply(function () {
                        scope.taggingMode = false;
                        scope.formField.$setValidity('empty', !scope.hasEmpties());
                    });
                });

            }
        };

    })

    .directive('tagGroupsItem', function($timeout) {
        return {
            link: function(scope, element) {

                // when number of tags within a group changes
                scope.$watchCollection('groups[$index].tags', function(newVal, oldVal) {
                    // check for empty tags only when the number of tags has changed for the group
                    if (newVal && oldVal && newVal.length !== oldVal.length) {
                        $timeout(function () {
                            scope.formField.$setValidity('empty', !scope.hasEmpties()); // shared scope with parent controller (scope.$parent)
                        });
                    }
                });

                // Custom positioning of dropdown menu when opening
                element.on('show.bs.dropdown', function () {
                    var tagGroupContainer = element.parent();
                    var tagGroupDropdown = element.find('.dropdown-menu');
                    var paddingOffset = tagGroupContainer.innerWidth() - tagGroupContainer.width();
                    tagGroupDropdown.css({
                        width: tagGroupContainer.width(),
                        left: (element.position().left*-1)+(paddingOffset/2)
                    });
                    var positionRelativeSizing = tagGroupContainer.height() + tagGroupDropdown.outerHeight();
                    tagGroupContainer.height(positionRelativeSizing);
                });
                element.on('hide.bs.dropdown', function () {
                    var tagGroupContainer = element.parent();
                    tagGroupContainer.height('auto');
                });

            }
        };
    })

;
