'use strict';

angular.module('emmiManager')

    .directive('tagGroups', function (focus, $filter, $timeout) {

        return {
            restrict: 'EA',
            require: '^ngModel',
            scope: {
                groups: '=ngModel',
                formField: '=',
                libraryGroups: '='
            },
            replace: false,
            transclude: false,
            templateUrl: 'partials/common/directives/tags-input/tag-groups.tpl.html',
            controller: ['$scope','$attrs','$element', function($scope, $attrs, $element) {
                $scope.createMode = false;
                $scope.selectedTagGroupIndex = -1;

                $scope.enterCreateMode = function (){
                    $scope.createMode = true;
                    this.newTagGroupTitle = '';
                    focus('createMode');
                };

                $scope.exitCreateMode = function (){
                    $scope.createMode = false;
                };

                $scope.newTagGroup = function (){
                    if (this.newTagGroupTitle && this.newTagGroupTitle.length !== 0) {
                        var tagGroup = {
                            title: this.newTagGroupTitle,
                            tags: []
                        };
                        // this method gets called twice for some reason
                        // don't add the same new group twice
                        delete this.newTagGroupTitle;
                        $scope.groups.push(tagGroup);
                        $scope.createMode = false;
                        $scope.$broadcast('tag:add', tagGroup);
                    }
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
                    for (var j = 0; j < $scope.groups[groupIndex].tags.length; j++) {
                        if ($scope.groups[groupIndex].tags[j].text === tag.text) {
                            return true;
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
                    for (var k = 0; k < $scope.groups.length; k++) {
                        if ($scope.groups[k].title === title && ignoreIndex !== k) {
                            return true;
                        }
                    }
                    return false;
                };

                $scope.hasEmpties = function () {
                    for (var l = 0; l < $scope.groups.length; l++) {
                        if ($scope.groups[l].tags.length === 0) {
                            return true;
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

                $scope.linkToLibrary = function(){
                    return function(tagGroup) {
                        tagGroup.isInLibrary = $scope.libraryGroups && $scope.libraryGroups[tagGroup.title] ? true : false;
                        return tagGroup;
                    };
                };

            }],
            link: function(scope, element, attrs, ngModelCtrl) {

                // watch for removed tags and re-check for uniqueness
                scope.$watch('groups.length', function(newVal, oldVal) {
                    // tag added or removed
                    scope.validateForDuplicates();
                });

                scope.$on('tag:add', function(event, tagGroup) {
                    $timeout(function() {
                        var btnGroup = element.find('.btn-group').last();
                        btnGroup.find('.dropdown-toggle').trigger('click.bs.dropdown');
                        btnGroup.find('.tags-input .input').focus();
                    });
                });

            }
        };

    })

    .directive('tagGroupsItem', function() {
        return {
            require: '^tagGroups',
            link: function(scope, element, attrs, ngModelCtrl) {

                // when number of tags within a group changes
                scope.$watch('groups[$index].tags.length', function() {
                    // check for empty tags
                    scope.formField.$setValidity('empty', !scope.hasEmpties()); // shared scope with parent controller (scope.$parent)
                });

                // when number of groups changes
                scope.$watch('groups.length', function() {
                    // check for empty tags
                    scope.formField.$setValidity('empty', !scope.hasEmpties());
                });


            }
        };
    })

;
