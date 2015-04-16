'use strict';
angular.module('emmiManager')

    .directive('uniqueClient', ['$popover', 'Client', '$translate', '$timeout',
        function ($popover, Client, $translate, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attrs, ngModel) {
                    scope.checkingForDupes = {
                        now: false,
                        click: false
                    };

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
                                Client.findNormalizedName(scope.findNormalizedNameLink, element.val()).then(function (searchResults) {
                                    scope.existsClient = searchResults;
                                    if (scope.existsClient.entity === undefined) {
                                        ngModel.$setValidity('unique', true);
                                        if (scope.uniquePopup) {
                                            scope.uniquePopup.hide();
                                        }
                                    } else {
                                        var clientResource = Client.getClient();
                                        if (clientResource && clientResource.entity.id !== scope.existsClient.entity.id) {
                                            ngModel.$setValidity('unique', false);
                                            _paq.push(['trackEvent', 'Validation Error', 'Client', 'clientName unique']);
                                            if (scope.uniquePopup) {
                                                scope.uniquePopup.show();
                                            } else {
                                                $translate('client_edit_page.unique_popup_dialog.message').then(function (title) {
                                                    scope.uniquePopup = $popover(element, {
                                                        title: title,
                                                        placement: 'top-right',
                                                        scope: scope,
                                                        trigger: 'manual',
                                                        show: true,
                                                        contentTemplate: 'admin-facing/partials/client/unique_client_popover.tpl.html'
                                                    });
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

    .directive('saveClick', ['$popover', 'Client', '$timeout', '$translate',
        function ($popover, Client, $timeout, $translate) {
        return {
            restrict: 'EA',
            scope: {
                'okDeactivatePopover': '&onOk',
                'clientToEdit': '=clientToEdit',
                'checkingForDupes': '=checkingForDupes'
            },
            link: function (scope, element) {
                scope.cancelDeactivatePopover = function () {
                    scope.saveWarning.hide();
                    scope.clientToEdit.active = true;
                };
                if (scope.delayClickEvent) {
                    // de-register first $watch
                    scope.delayClickEvent();
                }
                scope.delayClickEvent = scope.$watch(
                    function (scope) {
                        return scope.checkingForDupes;
                    },
                    function (newVal, oldVal, scope) {
                        if (!scope.checkingForDupes.now && scope.checkingForDupes.click) {
                            scope.checkingForDupes.click = false;
                            scope.okDeactivatePopover();
                        }
                    }, true);

                element.on('click', function () {
                    var clientResource = Client.getClient();
                    if (!scope.clientToEdit.active && clientResource.entity.active) {
                        // pop a warning dialog
                        if (!scope.saveWarning) {
                            $translate('client_edit_page.deactivate_dialog.title').then(function (title) {
                                scope.saveWarning = $popover(element, {
                                    title: title,
                                    scope: scope,
                                    trigger: 'manual',
                                    show: true,
                                    placement: 'bottom',
                                    contentTemplate: 'admin-facing/partials/client/deactivate_popover.tpl.html'
                                });
                            });
                        } else {
                            scope.saveWarning.show();
                        }
                    } else {
                        $timeout(function () {
                            scope.checkingForDupes.click = true;
                            // causes the object to change even if click is already true
                            scope.checkingForDupes.rnd = Math.random();
                        });
                    }
                });
            }
        };
    }])
;
