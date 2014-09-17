'use strict';

angular.module('emmiManager')

    .directive('tagGroups', function (focus, $filter) {

        return {
            restrict: 'EA',
            require: '^ngModel',
            scope: {
                groups: '=ngModel',
                formField: '='
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
                    var tagGroup = {
                        title: this.newTagGroupTitle,
                        tags: []
                    };
                    var dup = $scope.tagGroupExists(this.newTagGroupTitle);
                    $scope.formField.$setValidity('unique', !dup);
                    $scope.groups.push(tagGroup);
                    $scope.createMode = false;
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
                };

                $scope.changeTagGroupTitle = function (groupIndex) {
                    var dup = $scope.tagGroupExists($scope.groups[groupIndex].title, groupIndex); // Ignore the edited group's index
                    $scope.formField.$setValidity('unique', !dup);
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

            }],
            link: function(scope, element, attrs, ngModelCtrl) {


            }
        };

    })
;
