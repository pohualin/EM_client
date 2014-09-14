'use strict';

angular.module('emmiManager')

/**
 *   Controls the tag group section
 */
    .controller('ClientTagsController', function ($scope, focus, $filter, Tag, Client) {

        $scope.noSearch = true;
        $scope.createMode = false;
        $scope.client.tagGroups = [];

        Tag.loadGroups(Client.getClient());
        if(Client.getClient().tagGroups){
        	$scope.client.tagGroups = Client.getClient().tagGroups;
        }
        
        $scope.selectedTagGroupIndex = -1;

        Tag.loadReferenceData().then(function (response){
        	$scope.tagLibraries = response;
        });

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
            $scope.client.tagGroups.push(tagGroup);
            $scope.createMode = false;
        };

        $scope.selectTagGroup = function (groupIndex) {
            if ($scope.selectedTagGroupIndex === groupIndex) {
                $scope.client.tagGroups[groupIndex].editMode = true;
                //$scope.selectedTagGroupIndex = -1;
                focus('editMode');
            } else {
                $scope.selectedTagGroupIndex = groupIndex;
            }
        };

        $scope.removeTagGroup = function (groupIndex) {
            $scope.client.tagGroups.splice(groupIndex, 1);
        };

        $scope.changeTagGroupTitle = function (groupIndex) {
            // Title already gets changed from data binding, so really just need to hide the edit form
            $scope.client.tagGroups[groupIndex].editMode = false;
            $scope.selectedTagGroupIndex = -1;
        };

        $scope.tagExists = function (tag, groupIndex) {
            for (var j = 0; j < $scope.client.tagGroups[groupIndex].tags.length; j++) {
                if ($scope.client.tagGroups[groupIndex].tags[j].text === tag.text) {
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
                    $scope.client.tagGroups[groupIndex].tags.push(tag);
                }
            }
        };

        $scope.addLibraries = function () {
            var selected = $filter('filter')( this.tagLibraries , { checked : true } );
            $scope.client.tagGroups = this.client.tagGroups.concat(angular.copy(selected));
            angular.forEach(this.tagLibraries, function(value, key) {
                value.checked = false;
            });
        };

    })

    .filter('taglist', function() {
        return function(input) {
            return input.map(function(tag){ return tag.text; }).join(', ');
        };
    })
;
