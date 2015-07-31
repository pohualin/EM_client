(function (angular) {
    'use strict';

    angular.module('emmi.momentStrap', ['mgcrea.ngStrap.helpers.dateParser'])

        .config(function ($provide) {

            /**
             * Wraps the existing $dateParser helper used by angular strap
             */
            $provide.decorator('$dateParser', function ($delegate, moment) {
                return function (config) {
                    var dateParser = $delegate(config),
                        isValidFn = dateParser.isValid,
                        parseFn = dateParser.parse,
                        getDateForAttributeFn = dateParser.getDateForAttribute,
                        getTimeForAttributeFn = dateParser.getTimeForAttribute,
                        daylightSavingAdjustFn = dateParser.daylightSavingAdjust;

                    // delegate to existing function
                    dateParser.isValid = function (date) {
                        return isValidFn(date);
                    };

                    /**
                     * Allows the parser to be more flexible when the user enters dates
                     *
                     * @param value the date string
                     * @param baseDate used by the default parser
                     * @param format sometimes passed to this function
                     * @returns {*} a date or false when bad
                     */
                    dateParser.parse = function (value, baseDate, format) {
                        format = format || dateParser.$format; // use the configured format if not passed
                        var ret = parseFn(value, baseDate, format);
                        if (!ret) {
                            // try to parse with moment
                            ret = moment(value, ['MM-DD-YYYY', 'YYYY-MM-DD', 'MMDDYYYY'], true);
                            ret = ret.isValid() ? ret.toDate() : false;
                        }
                        return ret;
                    };

                    // delegate to existing function
                    dateParser.getDateForAttribute = function (key, value) {
                        return getDateForAttributeFn(key, value);
                    };

                    // delegate to existing function
                    dateParser.getTimeForAttribute = function (key, value) {
                        return getTimeForAttributeFn(key, value);
                    };

                    // delegate to existing function
                    dateParser.daylightSavingAdjust = function (date) {
                        return daylightSavingAdjustFn(date);
                    };

                    return dateParser;
                };
            });
        });
})(window.angular);
