'use strict';

angular.module('emmi.salesforceForm', [])
    .directive('salesforceForm', ['$rootScope','$window', 'Session', '$location', '$anchorScroll',
        function ($rootScope, $window, Session, $location, $anchorScroll) {
        return {
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'admin-facing/partials/common/directives/salesforce-form/salesforce-form.tpl.html',
            transclude: true,
            scope: {
                formFields: '='
            },
            controller: function ($scope, $element, $attrs, $transclude) {
                $scope.onChange = function(field) {
                    console.log(field);
                    if (field.values.requiredWhenChosen && field.values.requiredWhenChosen.length) {
                        field.chainedField = true;
                    } else {
                        field.chainedField = false;
                    }
                };
                $scope.referenceSearch = function (q, field) {
                    console.log(field);
                    field.searchResults = {
                        'complete': 'false',
                        'content': [
                            {
                                'id': '0035000000Xu5FxAAJ',
                                'name': 'Anissa Mattison'
                            },
                            {
                                'id': '0035000000PCLmFAAX',
                                'name': 'Anita Matthews'
                            },
                            {
                                'id': '00350000021ZaDYAA0',
                                'name': 'Anita Mattingly'
                            },
                            {
                                'id': '0035000000WkSf4AAF',
                                'name': 'Annette Ohlmann Mattingly'
                            },
                            {
                                'id': '0035000000KC9BjAAL',
                                'name': 'Arwind Koimattur'
                            }
                        ]
                    };
                };
                $scope.referenceSelect = function (item, field) {
                    console.log(item);
                    field.referenceId = item.id;
                    field.referenceName = item.name;
                    field.searchQuery = item.name;
                };
            },
            link: function (scope, element, attrs, controller) {

            }
        };
    }])
;
