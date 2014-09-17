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

                $scope.tagGroupCheck = function () {
                    var unique = {};
                    var distinct = [];
                    $scope.groups.forEach(function (x) {
                      if (!unique[x.title]) {
                        distinct.push(x.title);
                        unique[x.title] = true;
                      }
                    });
                    if (distinct.length !== $scope.groups.length) {
                        return true;
                    } else {
                        return false;
                    }
                };

            }],
            link: function(scope, element, attrs, ngModelCtrl) {

                scope.$watch('groups', function(value) {
                    ngModelCtrl.$setValidity('unique', !scope.tagGroupCheck());
                }, true);

            }
        };

    })
;
