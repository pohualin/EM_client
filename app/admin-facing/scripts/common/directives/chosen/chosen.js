/* global angular */
/**
 * Monkey patch for angular-chosen-localytics directive.
 *
 * Adds features:
 * ngDisabled functionality now works properly, instead of always 'enabling' whenever a load is complete
 *
 * dynamic placeholder, changes to the placeholder now reflect inside the dropdown immediately
 *
 */
(function () {
    'use strict';

    var __indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) {
                    return i;
                }
            }
            return -1;
        };

    angular.module('emmi.chosen', [])

        .directive('chosen', [
            '$timeout', function ($timeout) {
                var CHOSEN_OPTION_WHITELIST, NG_OPTIONS_REGEXP, isEmpty, snakeCase;
                NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
                CHOSEN_OPTION_WHITELIST = ['noResultsText', 'allowSingleDeselect', 'disableSearchThreshold', 'disableSearch', 'enableSplitWordSearch', 'inheritSelectClasses', 'maxSelectedOptions', 'placeholderTextMultiple', 'placeholderTextSingle', 'searchContains', 'singleBackstrokeDelete', 'displayDisabledOptions', 'displaySelectedOptions', 'width'];
                snakeCase = function (input) {
                    return input.replace(/[A-Z]/g, function ($1) {
                        return '_' + ($1.toLowerCase());
                    });
                };
                isEmpty = function (value) {
                    var key;
                    if (angular.isArray(value)) {
                        return value.length === 0;
                    } else if (angular.isObject(value)) {
                        for (key in value) {
                            if (value.hasOwnProperty(key)) {
                                return false;
                            }
                        }
                    }
                    return true;
                };
                return {
                    restrict: 'A',
                    require: '?ngModel',
                    terminal: true,
                    link: function (scope, element, attr, ngModel) {
                        var chosen, defaultText, disableWithMessage, empty, initOrUpdate, match, options, origRender, removeEmptyMessage, startLoading, stopLoading, valuesExpr, viewWatch;
                        element.addClass('localytics-chosen');
                        options = scope.$eval(attr.chosen) || {};
                        angular.forEach(attr, function (value, key) {
                            if (__indexOf.call(CHOSEN_OPTION_WHITELIST, key) >= 0) {
                                //return options[snakeCase(key)] = scope.$eval(value);
                                options[snakeCase(key)] = scope.$eval(value);
                            }
                        });
                        startLoading = function () {
                            return element.addClass('loading').attr('disabled', true).trigger('chosen:updated');
                        };
                        stopLoading = function () {
                            return element.removeClass('loading').attr('disabled', !!ngModel.disabledBeforeLoad).trigger('chosen:updated');
                        };
                        chosen = null;
                        defaultText = null;
                        empty = false;
                        var defaultTextAttribute = 'default_text';
                        initOrUpdate = function () {
                            if (chosen) {
                                element.trigger('chosen:updated');
                            } else {
                                chosen = element.chosen(options).data('chosen');
                                defaultText = chosen[defaultTextAttribute];
                            }
                        };
                        removeEmptyMessage = function () {
                            empty = false;
                            return element.attr('data-placeholder', defaultText);
                        };
                        var resultsNoneFoundAttribute = 'results_none_found';
                        disableWithMessage = function () {
                            empty = true;
                            return element.attr('data-placeholder', chosen[resultsNoneFoundAttribute]).attr('disabled', true).trigger('chosen:updated');
                        };
                        if (ngModel) {
                            origRender = ngModel.$render;
                            ngModel.$render = function () {
                                origRender();
                                return initOrUpdate();
                            };
                            if (attr.multiple) {
                                viewWatch = function () {
                                    return ngModel.$viewValue;
                                };
                                scope.$watch(viewWatch, ngModel.$render, true);
                            }
                        } else {
                            initOrUpdate();
                        }
                        attr.$observe('disabled', function (changeValue) {
                            if (!angular.isUndefined(changeValue)) {
                                ngModel.disabledBeforeLoad = changeValue;
                                return element.trigger('chosen:updated');
                            }
                        });
                        attr.$observe('placeholder', function (changeValue) {
                            if (!angular.isUndefined(changeValue)) {
                                return element.trigger('chosen:updated');
                            }
                        });
                        if (attr.ngOptions && ngModel) {
                            match = attr.ngOptions.match(NG_OPTIONS_REGEXP);
                            valuesExpr = match[7];
                            var timer;
                            scope.$watchCollection(valuesExpr, function (newVal) {
                                timer = $timeout(function () {
                                    if (angular.isUndefined(newVal)) {
                                        return startLoading();
                                    } else {
                                        if (empty) {
                                            removeEmptyMessage();
                                        }
                                        stopLoading();
                                        if (isEmpty(newVal)) {
                                            return disableWithMessage();
                                        }
                                    }
                                });
                            });
                            return scope.$on('$destroy', function () {
                                if (typeof timer !== 'undefined' && timer !== null) {
                                    return $timeout.cancel(timer);
                                }
                            });
                        }
                    }
                };
            }
        ]);
}());
