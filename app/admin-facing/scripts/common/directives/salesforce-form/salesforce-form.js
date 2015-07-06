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
                };
            },
            link: function (scope, element, attrs, controller) {

            }
        };
    }])
;
