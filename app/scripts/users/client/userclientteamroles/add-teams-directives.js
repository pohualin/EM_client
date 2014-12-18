'use strict';

angular.module('emmiManager')

/**
 * This directive shows a warning dialog when a currently active ClientProvider is deactivated
 */
    .directive('addTeamRolesWarning', ['$popover', '$timeout', function ($popover, $timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                element.on('click', function (event) {
                    event.stopPropagation();
                    scope.checkSelectedTeamRoles();
                    if (scope.needComfirmationModal) {
                        // pop a warning dialog
                        if (!scope.addTeamRolesWarning) {
                            scope.addTeamRolesWarning = $popover(element, {
                                title: '',
                                scope: scope,
                                trigger: 'manual',
                                container: 'body',
                                show: true,
                                placement: 'top',
                                target: element,
                                contentTemplate: 'partials/user/client/userclientteamrole/add_team_popover.tpl.html'
                            });
                        } else {
                            scope.addTeamRolesWarning.show();
                        }
                    } else {
                        $timeout(function () {
                            scope.save();
                        });
                    }
                    
                    scope.cancel = function(){
        				if (scope.addTeamRolesWarning) {
                            scope.addTeamRolesWarning.hide();
                        }
        				scope.hideAddTeamsModal();
        			};
        			
        			scope.cancelAddTeamsPopover = function(){
        				if (scope.addTeamRolesWarning) {
                            scope.addTeamRolesWarning.hide();
                        }
        			};
        			
        			scope.okAddTeamsPopover = function(){
        				scope.save();
        			};
                });
            }
        };
    }]);