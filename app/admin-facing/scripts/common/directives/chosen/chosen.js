/* global angular */
/**
 * Monkey patch for angular-chosen-localytics directive.
 *
 * Adds features:
 *
 * ngDisabled: functionality now works properly, instead of always 'enabling' whenever a load is complete
 *
 * dynamic placeholder: changes to the placeholder now reflect inside the dropdown immediately
 *
 * 'remove' confirmation: call the scope.chosenBeforeRemoveHook() method before a remove happens.
 *      This only works for select elements that: 1. have an ID and 2. are multi-select
 *
 *      the method in the controller should be defined like:
 *      $scope.chosenBeforeRemoveHook = function (element, performDelete) {
 *          // do whatever you need to do,
 *          // then call performDelete() to actually delete the item
 *          performDelete();
 *      }
 *
 */

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

    .directive('chosen', ['$timeout', '$parse', '$document', function ($timeout, $parse, $document) {
        var CHOSEN_OPTION_WHITELIST, NG_OPTIONS_REGEXP, isEmpty, snakeCase;
        NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))(?:\s+|\s+(.*?))?$/;
        CHOSEN_OPTION_WHITELIST = ['beforeRemove', 'noResultsText', 'allowSingleDeselect', 'disableSearchThreshold', 'disableSearch', 'enableSplitWordSearch', 'inheritSelectClasses', 'maxSelectedOptions', 'placeholderTextMultiple', 'placeholderTextSingle', 'searchContains', 'singleBackstrokeDelete', 'displayDisabledOptions', 'displaySelectedOptions', 'width'];
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
                        // make chosen update the DOM
                        element.trigger('chosen:updated');

                        // override some chosen events for delete confirmations
                        if (attr.multiple && scope.chosenBeforeRemoveHook) {

                            var container = $document.find('#' + element.context.id + '_chosen');

                            if (container) {
                                var searchField = angular.element(container.find('input').first());
                                var searchFieldClone = searchField.clone(true);

                                // take of normal keydown handler, so we can intercept backspace
                                searchField.off('keydown.chosen').on('keydown.chosen', function (evt) {
                                    var stroke = evt.which !== null ? evt.which : evt.keyCode;
                                    if (stroke !== 8) {
                                        // send all other events but backspace to the original handler
                                        searchFieldClone.triggerHandler(evt);
                                    }
                                });

                                // remove event that opens the dropdown when the 'x' is clicked
                                var choices = container.find('ul.chosen-choices').first(),
                                    choicesClone = choices.clone(true);
                                choices.off('click.chosen').on('click.chosen', function(event){
                                    var target = angular.element(event.target);
                                    if (!target.hasClass('search-choice-close')){
                                        choicesClone.triggerHandler(event);
                                    }
                                });

                                // disable the 'close' event, so we can prompt
                                angular.forEach(container.find('a.search-choice-close'), function (aTag) {
                                    var choiceClose = angular.element(aTag);
                                    var choiceCloseClone = choiceClose.clone(true);
                                    choiceClose.off('click').on('click', function () {
                                        scope.chosenBeforeRemoveHook(choiceClose, function () {
                                            $timeout(function () {
                                                choiceCloseClone.click();
                                            });
                                        });
                                    });
                                });
                            }
                        }
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

                        // disable options if the model is disabled
                        if (ngModel._inValueMap) {
                            angular.forEach(element.find('option'), function (option) {
                                // find the matching ngModel object for the select option
                                var ngModelObject = ngModel._inValueMap[option.value];
                                if (ngModelObject) {
                                    // found the model, set disabled
                                    option.disabled = ngModelObject.disabled ? 'disabled' : '';
                                }
                            });
                        }
                        initOrUpdate();
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
                    if (match && match.length > 7) {
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
                                    } else {
                                        // store a map by the 'track by' of all possible options
                                        var trackBy = match[8],
                                            forEachName = match[4] + '.';
                                        if (trackBy) {
                                            // trim trackBy if it starts with 'forEachName.'
                                            if (trackBy.indexOf(forEachName) === 0) {
                                                trackBy = trackBy.substring(forEachName.length);
                                            }
                                            ngModel._inValueMap = {};
                                            var trackByGetter = $parse(trackBy);
                                            angular.forEach(newVal, function (item) {
                                                if (item) {
                                                    ngModel._inValueMap[trackByGetter(item)] = item;
                                                }
                                            });
                                            ngModel.$render();
                                        }
                                    }
                                }
                            });
                        });
                    }

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

