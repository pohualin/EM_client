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
                     * @param account to hook into the account field
                     * @returns {*}
                     */
                    saveCase: function (caseForm, account) {
                        // put the account id reference in the correct spot
                        angular.forEach(caseForm.entity.sections, function (section) {
                            angular.forEach(section.fields, function (field) {
                                if (field.type === 'REFERENCE' && field.name === 'AccountId') {
                                    field.referenceId = account.id;
                                }
                            });
                        });
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
        .directive('salesforceForm', ['SalesforceCase', '$alert', '$timeout',
            function (SalesforceCase, $alert, $timeout) {
                return {
                    restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                    templateUrl: 'admin-facing/partials/common/directives/salesforce-form/salesforce-form.tpl.html',
                    transclude: true,
                    scope: {
                        caseForResource: '=',
                        onSaveSuccess: '=',
                        onCancel: '=',
                        defaultCaseType: '=',
                        defaultCaseDescription: '=',
                        defaultUserId: '=',
                        defaultWebName: '=',
                        defaultEmail: '='
                    },
                    controller: function ($scope) {

                        $scope.getTypeData = function () {
                            SalesforceCase.getFormData($scope.caseType).then(function (response) {
                                $scope.form = response;

                                // populate the description if it has been passed in
                                if ($scope.defaultCaseDescription || $scope.defaultUserId ||
                                    $scope.defaultWebName || $scope.defaultEmail) {
                                    angular.forEach($scope.form.entity.sections, function (section) {
                                        angular.forEach(section.fields, function (field) {
                                            if (field.name === 'Description') {
                                                field.value = $scope.defaultCaseDescription;
                                            } else if (field.name === 'User_ID__c') {
                                                field.value = $scope.defaultUserId;
                                            } else if (field.name === 'SuppliedName') {
                                                field.value = $scope.defaultWebName;
                                            } else if (field.name === 'SuppliedEmail') {
                                                field.value = $scope.defaultEmail;
                                            }
                                        });
                                    });
                                }
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
                            caseForm.submitted = true;
                            caseForm.$setValidity('backEndError', true);
                            if (caseForm.$valid) {
                                $scope.whenSaving = true;
                                SalesforceCase.saveCase($scope.form, $scope.account).then(
                                    function ok(response) {
                                        $scope.onSaveSuccess(response.id);
                                    },
                                    function err(response) {
                                        caseForm.$setValidity('backEndError', false);
                                        $scope.showError(response.data.errorMessage ? response.data.errorMessage.join(' ') :
                                            'Unknown error saving case.');
                                    }
                                ).finally(function () {
                                        $scope.whenSaving = false;
                                    });
                            } else {
                                $scope.showError('Please correct the below information.');
                            }
                        };

                        $scope.showError = function (message) {
                            if ($scope.errorAlert) {
                                $scope.errorAlert.destroy();
                            }
                            $scope.errorAlert = $alert({
                                container: '#case-form-messages-container',
                                content: message,
                                type: 'danger',
                                duration: false,
                                dismissable: false
                            });
                        };

                        $scope.cancel = function () {
                            $scope.onCancel();
                        };
                        $scope.continue = function () {
                            $scope.continuePressed = true;
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
                                $scope.possibleAccounts = response.account;

                                // if there is only one possible account, choose it
                                angular.forEach($scope.possibleAccounts, function (possibleAccount) {
                                    if (possibleAccount.client) {
                                        $scope.account = possibleAccount;
                                    }
                                });

                                // choose a default case type if a match is found
                                angular.forEach($scope.caseTypes, function (caseType) {
                                    if (caseType.entity.emmiCaseType === $scope.defaultCaseType) {
                                        $scope.caseType = caseType;
                                        $scope.getTypeData();
                                    }
                                });

                                $timeout(function () {
                                    $scope.focusOnAccount();
                                });
                            });
                        }

                        init();
                    },
                    link: function (scope, element, attrs, controller) {

                    }
                };
            }])

    /**
     * Ensures that the pick list values are not null.
     */
        .directive('pickListValue', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$isEmpty = function (value) {
                        return !angular.isDefined(value) || !angular.isDefined(value.value);
                    };
                }
            };
        })
    ;
})(window.angular);
