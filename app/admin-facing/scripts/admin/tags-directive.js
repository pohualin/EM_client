'use strict';
angular.module('emmiManager')

/**
 * Create a popover warning.
 */
    .directive('deleteGroupWarning', ['$popover',
        function ($popover) {
            return {
                restrict: 'EA',
                scope: {
                    ok: '&onOk',
                    cancel: '&onCancel',
                    onOpenPopover: '&onOpenPopover',
                    onClosePopover: '&onClosePopover',
                    placement: '@placement'
                },
                link: function (scope, element) {
                    scope.placement = scope.placement || 'top';
                    scope.$on('tooltip.hide', function () {
                        scope.onClosePopover();
                        delete scope.warningDialog;
                        scope.$apply();
                    });
                    element.on('click', function () {
                        scope.onOpenPopover();
                        if (!scope.warningDialog) {
                            // pop a warning dialog
                            scope.warningDialog = $popover(element, {
                                autoClose: true,
                                title: 'Are you sure?',
                                scope: scope,
                                trigger: 'manual',
                                show: true,
                                placement: scope.placement,
                                container: 'body',
                                contentTemplate: 'admin-facing/partials/admin/tags/delete_popover.tpl.html'
                            });
                        }
                    });
                }
            };
        }])

/**
 * Check for tag groups with the same name
 */
    .directive('groupTitleUnique', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: false,
            link: function (scope, ele, attrs, ctrl) {
                // add a parser that will process each time the value is
                // parsed into the model when the user updates it.
                ctrl.$parsers.unshift(function (value) {
                    if (value) {
                        var newGroupTitle = value.toLowerCase().replace(/[^a-z0-9]+/g, '');
                        var found = false;
                        angular.forEach(scope.tagGroups, function (group, i) {
                            // Make sure not to validate against the current group
                            if (i.toString() !== attrs.groupIndex) {
                                var normalizedTitle = group.entity.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
                                if (newGroupTitle === normalizedTitle) {
                                    found = true;
                                }
                            }
                        });
                        ctrl.$setValidity('unique', !found);
                    } else {
                        ctrl.$setValidity('unique', true);
                    }

                    return value;
                });
            }
        };
    })
;
