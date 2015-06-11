(function (angular) {

    'use strict';
    angular.module('emmiManager')

    /**
     * This service is responsible fetch operations for Patient resources across clients
     */
        .service('PatientSupportSearchService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Session',
            function ($filter, $q, $http, UriTemplate, CommonService, Session) {

                var phoneRegex = /(\+*\d+)*([ |\(])*(\d{3})[^\d]*(\d{3})[^\d]*(\d{4})/g,
                    accessCodeRegex = /1[0-9]{10}|2[0-9]{10}/g,
                    emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

                /**
                 * Replace all occurrences of a string within a string
                 * @param str in which to search
                 * @param find what to replace/search for within str
                 * @param replace what to replace what was found
                 * @returns {*}
                 */
                function replaceAll(str, find, replace) {
                    var i = str.indexOf(find);
                    if (i > -1) {
                        str = str.replace(find, replace);
                        i = i + replace.length;
                        var st2 = str.substring(i);
                        if (st2.indexOf(find) > -1) {
                            str = str.substring(0, i) + replaceAll(st2, find, replace);
                        }
                    }
                    return str;
                }

                /**
                 * Returns all matches
                 * @param input to find the matches within
                 * @param regex matching algorithm
                 * @returns {Array}
                 */
                function extract(input, regex) {
                    var ret = [];
                    if (regex.test(input)) {
                        var matches = input.match(regex);
                        for (var match in matches) {
                            if (matches.hasOwnProperty(match)) {
                                ret.push(matches[match]);
                            }
                        }
                    }
                    return ret;
                }

                return {

                    /**
                     * Call server to get a list of UserClient
                     */
                    list: function (query, sort) {
                        // access codes first, since phone number regex would match access codes
                        var accessCodes = extract(query, accessCodeRegex);
                        angular.forEach(accessCodes, function (accessCode) {
                            query = replaceAll(query, accessCode, '');
                        });

                        // phone numbers
                        var phoneNumbers = extract(query, phoneRegex);
                        angular.forEach(phoneNumbers, function (phoneNumber) {
                            query = replaceAll(query, phoneNumber, '');
                        });

                        // email addresses
                        var emailAddresses = extract(query, emailRegex);
                        angular.forEach(emailAddresses, function (emailAddress) {
                            query = replaceAll(query, emailAddress, '');
                        });

                        return $http.get(UriTemplate.create(Session.link.patients).stringify({
                            name: query,
                            phone: phoneNumbers,
                            accessCode: accessCodes,
                            email: emailAddresses,
                            sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : 'lastName'
                        })).then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                    },

                    /**
                     * Call server to fetch next batch of UserClient
                     */
                    fetchPage: function (href) {
                        return $http.get(UriTemplate.create(href).stringify())
                            .then(function (response) {
                                CommonService.convertPageContentLinks(response);
                                return response.data;
                            });
                    }
                };
            }]);
})(window.angular);
