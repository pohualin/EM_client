'use strict';

angular.module('emmiManager')

/**
 *   Controls the tag group section
 */
    .controller('ClientTagsController', function ($scope, focus, $filter, Tag, Client) {

        $scope.client.tagGroups = [];

        Tag.loadGroups(Client.getClient());
        if(Client.getClient().tagGroups){
            $scope.client.tagGroups = Client.getClient().tagGroups;
        }

        Tag.loadReferenceData().then(function (response){
            $scope.tagLibraries = response;
        });

        $scope.addLibraries = function () {
            // only add non-disabled but selected library groups
            var selected = $filter('filter')( this.tagLibraries , { checked : true, disabled: false } );
            $scope.client.tagGroups = this.client.tagGroups.concat(angular.copy(selected));
            angular.forEach(this.tagLibraries, function(value) {
                value.checked = false;
            });
        };

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
