(function (angular) {
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
                    /**
                     * Look up SF objects by their name
                     * @param caseForm for which to lookup
                     * @param searchString for the name
                     * @param field the reference field
                     * @returns {*}
                     */
                    getReferenceFieldData: function (caseForm, searchString, field) {
                        return $http.get(link.create(caseForm.link.lookup).stringify({
                            q: searchString,
                            size: 50,
                            type: field.referenceTypes
                        })).then(function (response) {
                            return response.data;
                        });
                    }
                };
            }])
        .directive('salesforceForm', ['SalesforceCase', '$alert', 'focus', '$timeout',
            function (SalesforceCase, $alert, focus, $timeout) {
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
                    controller: function ($scope) {

                        $scope.getTypeData = function () {
                            SalesforceCase.getFormData($scope.caseType).then(function (response) {
                                $scope.form = response;
                            });
                        };

                        $scope.onChange = function (field) {
                            field.chainedField = !!(field.value.requiredWhenChosen && field.value.requiredWhenChosen.length);
                        };

                        $scope.referenceSearch = function (q, field) {
                            SalesforceCase.getReferenceFieldData($scope.form, q, field).then(function (response) {
                                field.searchResults = response;
                            });
                        };

                        $scope.save = function (caseForm) {
                            $scope.whenSaving = true;
                            caseForm.submitted = true;
                            SalesforceCase.saveCase($scope.form).then(
                                function ok(response) {
                                    $scope.onSaveSuccess(response.id);
                                },
                                function err(response) {
                                    if (!$scope.errorAlert) {
                                        $scope.errorAlert = $alert({
                                            container: '#case-form-messages-container',
                                            content: response.data.errorMessage.join(' '),
                                            type: 'danger',
                                            placement: '',
                                            duration: false,
                                            dismissable: false
                                        });
                                    }
                                }
                            ).finally(function () {
                                    $scope.whenSaving = false;
                                });
                        };

                        $scope.cancel = function () {
                            $scope.onCancel();
                        };

                        $scope.referenceSelect = function (item, field) {
                            if (item) {
                                field.referenceId = item.id;
                                field.referenceName = item.name;
                                if (item.name) {
                                    field.searchQuery = item.name;
                                }
                            }
                            return true; // so the type-ahead selection menu closes
                        };

                        function init() {
                            SalesforceCase.getCaseTypes($scope.caseForResource).then(function (response) {
                                $scope.caseTypes = response.type;
                                $timeout(function () {
                                    focus('caseType');
                                });


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
})(window.angular);
