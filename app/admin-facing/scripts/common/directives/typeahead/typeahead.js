(function (angular) {
    'use strict';

    angular.module('emmi.typeahead', [])

        .directive('emmiTypeahead', function ($timeout) {

            // Runs during compile
            return {
                // name: '',
                // priority: 1,
                // terminal: true,
                // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                templateUrl: 'admin-facing/partials/common/directives/typeahead/typeahead.tpl.html',
                replace: true,
                transclude: true,
                scope: {
                    search: '&',
                    select: '&',
                    blur: '&',
                    items: '=',
                    term: '=',
                    placeholder: '@',
                    id: '@',
                    focus: '@',
                    minLength: '@',
                    onEmptyCallback: '&',
                    searchResultContainer: '@',
                    ngRequired: '='
                },

                controller: function ($scope) {
                    $scope.items = [];
                    $scope.hide = true;
                    $scope.onEmptyCallback = $scope.onEmptyCallback || angular.noop;

                    this.activate = function (item) {
                        $scope.active = item;
                    };

                    this.scrollToActive = function () {
                        if ($scope.active) {
                            $timeout(function () {
                                // need in timeout so $$hashKey is calculated
                                var listItem = angular.element('#' + $scope.searchResultContainer + '_active-option'),
                                    scroller = angular.element('#' + $scope.searchResultContainer);
                                if (listItem && listItem.length > 0 && scroller && scroller.length > 0) {
                                    var pos = scroller.scrollTop() -
                                        scroller.position().top + listItem.position().top;
                                    scroller.animate({
                                        scrollTop: pos
                                    }, 10);
                                }
                            });
                        }
                    };

                    this.activateNextItem = function () {
                        var index = $scope.items.indexOf($scope.active);
                        this.activate($scope.items[(index + 1) % $scope.items.length]);
                    };

                    this.activatePreviousItem = function () {
                        var index = $scope.items.indexOf($scope.active);
                        this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
                    };

                    this.isActive = function (item) {
                        return $scope.active === item;
                    };

                    this.selectActive = function () {
                        this.select($scope.active);
                    };

                    this.select = function (item) {
                        var result = $scope.select({item: item});
                        item._selected = true;
                        $scope.focused = true;
                        if (result) {
                            $scope.hide = true;
                        }
                    };

                    $scope.isVisible = function () {
                        return !$scope.hide && !$scope.loading && ($scope.focused || $scope.mousedOver);
                    };

                    $scope.anySizeQuery = function () {
                        if (!$scope.active) {
                            $scope.loading = true;
                            $scope.hide = false;
                            $scope.search({term: $scope.term});
                        }
                    };

                    $scope.query = function () {
                        if ($scope.term && $scope.term.length >= $scope.minLength) {
                            $scope.loading = true;
                            $scope.hide = false;
                            $scope.search({term: $scope.term});
                        } else {
                            $scope.hide = true;
                            $scope.items = [];
                            $scope.onEmptyCallback();
                        }
                    };

                    this.blur = function () {
                        $timeout(function () {
                            $scope.hide = true;
                            $scope.blur();
                        }, 500);

                    };

                },
                //link: function($scope, iElm, iAttrs, controller) {
                link: function (scope, element, attrs, controller) {

                    var $input = element.find('.typeahead-input-for-finding'),
                        $list = element.find('.menu'),
                        tabDoesNotSelectActive = angular.isDefined(attrs.tabDoesNotSelectActive);


                    // EM-1433: prevent the blur event from firing when clicking within the menu's scrollbar (oddly only happens when clicking on page scroll in between)
                    $list.on('mousedown', function (e) {
                        var offX = (e.offsetX || e.pageX - angular.element(e.target).offset().left);
                        // preventing the default still allows the scroll, but blocks the blur.
                        // We're inside the scrollbar if the offsetX is >= the clientWidth.
                        if (offX >= e.target.clientWidth) {
                            e.preventDefault();
                        }
                    });

                    $input.bind('focus', function () {
                        scope.$apply(function () {
                            scope.focused = true;
                            if (scope.items && scope.items.length > 0) {
                                scope.hide = false;
                            }
                        });
                    });

                    $input.bind('blur', function () {
                        scope.$apply(function () {
                            controller.blur();
                            scope.focused = false;
                        });
                    });

                    $list.bind('mouseover', function () {
                        scope.$apply(function () {
                            scope.mousedOver = true;
                        });
                    });

                    $list.bind('mouseleave', function () {
                        scope.$apply(function () {
                            scope.mousedOver = false;
                        });
                    });

                    $input.bind('keyup', function (e) {
                        if ((!tabDoesNotSelectActive && e.keyCode === 9) || e.keyCode === 13) {
                            if (!scope.hide) {
                                // only select if the results window is open
                                scope.$apply(function () {
                                    controller.selectActive();
                                });
                            }
                        }

                        if (e.keyCode === 27) {
                            scope.$apply(function () {
                                scope.hide = true;
                                scope.items = [];
                            });
                        }
                    });

                    $input.bind('keydown', function (e) {

                        if ((!tabDoesNotSelectActive && e.keyCode === 9) || e.keyCode === 13 || e.keyCode === 27) {
                            e.preventDefault();
                        }

                        if (e.keyCode === 40) {
                            e.preventDefault();
                            scope.$apply(function () {
                                controller.activateNextItem();
                                controller.scrollToActive();
                            });
                        }

                        if (e.keyCode === 38) {
                            e.preventDefault();
                            scope.$apply(function () {
                                controller.activatePreviousItem();
                                controller.scrollToActive();
                            });
                        }
                    });

                    scope.$watch('items', function (items) {
                        scope.loading = false;
                        controller.activate(items.length ? items[0] : null);
                        if (items.length > 0) {
                            controller.scrollToActive();
                        }
                    });

                    scope.$watch('focused', function (focused) {
                        if (focused) {
                            $timeout(function () {
                                $input.focus();
                            }, 0, false);
                        }
                    });

                    scope.$watch('isVisible()', function (visible) {
                        if (visible) {
                            var pos = $input.position();
                            var height = $input[0].offsetHeight;

                            $list.css({
                                top: pos.top + height,
                                left: pos.left,
                                position: 'absolute',
                                display: 'block',
                                width: $input.outerWidth()
                            }).attr('aria-expanded', 'true');
                        } else {
                            $list.css('display', 'none').attr('aria-expanded', 'false');
                        }
                    });

                }
            };
        })

        .directive('emmiTypeaheadItem', function () {
            return {
                require: '^emmiTypeahead',
                link: function (scope, element, attrs, controller) {

                    var item = scope.$eval(attrs.emmiTypeaheadItem);

                    scope.$watch(function () {
                        return controller.isActive(item);
                    }, function (active) {
                        if (active) {
                            element.addClass('active');
                            element.attr('id', element.closest('ul').attr('id')+'_active-option');
                        } else {
                            element.removeClass('active');
                            element.removeAttr('id');
                        }
                    });

                    element.bind('mouseenter', function () {
                        scope.$apply(function () {
                            controller.activate(item);
                        });
                    });

                    element.bind('click', function () {
                        scope.$apply(function () {
                            controller.select(item);
                        });
                    });
                }
            };
        })

        .directive('typeAheadValue', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$isEmpty = function (value) {
                        console.log('Selected', ctrl._selected);
                        return !angular.isDefined(value) || !angular.isDefined(value.value);
                    };
                }
            };
        })
    ;

})(window.angular);
