'use strict';
angular.module('emmiManager')

/**
 * Ensures that the self reg code is unique across all teams and clients.
 */
    .directive('uniqueSelfRegCode', ['$popover', 'SelfRegistrationService', '$translate', '$timeout',
        function ($popover, SelfRegistrationService, $translate, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    url: '=uniqueUrl',
                    team: '='
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

                    element.on('blur', function () {
                        SelfRegistrationService.getByCode(scope.url, element.val()).then(function (response) {
                            scope.selfRefConfig = response;
                            if (scope.selfRefConfig === undefined) {
                                ngModel.$setValidity('unique', true);
                                if (scope.uniquePopup) {
                                    scope.uniquePopup.hide();
                                }
                            } else {
                                if ((scope.selfRefConfig && scope.selfRefConfig.entity.id && scope.selfRefConfig.entity.team.id !== scope.team.entity.id)) {
                                    ngModel.$setValidity('unique', false);
                                    if (scope.uniquePopup) {
                                        scope.uniquePopup.show();
                                    }
                                    else {
                                        scope.uniquePopup = $popover(element, {
                                            placement: 'top-right',
                                            scope: scope,
                                            trigger: 'manual',
                                            show: true,
                                            contentTemplate: 'admin-facing/partials/team/configuration/self-registration/unique_self_reg_code_popover.tpl.html'
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            };
        }])
;
