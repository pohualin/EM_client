/* global angular, console */
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
 * added scope function hooks for activate, open and close using data-chosen-activate, data-chosen-open,
 * and data-chosen-close
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
        CHOSEN_OPTION_WHITELIST = ['beforeRemove',
            'noResultsText',
            'allowSingleDeselect',
            'disableSearchThreshold',
            'disableSearch',
            'enableSplitWordSearch',
            'inheritSelectClasses',
            'maxSelectedOptions',
            'placeholderTextMultiple',
            'placeholderTextSingle',
            'searchContains',
            'singleBackstrokeDelete',
            'displayDisabledOptions',
            'displaySelectedOptions',
            'width',
            'includeGroupLabelInSelected'];
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

        /**
         * Allows for angular to do something prior to a delete event
         * initiated by chosen components. E.g. clicking on the 'x' of a selected option.
         */
        var addBeforeDeleteHook = function (element, attr, scope) {

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
                    choices.off('click.chosen').on('click.chosen', function (event) {
                        var target = angular.element(event.target);
                        if (!target.hasClass('search-choice-close')) {
                            choicesClone.triggerHandler(event);
                        }
                    });

                    // disable the 'close' event, so we can prompt
                    angular.forEach(container.find('a.search-choice-close'), function (aTag) {
                        var choiceClose = angular.element(aTag);
                        if (!aTag._choiceCloseClone) {
                            // only clone the 'x' once per element
                            aTag._choiceCloseClone = choiceClose.clone(true);
                        }
                        choiceClose.off('click').on('click', function () {
                            scope.chosenBeforeRemoveHook(choiceClose, function () {
                                $timeout(function () {
                                    aTag._choiceCloseClone.click();
                                    aTag.parentElement.remove();
                                });
                            });
                        });
                    });
                }
            }
        };

        /**
         * Ensures that the model.disabled attribute is pushed to
         * the corresponding chosen option
         *
         * @returns {boolean} true when there has been a change
         */
        var synchronizeDisabledAttribute = function (ngModel, element) {
            var changed = false;
            if (ngModel && ngModel._inValueMap) {
                angular.forEach(element.find('option'), function (option) {
                    // find the matching ngModel object for the select option
                    var ngModelObject = ngModel._inValueMap[option.value];
                    if (ngModelObject) {
                        // found the model, set disabled
                        var before = option.disabled;
                        option.disabled = ngModelObject.disabled ? 'disabled' : '';
                        if (!angular.equals(before, option.disabled)) {
                            changed = true;
                        }
                    }
                });
            }
            return changed;
        };

        /**
         * Ensures that the chosen data model and angular data model are the
         * same size
         *
         * @param attr attributes on the html elements
         * @param scope of the directive
         * @param chosen the javascript component
         * @returns {boolean} true if they are out of sync, false if they are in-sync
         */
        var determineIfAngularIsDifferentThanChosen = function (attr, scope, chosen) {

            var selectedModels = $parse(attr.ngModel)(scope),
                chosenCount = 0,
                angularCount = (selectedModels && selectedModels.length > 0) ? selectedModels.length : -1;

            if (chosen && angularCount !== -1) {
                // check the chosen side only if the angular side has some data
                var resultsData = 'results_data';
                angular.forEach(chosen[resultsData], function (data) {
                    if (data.selected) {
                        chosenCount++;
                    }
                });
            }
            return angularCount !== chosenCount;
        };
        var eventHasPriority;

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
                initOrUpdate = function () {
                    if (chosen) {
                        // make chosen update the DOM
                        element.trigger('chosen:updated');
                    } else {
                        // create chosen rendering
                        chosen = element.chosen(options).data('chosen');
                    }
                };

                removeEmptyMessage = function () {
                    empty = false;
                    return element.attr('data-placeholder', defaultText);
                };

                disableWithMessage = function () {
                    empty = true;
                    return element.attr('data-placeholder', defaultText).attr('disabled', true).trigger('chosen:updated');
                };
                if (ngModel) {
                    origRender = ngModel.$render;
                    ngModel.$render = function (forceChosenRefresh) {
                        origRender();

                        var resultsNeedSync = determineIfAngularIsDifferentThanChosen(attr, scope, chosen);

                        // set the disabled attributes on the chosen side
                        var disabledHasChanged = synchronizeDisabledAttribute(ngModel, element);

                        if (forceChosenRefresh || disabledHasChanged || resultsNeedSync) {
                            // the chosen side needs to be updated due to changes
                            initOrUpdate();
                        }

                        // ensure the 'before delete' hooks are attached
                        addBeforeDeleteHook(element, attr, scope);
                    };
                    if (attr.multiple) {
                        scope.$watch(function () {
                            return ngModel.$viewValue;
                        }, function () {
                            ngModel.$render(false);
                        }, function (before, after) {
                            return before.length === after.length;
                        });
                    }
                    if (attr.chosenClose){
                       scope[attr.chosenClose] = function(){
                           $timeout(function (){
                               element.trigger('chosen:close');
                           });
                       };
                    }
                    if (attr.chosenOpen){
                        scope[attr.chosenOpen] = function(){
                            $timeout(function (){
                                element.trigger('chosen:open');
                            });
                        };
                    }
                    if (attr.chosenActivate){
                        scope[attr.chosenActivate] = function(){
                            $timeout(function (){
                                element.trigger('chosen:activate');
                            });
                        };
                    }
                } else {
                    initOrUpdate();
                }
                attr.$observe('disabled', function (changeValue) {
                    if (angular.isDefined(changeValue)) {
                        ngModel.disabledBeforeLoad = changeValue;
                        ngModel.$render(true);
                    }
                });
                attr.$observe('placeholder', function (changeValue) {
                    if (angular.isDefined(changeValue)) {
                        defaultText = changeValue;
                        if (empty) {
                            disableWithMessage();
                        } else {
                            return element.trigger('chosen:updated');
                        }

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
                                            // all possible values are loaded, re-sync
                                            ngModel.$render(true);
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

