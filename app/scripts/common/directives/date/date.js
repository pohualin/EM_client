'use strict';

angular.module('emmiManager')

    .factory('dateFunctions', function(){
        return {
            getDateDifference: function (fromDate, toDate) {
                return Date.parse(toDate) - Date.parse(fromDate);
            },
            isValidDate: function (dateStr) {
                return dateStr && !isNaN(Date.parse(dateStr));
            },
            isValidDateRange: function (fromDate, toDate, numDays) {
                if (fromDate === '' || toDate === '') {
                    return true;
                }
                if (this.isValidDate(fromDate) === false) {
                    return false;
                }
                if (this.isValidDate(toDate) === true) {
                    var days = this.getDateDifference(fromDate, toDate);
                    if (days < numDays) {
                        return false;
                    }

                }
                return true;
            }
        };
    })

    .filter('minusDays', ['moment', function (moment) {
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

    .directive('dateLowerThan', ['$filter', 'dateFunctions', function ($filter, df) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var validateDateRange = function (inputValue) {
                    var fromDate = $filter('date')(inputValue, 'short');
                    var toDate = $filter('date')(attrs.dateLowerThan, 'short');
                    var isValid = df.isValidDateRange(fromDate, toDate, attrs.numDays);
                    ctrl.$setValidity('dateLowerThan', isValid);
                    return inputValue;
                };

                ctrl.$parsers.unshift(validateDateRange);
                ctrl.$formatters.push(validateDateRange);
                attrs.$observe('dateLowerThan', function () {
                    validateDateRange(ctrl.$viewValue);
                });
            }
        };
    }])

    .directive('dateGreaterThan', ['$filter', 'dateFunctions', function ($filter, df) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var validateDateRange = function (inputValue) {
                    var fromDate = $filter('date')(attrs.dateGreaterThan, 'short');
                    var toDate = $filter('date')(inputValue, 'short');
                    var isValid = df.isValidDateRange(fromDate, toDate, attrs.numDays);
                    ctrl.$setValidity('dateGreaterThan', isValid);
                    return inputValue;
                };

                ctrl.$parsers.unshift(validateDateRange);
                ctrl.$formatters.push(validateDateRange);
                attrs.$observe('dateGreaterThan', function () {
                    validateDateRange(ctrl.$viewValue);
                });
            }
        };
    }])
;