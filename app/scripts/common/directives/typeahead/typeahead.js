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
            templateUrl: 'partials/common/directives/typeahead/typeahead.tpl.html',
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
                minLength: '@'
            },
            controller: function ($scope, $element, $attrs, $transclude) {
                $scope.items = [];
                $scope.hide = true;

                this.activate = function (item) {
                    $scope.active = item;
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
                    if ($scope.term.length >= $scope.minLength) {
                        $scope.loading = true;
                        $scope.hide = false;
                        $scope.search({term: $scope.term});
                    } else {
                        $scope.hide = true;
                        $scope.items = [];
                    }
                };

                this.blur = function () {
                    $scope.blur();
                };

            },
            //link: function($scope, iElm, iAttrs, controller) {
            link: function (scope, element, attrs, controller) {

                var $input = element.find('form > input');
                var $list = element.find('.menu');

                $input.bind('focus', function () {
                    scope.$apply(function () {
                        scope.focused = true;
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
                    if (e.keyCode === 9 || e.keyCode === 13) {
                        scope.$apply(function () {
                            controller.selectActive();
                        });
                    }

                    if (e.keyCode === 27) {
                        scope.$apply(function () {
                            scope.hide = true;
                            scope.items = [];
                        });
                    }
                });

                $input.bind('keydown', function (e) {
                    if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
                        e.preventDefault();
                    }

                    if (e.keyCode === 40) {
                        e.preventDefault();
                        scope.$apply(function () {
                            controller.activateNextItem();
                        });
                    }

                    if (e.keyCode === 38) {
                        e.preventDefault();
                        scope.$apply(function () {
                            controller.activatePreviousItem();
                        });
                    }
                });

                scope.$watch('items', function (items) {
                    scope.loading = false;
                    controller.activate(items.length ? items[0] : null);
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
                        });
                    } else {
                        $list.css('display', 'none');
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
                    } else {
                        element.removeClass('active');
                    }
                });

                element.bind('mouseenter', function (e) {
                    scope.$apply(function () {
                        controller.activate(item);
                    });
                });

                element.bind('click', function (e) {
                    scope.$apply(function () {
                        controller.select(item);
                    });
                });
            }
        };
    })
;
