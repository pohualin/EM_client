'use strict';

angular.module('emmiManager')

/**
 * This directive shows a warning dialog when a currently active ClientProvider is deactivated
 */
    .directive('addTeamRolesWarning', ['$popover', '$timeout', 'UserClientUserClientTeamRolesService', function ($popover, $timeout, UserClientUserClientTeamRolesService) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                element.on('click', function (event) {
                    event.stopPropagation();

                    /**
                     * Check and see if pop-over is needed
                     */
                    UserClientUserClientTeamRolesService.checkSelectedTeamRoles(scope.selectedTeamRoles, scope.clientTeamRoles).then(function(response){
                    	if (response.length > 0) {
                            // pop a warning dialog
                    	    UserClientUserClientTeamRolesService.setCardsToRefresh(response);
                            if (!scope.addTeamRolesWarning) {
                                scope.addTeamRolesWarning = $popover(element, {
                                    title: 'Are you sure?',
                                    scope: scope,
                                    trigger: 'manual',
                                    container: 'body',
                                    show: true,
                                    placement: 'top',
                                    target: element,
                                    contentTemplate: 'admin-facing/partials/user/client/user_client_team_role/add_team_popover.tpl.html'
                                });
                            } else {
                                scope.addTeamRolesWarning.show();
                            }
                        } else {
                            $timeout(function () {
                                scope.save();
                            });
                        }
    				});

                    /**
                     * Called when cancel button on modal is clicked
                     */
                    scope.cancel = function(){
        				if (scope.addTeamRolesWarning) {
                            scope.addTeamRolesWarning.hide();
                        }
        				scope.hideAddTeamsModal();
        			};

        			/**
        			 * Called when NO is clicked
        			 */
        			scope.cancelAddTeamsPopover = function(){
        				if (scope.addTeamRolesWarning) {
                            scope.addTeamRolesWarning.hide();
                        }
        			};

        			/**
        			 * Called when YES is clicked
        			 */
        			scope.okAddTeamsPopover = function(){
        				scope.save();
        			};

                    scope.$on('hide_add_team_roles_warning', function () {
    			        scope.cancelAddTeamsPopover();
    			    });
                });
            }
        };
    }]);
