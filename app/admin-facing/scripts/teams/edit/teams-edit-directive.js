'use strict';
angular.module('emmiManager')

/**
 * Ensures that the team name is unique. This directive interacts with the
 * save click via the 'checkingForDupes' attribute.
 */
    .directive('uniqueTeamName', ['$popover', 'CreateTeam', '$translate', '$timeout',
        function ($popover, CreateTeam, $translate, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    url: '=uniqueUrl',
                    team: '=',
                    checkingForDupes: '=checkingForDupes',
                    editMode: '='
                },
                link: function (scope, element, attrs, ngModel) {

                    var reset = function () {
                        if (scope.uniquePopup) {
                            scope.uniquePopup.hide();
                            ngModel.$setValidity('unique', true);
                        }
                    };

                    element.on('keydown', function () {
                        reset();
                    });

                    if (scope.editModeWatchDeReg) {
                        scope.editModeWatchDeReg();
                    }
                    scope.editModeWatchDeReg = scope.$watch('editMode', function (value) {
                        if (!value) {
                            reset();
                        }
                    });

                    element.on('blur', function () {
                        scope.checkingForDupes.now = true;
                        $timeout(function () {
                            // push the blur forward in time in case the user has clicked 'cancel' as the trigger to the blur
                            if (scope.editMode) {
                                CreateTeam.findNormalizedName(scope.url, element.val(), scope.team.client.id).then(function (searchResults) {
                                    scope.existsTeam = searchResults;
                                    if (scope.existsTeam.entity === undefined) {
                                        ngModel.$setValidity('unique', true);
                                        if (scope.uniquePopup) {
                                            scope.uniquePopup.hide();
                                        }
                                    } else {
                                        if ((scope.team.id !== scope.existsTeam.entity.id)) {
                                            ngModel.$setValidity('unique', false);
                                            _paq.push(['trackEvent', 'Validation Error', 'Team', 'teamName unique']);
                                            if (scope.uniquePopup) {
                                                scope.uniquePopup.show();
                                            }
                                            else {
                                                scope.uniquePopup = $popover(element, {
                                                    placement: 'top-right',
                                                    scope: scope,
                                                    trigger: 'manual',
                                                    show: true,
                                                    contentTemplate: 'admin-facing/partials/team/unique_team_popover.tpl.html'
                                                });
                                            }
                                        }
                                    }
                                }).finally(function () {
                                    scope.checkingForDupes.now = false;
                                });
                            } else {
                                scope.checkingForDupes.now = false;
                            }
                        }, 500);
                    });
                }
            };
        }])

/**
 * Happens when used, it will pop up a warning if a team is deactivated.
 * This needs the 'unique-team-name' directive to complete it's work. The
 * reason we have two directives is that the unique team name should happen
 * on the blur of the element
 */
    .directive('teamEditSave', ['$popover', 'Client', '$timeout', '$translate',
        function ($popover, Client, $timeout, $translate) {
            return {
                restrict: 'EA',
                scope: {
                    okDeactivatePopover: '&onOk',
                    teamEntity: '=teamEntity',
                    placement: '@placement',
                    checkingForDupes: '=checkingForDupes'
                },
                link: function (scope, element) {
                    scope.cancelDeactivatePopover = function () {
                        scope.saveWarning.hide();
                        var teamEntity = scope.teamEntity;
                        if (teamEntity) {
                            teamEntity.active = true;
                        }
                    };
                    var placement = scope.placement || 'right';
                    if (scope.delayClickEvent) {
                        // de-register first $watch
                        scope.delayClickEvent();
                    }
                    scope.delayClickEvent = scope.$watch(
                        function (scope) {
                            return scope.checkingForDupes;
                        },
                        function (newVal, oldVal, scope) {
                            // click when duplicates are not being checked and the user has actually clicked
                            if (!scope.checkingForDupes.now && scope.checkingForDupes.click) {
                                scope.checkingForDupes.click = false;
                                scope.okDeactivatePopover();
                            }
                        }, true);

                    element.on('click', function () {
                        var teamEntity = scope.teamEntity;
                        if (!teamEntity.active && teamEntity.currentlyActive) {
                            // pop a warning dialog
                            if (!scope.saveWarning) {
                                $translate('team_edit_page.deactivate_dialog.title').then(function (title) {
                                    scope.saveWarning = $popover(element, {
                                        title: title,
                                        scope: scope,
                                        show: true,
                                        trigger: 'manual',
                                        placement: placement,
                                        container: 'body',
                                        contentTemplate: 'admin-facing/partials/team/deactivate_popover.tpl.html'
                                    });
                                });
                            } else {
                                scope.saveWarning.show();
                            }
                        } else {
                            $timeout(function () {
                                scope.checkingForDupes.click = true;
                                scope.checkingForDupes.rnd = Math.random();
                            });
                        }
                    });
                }
            };
        }])
;
