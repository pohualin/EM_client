'use strict';

angular.module('emmiManager')

/**
 *   Controls the tag group section
 */
    .controller('ClientTagsController', function ($scope, focus, $filter, Tag, Client, $q) {

        // load the groups for this client as well as the tag libraries
        $q.all([Tag.loadGroups(Client.getClient()), Tag.loadReferenceData()]).then(function (response) {
            var clientGroups = response[0],
                tagLibraries = response[1],
                libraryMap = {};

            // make a map object library tags keyed by title and put it in scope
            angular.forEach(tagLibraries, function(tagLibrary){
                libraryMap[tagLibrary.title] = tagLibrary;
            });
            $scope.tagLibraries = tagLibraries;

            // set the selected groups and reference library into scope
            $scope.client.tagGroups = clientGroups || [];
            $scope.tagLibraryMap = libraryMap;
        });

        // called on click of the 'Add' button on the group library popup
        $scope.addLibraries = function () {
            // only add non-disabled but selected library groups
            var selected = $filter('filter')( this.tagLibraries , { checked : true, disabled: false } );
            $scope.client.tagGroups = $scope.client.tagGroups.concat(angular.copy(selected));
            angular.forEach(this.tagLibraries, function(value) {
                value.checked = false;
            });
        };

        // a filter to set the checked and disabled properties of a library group
        $scope.disableLibrary = function(){
            return function(libraryGroup){
                var match = false;
                angular.forEach($scope.client.tagGroups, function(tagGroup){
                    // exact match between tag group and library group titles
                    if (libraryGroup.title === tagGroup.title){
                        match = true;
                    }
                });
                // if there were a match disable and select the library group
                libraryGroup.disabled = match;
                if (libraryGroup.disabled ) {
                    libraryGroup.checked = true;
                }
                return libraryGroup;
            };
        };

    })

    .filter('taglist', function() {
        return function(input) {
            return input.map(function(tag){ return tag.text; }).join(', ');
        };
    })
;
