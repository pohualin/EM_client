'use strict';

angular.module('emmiManager')

    .directive('tagGroups', function (focus, $filter, $timeout) {

        return {
            restrict: 'EA',
            require: '^ngModel',
            scope: {
                groups: '=ngModel',
                formField: '=',
                taggingMode: '=',
                libraryGroups: '='
            },
            replace: false,
            transclude: false,
            templateUrl: 'partials/common/directives/tags-input/tag-groups.tpl.html',
            controller: ['$scope','$attrs','$element', function ($scope, $attrs, $element) {
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
                };

                $scope.newTagGroup = function (){
                    var me = this;
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
                                tags: []
                            };
                            $scope.groups.push(tagGroup);
                            $scope.$broadcast('tag:add', tagGroup);
                        }
                        return true;
                    }, 100);
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
                };

                $scope.changeTagGroupTitle = function (groupIndex) {
                    $scope.validateForDuplicates();
                    // Title already gets changed from data binding, so really just need to hide the edit form
                    $scope.groups[groupIndex].editMode = false;
                    $scope.selectedTagGroupIndex = -1;
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
                    var tags = event.originalEvent.clipboardData.getData('text/plain').split(' ');
                    for (var i = 0, numTags = tags.length; i < numTags; i++) {
                        var tag = {};
                        tag.text = tags[i];
                        if (tag.text.length > 0 && !$scope.tagExists(tag, groupIndex)) {
                            $scope.groups[groupIndex].tags.push(tag);
                        }
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
                    if ($scope.groups) {
                        for (var l = 0; l < $scope.groups.length; l++) {
                            if ($scope.groups[l].tags.length === 0) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                $scope.getDupes = function () {
                    var unique = {};
                    var dupes = [];
                    angular.forEach($scope.groups, function (x, i) {
                        if (!unique[x.title]) {
                            unique[x.title] = true;
                        } else {
                            dupes.push(i);
                        }
                    });
                    return dupes;
                };

                $scope.validateForDuplicates = function () {
                    var dupeIndices = $scope.getDupes();
                    $scope.formField.$setValidity('unique', !dupeIndices.length);
                    angular.forEach($scope.groups, function (x, i) {
                        if (dupeIndices.indexOf(i) >= 0) {
                            $scope.groups[i].isValid = false;
                        } else {
                            $scope.groups[i].isValid = true;
                        }
                    });
                };

                $scope.linkToLibrary = function (){
                    return function (tagGroup) {
                        tagGroup.isInLibrary = $scope.libraryGroups && $scope.libraryGroups[tagGroup.title] ? true : false;
                        return tagGroup;
                    };
                };

            }],
            link: function(scope, element, attrs, ngModelCtrl) {

                // watch for removed tags and re-check for uniqueness
                scope.$watch('groups.length', function (newVal, oldVal) {
                    // tag added or removed
                    $timeout(function () {
                        scope.validateForDuplicates();
                        scope.formField.$setValidity('empty', !scope.hasEmpties());
                    });
                });

                scope.$on('tag:add', function (event, tagGroup) {
                    $timeout(function () {
                        var btnGroup = element.find('.btn-group').last();
                        btnGroup.find('.dropdown-toggle').trigger('click.bs.dropdown');
                        btnGroup.find('.tags-input .input').focus();
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
                    });
                });

            }
        };

    })

    .directive('tagGroupsItem', function($timeout) {
        return {
            require: '^tagGroups',
            link: function(scope, element, attrs, ngModelCtrl) {

                // when number of tags within a group changes
                scope.$watch('groups[$index].tags.length', function() {
                    // check for empty tags
                    $timeout(function() {
                        scope.formField.$setValidity('empty', !scope.hasEmpties()); // shared scope with parent controller (scope.$parent)
                    });
                });

            }
        };
    })

;
