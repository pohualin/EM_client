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
