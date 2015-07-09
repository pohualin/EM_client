'use strict';

angular.module('emmi.salesforceForm', [])
    .service('SalesforceCase', ['$http', '$q', 'UriTemplate', 'arrays',
        function ($http, $q, link, arrays) {
            return {
                /**
                 * Loads all possible case types for a particular resource
                 *
                 * @param forResource on which the link to createCase exists
                 * @returns {*}
                 */
                getCaseTypes: function (forResource) {
                    // TODO: hook up to API call
                    return $http.get(link.create(forResource.link.createCase).stringify())
                        .then(function (response) {
                            var ret = response.data;
                            angular.forEach(ret.type, function (type) {
                                type.link = arrays.convertToObject('rel', 'href',
                                    type.link);
                            });
                            return ret;
                        });
                },
                /**
                 * Loads a new form from a type
                 *
                 * @param typeResource on which to request the form
                 * @returns {*}
                 */
                getFormData: function (typeResource) {
                    return $http.get(link.create(typeResource.link.blankForm).stringify()).then(function (response) {
                        return response.data;
                    });
                },
                /**
                 * Saves a case
                 * @param caseForm on which to find the save link as well as the entity to save
                 * @returns {*}
                 */
                saveCase: function (caseForm) {
                    return $http.post(link.create(caseForm.link.save).stringify(), caseForm.entity)
                        .then(function (response) {
                            return response.data;
                        });
                },
                getReferenceFieldData: function (href, searchString) {
                    // TODO: hook up to API call
                    // return $http.get(UriTemplate.create(href).stringify({q: searchString}))
                    //     .then(function (response) {
                    //         return response.data;
                    //     });
                    var deferred = $q.defer();
                    var d = {
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
                    deferred.resolve(d);
                    return deferred.promise;
                }
            };
        }])
    .directive('salesforceForm', ['SalesforceCase',
        function (SalesforceCase) {
            return {
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                templateUrl: 'admin-facing/partials/common/directives/salesforce-form/salesforce-form.tpl.html',
                transclude: true,
                scope: {
                    pageCaseType: '=',
                    caseForResource: '=',
                    onSaveSuccess: '=',
                    onCancel: '='
                },
                controller: function ($scope, $element, $attrs, $transclude) {

                    $scope.getTypeData = function () {
                        SalesforceCase.getFormData($scope.caseType).then(function (response) {
                            $scope.form = response;
                        });
                    };

                    $scope.onChange = function (field) {
                        console.log(field);
                        if (field.values.requiredWhenChosen && field.values.requiredWhenChosen.length) {
                            field.chainedField = true;
                        } else {
                            field.chainedField = false;
                        }
                    };

                    $scope.referenceSearch = function (q, field) {
                        console.log(field);
                        // TODO: pass query and field link to service call
                        SalesforceCase.getReferenceFieldData().then(function (response) {
                            console.log(response);
                            field.searchResults = response;
                        });
                    };

                    $scope.save = function (caseForm) {
                        $scope.whenSaving = true;
                        caseForm.submitted = true;
                        console.log('Case Form Valid', caseForm.$valid);
                        SalesforceCase.saveCase($scope.form).then(
                            function ok(response) {
                                console.log('Save successful', response.id);
                                $scope.onSaveSuccess(response.id);
                            },
                            function err(response) {
                                console.log('Save failed', response.errorMessage);
                            }
                        ).finally(function () {
                                $scope.whenSaving = false;
                            });
                    };

                    $scope.cancel = function () {
                        $scope.onCancel();
                    };

                    $scope.referenceSelect = function (item, field) {
                        console.log(item);
                        field.referenceId = item.id;
                        field.referenceName = item.name;
                        field.searchQuery = item.name;
                    };

                    function init() {
                        SalesforceCase.getCaseTypes($scope.caseForResource).then(function (response) {
                            $scope.caseTypes = response.type;
                            // TODO: loop over the types and find the matching ‘page’
                            // $scope.caseType = $scope.caseTypes[0]; // use index so we have the whole object
                        });
                    }

                    init();
                },
                link: function (scope, element, attrs, controller) {

                }
            };
        }])
;
