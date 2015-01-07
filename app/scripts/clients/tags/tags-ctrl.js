'use strict';

angular.module('emmiManager')

/**
 *   Controls the tag group section
 */
    .controller('ClientTagsController', function ($scope, focus, $filter, Tag, TeamTag, Client, $q, $route) {

        $scope.tagInputMode = false;
        $scope.hideCancelButton = false;

        $scope.toggleHideCancelButton = function () {
            $scope.hideCancelButton = !$scope.hideCancelButton;
        };
        $scope.hideConflictingTeamsPopover = function () {
            $scope.teamConflictWarning.hide();
        };
        $scope.showPopover = function () {
            $scope.teamConflictWarning.show();
        };


        // load the groups for this client as well as the tag libraries
        $q.all([Tag.loadGroups(Client.getClient()), Tag.loadReferenceData()]).then(function (response) {
            var clientGroups = response[0],
                tagLibraries = response[1],
                libraryMap = {};

            // make a map object library tags keyed by title and put it in scope
            angular.forEach(tagLibraries, function (tagLibrary) {
                libraryMap[tagLibrary.title] = tagLibrary;
            });
            $scope.tagLibraries = tagLibraries;
            $scope.tagLibraryMap = libraryMap;

            // set the selected groups
            $scope.client.savedGroups = clientGroups || [];
            $scope.client.tagGroups = angular.copy($scope.client.savedGroups);

        });

        $scope.hideOpenModals = function() {
            $scope.hideConflictingTeamsPopover();
            if ($scope.hideClientTags) {
                $scope.hideClientTags();
            }
        };

        $scope.checkForConflicts = function (isValid) {
            Tag.checkForConflicts(Client.getClient()).then(function (conflictingTeamTags) {
                if (conflictingTeamTags.length > 0) {
                    if (conflictingTeamTags.length === 1 && (conflictingTeamTags[0].conflictingTeamIds[0] === $route.current.params.teamId)) {
                        //if the only team with this tag is the team we are currently on don't show popover
                        $scope.saveTags(isValid);
                        $scope.hideOpenModals();
                        return;
                    }
                    $scope.conflictingTeamTags = conflictingTeamTags;
                    $scope.showPopover();
                } else {
                    $scope.saveTags(isValid);
                    $scope.hideOpenModals();
                }
            });
        };

        $scope.overrideConflictingTeamTags = function (isValid) {
            $scope.saveTags(isValid);
            $scope.hideConflictingTeamsPopover();
            $scope.hideClientTags();
        };

        $scope.saveTags = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid) {
                $scope.saving = true;
                Tag.insertGroups(Client.getClient()).then(function () {
                    // eventually we'll have a save response that we need to deal with here
                    Tag.loadGroups(Client.getClient()).then(function (clientGroups) {
                        $scope.client.savedGroups = clientGroups || [];
                        $scope.client.tagGroups = angular.copy($scope.client.savedGroups);
                        $scope.clientTagsHaveChanges = false;
                        $scope.saving = false;
                        if ($scope.team) {
                            var tagGroupToDisplay = [];
                            angular.forEach(clientGroups, function (group) {
                                var localGroup = angular.copy(group);
                                localGroup.title = localGroup.name;
                                //rebuild groups on each tag
                                localGroup.tag = null;
                                angular.forEach(group.tag, function (tag) {
                                    tag.group = localGroup;
                                    tag.text = tag.name;
                                    tagGroupToDisplay.push(tag);
                                });
                            });
                            $scope.team.tags = tagGroupToDisplay;
                            TeamTag.loadSelectedTags($scope.teamClientResource.teamResource);
                        }
                    }, function () {
                        // error happened
                        $scope.saving = false;
                    });
                }, function () {
                    // error happened
                    $scope.saving = false;
                });
            }
        };

        $scope.tagsChanged = function () {
            $scope.clientTagsHaveChanges = true;
        };

        $scope.cancelTagChanges = function () {
            $scope.client.tagGroups = angular.copy($scope.client.savedGroups);
            $scope.clientTagsHaveChanges = false;
        };

        // called on click of the 'Add' button on the group library popup
        $scope.addLibraries = function () {
            // only add non-disabled but selected library groups
            var selected = $filter('filter')(this.tagLibraries, { checked: true, disabled: false });
            if (selected.length > 0) {
                $scope.client.tagGroups = $scope.client.tagGroups.concat(angular.copy(selected));
                $scope.clientTagsHaveChanges = true;
            }
            angular.forEach(this.tagLibraries, function (value) {
                value.checked = false;
            });
        };

        // a filter to set the checked and disabled properties of a library group
        $scope.disableLibrary = function () {
            return function (libraryGroup) {
                var match = false;
                angular.forEach($scope.client.tagGroups, function (tagGroup) {
                    // exact match between tag group and library group titles
                    var type = tagGroup.entity ? tagGroup.entity.type : tagGroup.type;
                    if (type && libraryGroup.entity.type.id === type.id) {
                        match = true;
                    }
                });
                // if there were a match disable and select the library group
                libraryGroup.disabled = match;
                if (libraryGroup.disabled) {
                    libraryGroup.checked = true;
                }
                return libraryGroup;
            };
        };

        // currently have to hook these events into the tooltip for the popover, since AngularStrap popovers do not provide a correct prefixEvent hook to configure popovers
        $scope.$on('tooltip.hide', function () {
            angular.forEach($scope.tagLibraries, function (value) {
                value.checked = false;
            });
        });

    })

    .directive('popoverToggle', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                $timeout(function () {
                    var popover = element.closest('.popover');
                    var triggers = element.find('.toggle-trigger');
                    triggers.on('click', function () {
                        var origHeight = popover.outerHeight();
                        var origTop = popover.position().top;
                        var trigger = angular.element(this);
                        trigger.toggleClass('open');
                        trigger.next('.toggle-content').toggleClass('open');
                        var growth = popover.outerHeight() - origHeight;
                        popover.css({
                            top: (origTop - growth) + 'px'
                        });
                    });
                });
            }
        };
    }])
    .directive('teamConflictPopover', ['$popover', '$timeout', '$translate', function ($popover) {
        return {
            restrict: 'EA',
            link: function (scope, element) {

                element.on('click', function () {
                    // pop a warning dialog
                    event.stopPropagation();
                    scope.toggleHideCancelButton();
                    if (!scope.teamConflictWarning) {
                        scope.teamConflictWarning = $popover(element, {
                            title: 'Are you sure?',
                            scope: scope,
                            show: false,
                            autoClose: true,
                            placement: 'top',
                            trigger: 'manual',
                            contentTemplate: 'partials/client/tags/conflictingTeam_popover.tpl.html'
                        });
                        scope.$on('tooltip.hide', function () {
                            scope.toggleHideCancelButton();
                            scope.$apply();
                        });
                    }
                });
            }
        };
    }])

    .directive('popoverDismiss', ['$timeout', function () {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                angular.element('body').on('click', function (e) {
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

    .filter('taglist', function () {
        return function (input) {
            return input.map(function (tag) {
                return tag.text;
            }).join(', ');
        };
    })
;
