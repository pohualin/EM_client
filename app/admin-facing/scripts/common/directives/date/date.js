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
;
