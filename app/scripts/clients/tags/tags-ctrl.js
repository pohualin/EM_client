'use strict';

angular.module('emmiManager')

/**
 *   Controls the tag group section
 */
    .controller('ClientTagsController', function ($scope, focus, $filter, Tag, Client, $q) {

        $scope.tagInputMode = false;

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

    .directive('popoverToggle', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                $timeout(function () {
                    var popover = element.closest('.popover');
                    var triggers = element.find('.toggle-trigger');
                    var origHeight = popover.outerHeight();
                    var origTop = popover.position().top;
                    triggers.on('click', function(){
                        var trigger = angular.element(this);
                        trigger.toggleClass('open');
                        trigger.next('.toggle-content').toggleClass('open');
                        var growth = popover.outerHeight() - origHeight;
                        popover.css({
                            top: (origTop - growth)+'px'
                        });
                    });

                });
            }
        };
    }])

    .directive('popoverDismiss', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                angular.element('body').on('click', function(e){
                    //the 'is' for buttons that trigger popups
                    //the 'has' for icons within a button that triggers a popup
                    if (!element.is(e.target) && element.has(e.target).length === 0 && angular.element('.popover').has(e.target).length === 0) {
                        scope.$apply(function () {
                            var thisPopover = element.next('.popover').first();
                            if (thisPopover.length) {
                                thisPopover.scope().$hide();
                            }
                        });
                    }
                });
            }
        };
    }])

    .filter('taglist', function() {
        return function(input) {
            return input.map(function(tag){ return tag.text; }).join(', ');
        };
    })
;
