'use strict';

angular.module('emmiManager')

/**
 * Use this to add days to a date through a filter
 */
    .filter('addDays', ['moment', function (moment) {
        return function (value, days) {
            if (typeof value === 'undefined' || value === null) {
                return '';
            }
            var date = moment(value, 'YYYY-MM-DD').add(days, 'days');
            if (!date.isValid()) {
                return value;
            }
            return date.format('YYYY-MM-DD');
        };
    }])

/**
 * This is a temporary monkey patch for the date picker to resolve https://github.com/mgcrea/angular-strap/issues/1056.
 *
 */
    .directive('bsDatepickerEmmi', ['$window', '$parse', '$q', '$locale', 'dateFilter', '$datepicker', '$dateParser',
        function ($window, $parse, $q, $locale, dateFilter, $datepicker, $dateParser) {

        var defaults = $datepicker.defaults;
        var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);
        var isNumeric = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };

        return {
            restrict: 'EAC',
            require: 'ngModel',
            link: function postLink(scope, element, attr, controller) {

                // Directive options
                var options = {scope: scope, controller: controller};
                angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'autoclose', 'dateType', 'dateFormat', 'modelDateFormat', 'dayFormat', 'strictFormat', 'startWeek', 'startDate', 'useNative', 'lang', 'startView', 'minView', 'iconLeft', 'iconRight', 'daysOfWeekDisabled'], function (key) {
                    if (angular.isDefined(attr[key])) {
                        options[key] = attr[key];
                    }
                });

                // Visibility binding support
                if (attr.bsShow) {
                    scope.$watch(attr.bsShow, function (newValue, oldValue) {
                        if (!datepicker || !angular.isDefined(newValue)) {
                            return;
                        }
                        if (angular.isString(newValue)) {
                            newValue = !!newValue.match(',?(datepicker),?');
                        }
                        if (newValue === true) {
                            datepicker.show();
                        } else {
                            datepicker.hide();
                        }
                    });
                }

                // Initialize datepicker
                var datepicker = $datepicker(element, controller, options);
                options = datepicker.$options;
                // Set expected iOS format
                if (isNative && options.useNative) {
                    options.dateFormat = 'yyyy-MM-dd';
                }

                // Observe attributes for changes
                angular.forEach(['minDate', 'maxDate'], function (key) {
                    // console.warn('attr.$observe(%s)', key, attr[key]);
                    if (angular.isDefined(attr[key])) {
                        attr.$observe(key, function (newValue) {
                            // console.warn('attr.$observe(%s)=%o', key, newValue);
                            if (newValue === 'today') {
                                var today = new Date();
                                datepicker.$options[key] = +new Date(today.getFullYear(), today.getMonth(), today.getDate() + (key === 'maxDate' ? 1 : 0), 0, 0, 0, (key === 'minDate' ? 0 : -1));
                            } else if (angular.isString(newValue) && newValue.match(/^".+"$/)) { // Support {{ dateObj }}
                                datepicker.$options[key] = +new Date(newValue.substr(1, newValue.length - 2));
                            } else if (isNumeric(newValue)) {
                                datepicker.$options[key] = +new Date(parseInt(newValue, 10));
                            } else if (angular.isString(newValue) && 0 === newValue.length) { // Reset date
                                datepicker.$options[key] = key === 'maxDate' ? +Infinity : -Infinity;
                            } else {
                                datepicker.$options[key] = +new Date(newValue);
                            }
                            // Build only if dirty
                            if (!isNaN(datepicker.$options[key])) {
                                datepicker.$build(false);
                            }

                            // set validity
                            if (!controller.$dateValue) {
                                controller.$setValidity('date', true);
                                return;
                            }
                            if (!controller.$dateValue || isNaN(controller.$dateValue.getTime())) {
                                controller.$setValidity('date', false);
                            } else {
                                var isMinValid = isNaN(datepicker.$options.minDate) || controller.$dateValue.getTime() >= datepicker.$options.minDate;
                                var isMaxValid = isNaN(datepicker.$options.maxDate) || controller.$dateValue.getTime() <= datepicker.$options.maxDate;
                                var isValid = isMinValid && isMaxValid;
                                controller.$setValidity('date', isValid);
                                controller.$setValidity('min', isMinValid);
                                controller.$setValidity('max', isMaxValid);
                            }
                        });
                    }
                });

                // Watch model for changes
                scope.$watch(attr.ngModel, function (newValue, oldValue) {
                    datepicker.update(controller.$dateValue);
                }, true);

                // Normalize undefined/null/empty array,
                // so that we don't treat changing from undefined->null as a change.
                function normalizeDateRanges(ranges) {
                    if (!ranges || !ranges.length) {
                        return null;
                    }
                    return ranges;
                }

                if (angular.isDefined(attr.disabledDates)) {
                    scope.$watch(attr.disabledDates, function (disabledRanges, previousValue) {
                        disabledRanges = normalizeDateRanges(disabledRanges);
                        previousValue = normalizeDateRanges(previousValue);
                        if (disabledRanges !== previousValue) {
                            datepicker.updateDisabledDates(disabledRanges);
                        }
                    });
                }

                var dateParser = $dateParser({format: options.dateFormat, lang: options.lang, strict: options.strictFormat});

                // viewValue -> $parsers -> modelValue
                controller.$parsers.unshift(function (viewValue) {
                    // console.warn('$parser("%s"): viewValue=%o', element.attr('ng-model'), viewValue);
                    // Null values should correctly reset the model value & validity
                    if(!viewValue) {
                        controller.$setValidity('date', true);
                        return;
                    }
                    var parsedDate = dateParser.parse(viewValue, controller.$dateValue);
                    if(!parsedDate || isNaN(parsedDate.getTime())) {
                        controller.$setValidity('date', false);
                        return;
                    } else {
                        var isMinValid = isNaN(datepicker.$options.minDate) || parsedDate.getTime() >= datepicker.$options.minDate;
                        var isMaxValid = isNaN(datepicker.$options.maxDate) || parsedDate.getTime() <= datepicker.$options.maxDate;
                        var isValid = isMinValid && isMaxValid;
                        controller.$setValidity('date', isValid);
                        controller.$setValidity('min', isMinValid);
                        controller.$setValidity('max', isMaxValid);
                        // Only update the model when we have a valid date
                        if(isValid) {
                            controller.$dateValue = parsedDate;
                        }
                    }
                    if (options.dateType === 'string') {
                        return dateFilter(parsedDate, options.modelDateFormat || options.dateFormat);
                    } else if (options.dateType === 'number') {
                        return controller.$dateValue.getTime();
                    } else if (options.dateType === 'iso') {
                        return controller.$dateValue.toISOString();
                    } else {
                        return new Date(controller.$dateValue);
                    }
                });

                // modelValue -> $formatters -> viewValue
                controller.$formatters.push(function (modelValue) {
                    // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
                    var date;
                    if (angular.isUndefined(modelValue) || modelValue === null) {
                        date = NaN;
                    } else if (angular.isDate(modelValue)) {
                        date = modelValue;
                    } else if (options.dateType === 'string') {
                        date = dateParser.parse(modelValue, null, options.modelDateFormat);
                    } else {
                        date = new Date(modelValue);
                    }
                    // Setup default value?
                    // if(isNaN(date.getTime())) {
                    //   var today = new Date();
                    //   date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
                    // }
                    controller.$dateValue = date;
                    return controller.$dateValue;
                });

                // viewValue -> element
                controller.$render = function () {
                    // console.warn('$render("%s"): viewValue=%o', element.attr('ng-model'), controller.$viewValue);
                    element.val(!controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : dateFilter(controller.$dateValue, options.dateFormat));
                };

                // Garbage collection
                scope.$on('$destroy', function () {
                    if (datepicker) {
                        datepicker.destroy();
                    }
                    options = null;
                    datepicker = null;
                });

            }
        };

    }])

;