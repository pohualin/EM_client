'use strict';

angular.module('emmi.typeahead', [])
    .directive('typeahead', function ($timeout){
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'scripts/common/directives/typeahead/typeahead.tpl.html',
            replace: true,
            transclude: true,
            scope: {
                search: '&',
                select: '&',
                expand: '&',
                items: '=',
                term: '=',
                paging: '='
            },
            controller: function($scope, $element, $attrs, $transclude) {
                $scope.items = [];
                $scope.hide = false;
                $scope.changePage = false;

                this.activate = function(item) {
                    $scope.active = item;
                };

                this.activateNextItem = function() {
                    var index = $scope.items.indexOf($scope.active);
                    if ((index+1) >= ($scope.paging.currentPage+1)*$scope.paging.itemsPerPage) {
                        $scope.paging.currentPage++;
                        $scope.changePage = true;
                    }
                    this.activate($scope.items[(index + 1) % $scope.items.length]);
                };

                this.activatePreviousItem = function() {
                    var index = $scope.items.indexOf($scope.active);
                    if ((index-1) < ($scope.paging.currentPage)*$scope.paging.itemsPerPage) {
                        $scope.paging.currentPage--;
                        $scope.changePage = true;
                    }
                    this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
                };

                this.isActive = function(item) {
                    return $scope.active === item;
                };

                this.selectActive = function() {
                    this.select($scope.active);
                };

                this.select = function(item) {
                    $scope.hide = true;
                    $scope.focused = true;
                    $scope.select({item:item});
                };

                $scope.isVisible = function() {
                    return !$scope.hide && ($scope.focused || $scope.mousedOver);
                };

                $scope.query = function() {
                    $scope.hide = false;
                    $scope.search({term:$scope.term});
                };

                $scope.all = function() {
                    $scope.hide = false;
                    $scope.focused = true;
                    $scope.expand();
                };

                $scope.pageCount = function() {
                    return Math.ceil($scope.items.length/$scope.paging.itemsPerPage)-1;
                };

            },
            //link: function($scope, iElm, iAttrs, controller) {
            link: function(scope, element, attrs, controller) {

                var $input = element.find('form > input');
                var $list = element.find('> div');
                var $listMenu = element.find('.menu');
                var maxHeight = parseInt($listMenu.css('maxHeight'), 10);

                function debounce(func, wait, immediate) {
                    var timeout;
                    return function() {
                        var context = this, args = arguments;
                        clearTimeout(timeout);
                        timeout = setTimeout(function() {
                            timeout = null;
                            if (!immediate) {
                                func.apply(context, args);
                            }
                        }, wait);
                        if (immediate && !timeout) {
                            func.apply(context, args);
                        }
                    };
                }

                $input.bind('focus', function() {
                    scope.$apply(function() { scope.focused = true; });
                });

                $input.bind('blur', function() {
                    scope.$apply(function() { scope.focused = false; });
                });

                $list.bind('mouseover', function() {
                    scope.$apply(function() { scope.mousedOver = true; });
                });

                $list.bind('mouseleave', function() {
                    scope.$apply(function() { scope.mousedOver = false; });
                });

                $listMenu.bind('scroll', debounce(function() {
                    if ($listMenu.scrollTop() + $listMenu.innerHeight() >= $listMenu.get(0).scrollHeight) {
                        //console.log('Bottom reached! Paginate!');
                        if (scope.paging.currentPage < scope.pageCount()) {
                            $listMenu.get(0).scrollTop = 2;
                            scope.$apply(function() { scope.paging.currentPage++; });
                        }
                    }
                    if ($listMenu.scrollTop() === 0) {
                        //console.log('Top reached! Paginate!');
                        if (scope.paging.currentPage > 0) {
                            // total height of the list (350) - height of the list viewport (210) = 140
                            $listMenu.get(0).scrollTop = $listMenu.find('ul').innerHeight() - $listMenu.innerHeight() - 2;
                            scope.$apply(function() { scope.paging.currentPage--; });
                        }
                    }
                }, 500));

                $input.bind('keyup', function(e) {
                    if (e.keyCode === 9 || e.keyCode === 13) {
                        scope.$apply(function() { controller.selectActive(); });
                    }

                    if (e.keyCode === 27) {
                        scope.$apply(function() { scope.hide = true; });
                    }
                });

                $input.bind('keydown', function(e) {
                    if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
                        e.preventDefault();
                    }

                    if (e.keyCode === 40) {
                        e.preventDefault();
                        scope.$apply(function() { controller.activateNextItem(); });

                        /* jshint ignore:start */
                        if (!scope.changePage) {
                            var $listMenuHighlight = $listMenu.find('.active');
                            var visible_top = $listMenu.scrollTop();
                            var visible_bottom = maxHeight + visible_top;
                            var high_top = $listMenuHighlight.position().top + $listMenu.scrollTop();
                            var high_bottom = high_top + $listMenuHighlight.outerHeight();
                            if (high_bottom >= visible_bottom) {
                                $listMenu.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
                            } else if (high_top < visible_top) {
                                $listMenu.scrollTop(high_top);
                            }
                        } else {
                            $listMenu.get(0).scrollTop = 2;
                            scope.changePage = false;
                        }
                        /* jshint ignore:end */

                    }

                    if (e.keyCode === 38) {
                        e.preventDefault();
                        scope.$apply(function() { controller.activatePreviousItem(); });

                        /* jshint ignore:start */
                        if (!scope.changePage) {
                            var $listMenuHighlight = $listMenu.find('.active');
                            var visible_top = $listMenu.scrollTop();
                            var visible_bottom = maxHeight + visible_top;
                            var high_top = $listMenuHighlight.position().top + $listMenu.scrollTop();
                            var high_bottom = high_top + $listMenuHighlight.outerHeight();
                            if (high_bottom >= visible_bottom) {
                                $listMenu.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
                            } else if (high_top < visible_top) {
                                if (high_top === 0) {
                                    high_top = high_top + 2;
                                }
                                $listMenu.scrollTop(high_top);
                            }
                        } else {
                            $listMenu.get(0).scrollTop = $listMenu.find('ul').innerHeight() - $listMenu.innerHeight() - 2;
                            scope.changePage = false;
                        }
                        /* jshint ignore:end */

                    }
                });

                scope.$watch('items', function(items) {
                    controller.activate(items.length ? items[0] : null);
                });

                scope.$watch('focused', function(focused) {
                    if (focused) {
                        $timeout(function() { $input.focus(); }, 0, false);
                    }
                });

                scope.$watch('isVisible()', function(visible) {
                    if (visible) {
                        var pos = $input.position();
                        var height = $input[0].offsetHeight;

                        $list.css({
                            //top: pos.top + height,
                            //left: pos.left,
                            //position: 'absolute',
                            display: 'block'
                        });
                    } else {
                        $list.css('display', 'none');
                    }
                });

            }
        };
    })

    .directive('typeaheadItem', function() {
        return {
            require: '^typeahead',
            link: function(scope, element, attrs, controller) {

                var item = scope.$eval(attrs.typeaheadItem);

                scope.$watch(function() { return controller.isActive(item); }, function(active) {
                    if (active) {
                        element.addClass('active');
                    } else {
                        element.removeClass('active');
                    }
                });

                element.bind('mouseenter', function(e) {
                    scope.$apply(function() { controller.activate(item); });
                });

                element.bind('click', function(e) {
                    scope.$apply(function() { controller.select(item); });
                });
            }
        };
    })
;
