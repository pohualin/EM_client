/*!
 * ngTagsInput v2.0.1
 * http://mbenford.github.io/ngTagsInput
 *
 * Copyright (c) 2013-2014 Michael Benford
 * License: MIT
 *
 * Modified for Emmi Solutions
 *
 * Generated at 2014-04-13 21:25:38 -0300
 */
(function() {
'use strict';

var KEYS = {
    backspace: 8,
    tab: 9,
    enter: 13,
    escape: 27,
    space: 32,
    up: 38,
    down: 40,
    comma: 188
};

function SimplePubSub() {
    var events = {};
    return {
        on: function(names, handler) {
            names.split(' ').forEach(function(name) {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(handler);
            });
            return this;
        },
        trigger: function(name, args) {
            angular.forEach(events[name], function(handler) {
                handler.call(null, args);
            });
            return this;
        }
    };
}

function makeObjectArray(array, key) {
    array = array || [];
    if (array.length > 0 && !angular.isObject(array[0])) {
        array.forEach(function(item, index) {
            array[index] = {};
            array[index][key] = item;
        });
    }
    return array;
}

function findInObjectArray(array, obj, key) {
    var item = null;
    for (var i = 0; i < array.length; i++) {
        // I'm aware of the internationalization issues regarding toLowerCase()
        // but I couldn't come up with a better solution right now
        if (array[i][key].toLowerCase() === obj[key].toLowerCase()) {
            item = array[i];
            break;
        }
    }
    return item;
}

function replaceAll(str, substr, newSubstr) {
    var expression = substr.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    return str.replace(new RegExp(expression, 'gi'), newSubstr);
}

var tagsInput = angular.module('ngTagsInput', []);

/**
 * @ngdoc directive
 * @name tagsInput
 * @module ngTagsInput
 *
 * @description
 * Renders an input box with tag editing support.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} [displayProperty=text] Property to be rendered as the tag label.
 * @param {number=} tabindex Tab order of the control.
 * @param {string=} [placeholder=Add a tag] Placeholder text for the control.
 * @param {number=} [minLength=3] Minimum length for a new tag.
 * @param {number=} maxLength Maximum length allowed for a new tag.
 * @param {number=} minTags Sets minTags validation error key if the number of tags added is less than minTags.
 * @param {number=} maxTags Sets maxTags validation error key if the number of tags added is greater than maxTags.
 * @param {boolean=} [allowLeftoverText=false] Sets leftoverText validation error key if there is any leftover text in
 *                                             the input element when the directive loses focus.
 * @param {string=} [removeTagSymbol=×] Symbol character for the remove tag button.
 * @param {boolean=} [addOnEnter=true] Flag indicating that a new tag will be added on pressing the ENTER key.
 * @param {boolean=} [addOnSpace=false] Flag indicating that a new tag will be added on pressing the SPACE key.
 * @param {boolean=} [addOnComma=true] Flag indicating that a new tag will be added on pressing the COMMA key.
 * @param {boolean=} [addOnBlur=true] Flag indicating that a new tag will be added when the input field loses focus.
 * @param {boolean=} [replaceSpacesWithDashes=true] Flag indicating that spaces will be replaced with dashes.
 * @param {string=} [allowedTagsPattern=.+] Regular expression that determines whether a new tag is valid.
 * @param {boolean=} [enableEditingLastTag=false] Flag indicating that the last tag will be moved back into
 *                                                the new tag input box instead of being removed when the backspace key
 *                                                is pressed and the input box is empty.
 * @param {expression} onTagAdded Expression to evaluate upon adding a new tag. The new tag is available as $tag.
 * @param {expression} onTagRemoved Expression to evaluate upon removing an existing tag. The removed tag is available as $tag.
 * @param {expression} onTagSelected Expression to evaluate upon selecting a tag. The selected tag is available as $tag.
 */
tagsInput.directive('tagsInput', ['$timeout','$document','tagsInputConfig','focus', function($timeout, $document, tagsInputConfig, focus) {
    function TagList(options, events) {
        var self = {}, getTagText, setTagText, tagIsValid;

        getTagText = function(tag) {
            return tag[options.displayProperty];
        };

        setTagText = function(tag, text) {
            tag[options.displayProperty] = text;
        };

        tagIsValid = function(tag) {
            var tagText = getTagText(tag);

            return tagText.length >= options.minLength &&
                   tagText.length <= (options.maxLength || tagText.length) &&
                   options.allowedTagsPattern.test(tagText);// &&
                   //!findInObjectArray(self.items, tag, options.displayProperty);
        };

        self.items = [];
        self.selected = null;

        self.addText = function(text) {
            var tag = {};
            setTagText(tag, text);
            return self.add(tag);
        };

        self.add = function(tag) {
            var tagText = getTagText(tag).trim();

            if (options.replaceSpacesWithDashes) {
                tagText = tagText.replace(/\s/g, '-');
            }

            setTagText(tag, tagText);

            if (tagIsValid(tag)) {
                self.items.push(tag);
                events.trigger('tag-added', { $tag: tag });
            }
            else {
                events.trigger('invalid-tag', { $tag: tag });
            }

            return tag;
        };

        self.remove = function(index) {
            var tag = self.items.splice(index, 1)[0];
            events.trigger('tag-removed', { $tag: tag });
            self.selected = null;
            return tag;
        };

        self.removeLast = function() {
            var tag, lastTagIndex = self.items.length - 1;

            if (options.enableEditingLastTag || self.selected) {
                self.selected = null;
                tag = self.remove(lastTagIndex);
            }
            else if (!self.selected) {
                self.selected = self.items[lastTagIndex];
            }

            return tag;
        };

        self.select = function(index) {
            var tag = self.items[index];
            if (self.selected === index) {
                tag.editMode = true;
                focus('editMode');
            } else {
                tag.editMode = false;
                self.selected = index;
                events.trigger('tag-selected', { $tag: tag });
            }
            return tag;
        };


        self.saveTag = function(tag) {
            if (self.selected !== null) {
                var tagText = getTagText(tag).trim();

                if (options.replaceSpacesWithDashes) {
                    tagText = tagText.replace(/\s/g, '-');
                }

                setTagText(tag, tagText);

                tag.editMode = false;
                self.selected = null;
                events.trigger('tag-edited', { $tag: tag });
            }

            return tag;
        };

        return self;
    }

    return {
        restrict: 'AE',
        require: 'ngModel',
        scope: {
            tags: '=ngModel',
            onTagAdded: '&',
            onTagRemoved: '&',
            onTagSelected: '&'
        },
        replace: false,
        transclude: true,
        templateUrl: 'partials/common/directives/tags-input/tags-input.tpl.html',
        controller: ['$scope','$attrs','$element', function($scope, $attrs, $element) {
            tagsInputConfig.load('tagsInput', $scope, $attrs, {
                placeholder: [String, 'Add a tag'],
                tabindex: [Number],
                removeTagSymbol: [String, String.fromCharCode(215)],
                replaceSpacesWithDashes: [Boolean, true],
                minLength: [Number, 3],
                maxLength: [Number],
                addOnEnter: [Boolean, true],
                addOnSpace: [Boolean, false],
                addOnComma: [Boolean, true],
                addOnBlur: [Boolean, true],
                allowedTagsPattern: [RegExp, /.+/],
                enableEditingLastTag: [Boolean, false],
                minTags: [Number],
                maxTags: [Number],
                displayProperty: [String, 'text'],
                allowLeftoverText: [Boolean, false]
            });

            $scope.events = new SimplePubSub();
            $scope.tagList = new TagList($scope.options, $scope.events);

        }],
        link: function(scope, element, attrs, ngModelCtrl) {
            var hotkeys = [KEYS.enter, KEYS.comma, KEYS.space, KEYS.backspace],
                tagList = scope.tagList,
                events = scope.events,
                options = scope.options,
                input = element.find('input.input'),
                getInputText;

            getInputText = function(){
                if (scope.tagInputForm.tagInput.$valid){
                    return scope.newTag.text;
                } else {
                    return scope.tagInputForm.tagInput.$viewValue;
                }
            };

            events
                .on('tag-added', scope.onTagAdded)
                .on('tag-removed', scope.onTagRemoved)
                .on('tag-selected', scope.onTagSelected)
                .on('tag-added', function() {
                    scope.newTag.text = '';
                })
                .on('tag-added tag-removed', function() {
                    ngModelCtrl.$setViewValue(scope.tags);
                })
                .on('tag-edited', function() {
                    $timeout(function() {
                        input[0].focus();
                    });
                })
                .on('invalid-tag', function() {
                    scope.newTag.invalid = true;
                })
                .on('input-change', function() {
                    tagList.selected = null;
                    scope.newTag.invalid = null;
                })
                .on('input-focus', function() {
                    ngModelCtrl.$setValidity('leftoverText', true);
                })
                .on('input-blur', function() {
                    if (options.addOnBlur) {
                        tagList.addText(getInputText());
                    }

                    ngModelCtrl.$setValidity('leftoverText', options.allowLeftoverText ? true : !getInputText());
                });

            scope.newTag = { text: '', invalid: null };

            scope.getDisplayText = function(tag) {
                return tag[options.displayProperty].trim();
            };

            scope.track = function(tag) {
                return tag[options.displayProperty];
            };

            scope.newTagChange = function() {
                events.trigger('input-change', scope.newTag.text);
            };

            scope.$watch('tags', function(value) {
                scope.tags = makeObjectArray(value, options.displayProperty);
                tagList.items = scope.tags;
            });

            scope.$watch('tags.length', function(value) {
                ngModelCtrl.$setValidity('maxTags', angular.isUndefined(options.maxTags) || value <= options.maxTags);
                ngModelCtrl.$setValidity('minTags', angular.isUndefined(options.minTags) || value >= options.minTags);
            });

            input
                .on('keydown', function(e) {
                    // This hack is needed because jqLite doesn't implement stopImmediatePropagation properly.
                    // I've sent a PR to Angular addressing this issue and hopefully it'll be fixed soon.
                    // https://github.com/angular/angular.js/pull/4833
                    if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) {
                        return;
                    }

                    var key = e.keyCode,
                        isModifier = e.shiftKey || e.altKey || e.ctrlKey || e.metaKey,
                        addKeys = {},
                        shouldAdd, shouldRemove;

                    if (isModifier || hotkeys.indexOf(key) === -1) {
                        return;
                    }

                    addKeys[KEYS.enter] = options.addOnEnter;
                    addKeys[KEYS.comma] = options.addOnComma;
                    addKeys[KEYS.space] = options.addOnSpace;

                    shouldAdd = addKeys[key];
                    shouldRemove = !shouldAdd && key === KEYS.backspace && getInputText().length === 0;

                    if (shouldAdd) {
                        tagList.addText(getInputText());

                        scope.$apply();
                        e.preventDefault();
                    }
                    else if (shouldRemove) {
                        var tag;

                        if (tagList.selected !== null) {
                            tag = tagList.remove(tagList.selected);
                            tagList.selected = null;
                        } else {
                            if (options.enableEditingLastTag || tagList.selected !== null) {
                                tagList.selected = null;
                                tag = tagList.remove(tagList.items.length - 1);
                            } else if (!tagList.selected) {
                                tagList.selected = tagList.items.length - 1;
                            }
                            if (tag && options.enableEditingLastTag) {
                                scope.newTag.text = tag[options.displayProperty];
                            }
                        }
                        scope.$apply();
                        e.preventDefault();
                    }
                })
                .on('focus', function() {
                    if (scope.hasFocus) {
                        return;
                    }
                    scope.hasFocus = true;
                    events.trigger('input-focus');
                    scope.$apply();
                })
                .on('blur', function() {
                    $timeout(function() {
                        var activeElement = $document.prop('activeElement'),
                            lostFocusToBrowserWindow = activeElement === input[0],
                            lostFocusToChildElement = element[0].contains(activeElement);

                        if (lostFocusToBrowserWindow || !lostFocusToChildElement) {
                            scope.hasFocus = false;
                            events.trigger('input-blur');
                        }
                    });
                });

        }
    };
}]);

/**
 * @ngdoc directive
 * @name tiTranscludeAppend
 * @module ngTagsInput
 *
 * @description
 * Re-creates the old behavior of ng-transclude. Used internally by tagsInput directive.
 */
tagsInput.directive('tiTranscludeAppend', function() {
    return function(scope, element, attrs, ctrl, transcludeFn) {
        transcludeFn(function(clone) {
            element.append(clone);
        });
    };
});

/**
 * @ngdoc directive
 * @name tiAutosize
 * @module ngTagsInput
 *
 * @description
 * Automatically sets the input's width so its content is always visible. Used internally by tagsInput directive.
 */
tagsInput.directive('tiAutosize', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            var THRESHOLD = 3,
                span, resize;

            span = angular.element('<span class="input"></span>');
            span.css('display', 'none')
                .css('visibility', 'hidden')
                .css('width', 'auto')
                .css('white-space', 'pre');

            element.parent().append(span);

            resize = function(originalValue) {
                var value = originalValue, width;

                if (angular.isString(value) && value.length === 0) {
                    value = attrs.placeholder;
                }

                if (value) {
                    span.text(value);
                    span.css('display', '');
                    width = span.prop('offsetWidth');
                    span.css('display', 'none');
                }

                element.css('width', width ? width + THRESHOLD + 'px' : '');

                return originalValue;
            };

            ctrl.$parsers.unshift(resize);
            ctrl.$formatters.unshift(resize);

            attrs.$observe('placeholder', function(value) {
                if (!ctrl.$modelValue) {
                    resize(value);
                }
            });
        }
    };
});

/**
 * @ngdoc service
 * @name tagsInputConfig
 * @module ngTagsInput
 *
 * @description
 * Sets global configuration settings for both tagsInput and autoComplete directives. It's also used internally to parse and
 * initialize options from HTML attributes.
 */
tagsInput.provider('tagsInputConfig', function() {
    var globalDefaults = {}, interpolationStatus = {};

    /**
     * @ngdoc method
     * @name setDefaults
     * @description Sets the default configuration option for a directive.
     * @methodOf tagsInputConfig
     *
     * @param {string} directive Name of the directive to be configured. Must be either 'tagsInput' or 'autoComplete'.
     * @param {object} defaults Object containing options and their values.
     *
     * @returns {object} The service itself for chaining purposes.
     */
    this.setDefaults = function(directive, defaults) {
        globalDefaults[directive] = defaults;
        return this;
    };

    /***
     * @ngdoc method
     * @name setActiveInterpolation
     * @description Sets active interpolation for a set of options.
     * @methodOf tagsInputConfig
     *
     * @param {string} directive Name of the directive to be configured. Must be either 'tagsInput' or 'autoComplete'.
     * @param {object} options Object containing which options should have interpolation turned on at all times.
     *
     * @returns {object} The service itself for chaining purposes.
     */
    this.setActiveInterpolation = function(directive, options) {
        interpolationStatus[directive] = options;
        return this;
    };

    this.$get = ['$interpolate', function($interpolate) {
        var converters = {};
        converters[String] = function(value) { return value; };
        converters[Number] = function(value) { return parseInt(value, 10); };
        converters[Boolean] = function(value) { return value.toLowerCase() === 'true'; };
        converters[RegExp] = function(value) { return new RegExp(value); };

        return {
            load: function(directive, scope, attrs, options) {
                scope.options = {};

                angular.forEach(options, function(value, key) {
                    var type, localDefault, converter, getDefault, updateValue;

                    type = value[0];
                    localDefault = value[1];
                    converter = converters[type];

                    getDefault = function() {
                        var globalValue = globalDefaults[directive] && globalDefaults[directive][key];
                        return angular.isDefined(globalValue) ? globalValue : localDefault;
                    };

                    updateValue = function(value) {
                        scope.options[key] = value ? converter(value) : getDefault();
                    };

                    if (interpolationStatus[directive] && interpolationStatus[directive][key]) {
                        attrs.$observe(key, function(value) {
                            updateValue(value);
                        });
                    }
                    else {
                        updateValue(attrs[key] && $interpolate(attrs[key])(scope.$parent));
                    }
                });
            }
        };
    }];
});

}());
