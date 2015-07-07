'use strict';

angular.module('emmi.salesforceForm', [])
    .service('SalesforceCase', ['$http', '$q',
        function ($http, $q) {
        return {
            getCaseTypes: function () {
                // TODO: hook up to API call
                // return $http.get().then(function (response) {
                //     return response.data;
                // });
                var deferred = $q.defer();
                var d = {
                    'types': [
                        {
                            'id': '012500000009F6GAAU',
                            'name': '1. Patient'
                        },
                        {
                            'id': '012500000009F6GAAU',
                            'name': '2. Client'
                        }
                    ]
                };
                deferred.resolve(d);
                return deferred.promise;
            },
            getFormData: function () {
                // TODO: hook up to API call
                // return $http.get().then(function (response) {
                //     return response.data;
                // });
                var deferred = $q.defer();
                var d = {
                    'type': {
                        'id': '012500000009F6GAAU',
                        'name': '1. Patient'
                    },
                    'sections': [
                        {
                            'name': 'Case Information',
                            'fields': [
                                {
                                    'type': 'PICK_LIST',
                                    'name': 'Status',
                                    'label': 'Status',
                                    'required': true,
                                    'multiSelect': false,
                                    'options': [
                                        {
                                            'value': 'New',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Escalated - Technology',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Escalated - Management',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Escalated - CSS',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Escalated - Sales',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Escalated - Third Party',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'In Progress',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Resolved - Technology',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Resolved - Management',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Resolved - CSS',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Resolved - CSM',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Resolved - Sales',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Closed - Resolved',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Closed - Unresolved',
                                            'requiredWhenChosen': [
                                                {
                                                    'type': 'PICK_LIST',
                                                    'name': 'Unresolved_Comments__c',
                                                    'label': 'Unresolved Comments',
                                                    'required': true,
                                                    'multiSelect': false,
                                                    'options': [
                                                        {
                                                            'value': 'Bug',
                                                            'requiredWhenChosen': null
                                                        },
                                                        {
                                                            'value': 'Computer Error',
                                                            'requiredWhenChosen': null
                                                        },
                                                        {
                                                            'value': 'Patient',
                                                            'requiredWhenChosen': null
                                                        },
                                                        {
                                                            'value': 'Unconfirmed',
                                                            'requiredWhenChosen': null
                                                        }
                                                    ],
                                                    'values': []
                                                }
                                            ]
                                        }
                                    ],
                                    'values': {
                                            'value': 'New'
                                    }
                                },
                                {
                                    'type': 'REFERENCE',
                                    'name': 'CSS_Specialist__c',
                                    'label': 'CSS Specialist',
                                    'required': false,
                                    'referenceId': '',
                                    'referenceName': '',
                                    'referenceType': 'User'
                                },
                                {
                                    'type': 'REFERENCE',
                                    'name': 'AccountId',
                                    'label': 'Account ID',
                                    'required': true,
                                    'referenceId': '',
                                    'referenceName': '',
                                    'referenceType': 'Account'
                                },
                                {
                                    'type': 'PICK_LIST',
                                    'name': 'Priority',
                                    'label': 'Priority',
                                    'required': true,
                                    'multiSelect': false,
                                    'options': [
                                        {
                                            'value': 'High',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Medium',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Low',
                                            'requiredWhenChosen': null
                                        }
                                    ],
                                    'values': {
                                            'value': 'Medium'
                                    }
                                },
                                {
                                    'type': 'STRING',
                                    'name': 'Patient_Name__c',
                                    'label': 'Patient Name',
                                    'required': false,
                                    'maxLength': 100,
                                    'value': ''
                                },
                                {
                                    'type': 'PICK_LIST',
                                    'name': 'Type',
                                    'label': 'Case Type',
                                    'required': true,
                                    'multiSelect': false,
                                    'options': [
                                        {
                                            'value': 'Emmi Technical Issue',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Expired View-by Date',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Incorrect Patient Information',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Mobile',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Patient Error',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'User Technical Issue',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Other',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'What is Emmi?',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'No Internet Access',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Patient Unsubscribing to Notifications',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Inactive Access Code',
                                            'requiredWhenChosen': null
                                        }
                                    ],
                                    'values': []
                                },
                                {
                                    'type': 'PICK_LIST',
                                    'name': 'Origin',
                                    'label': 'Case Origin',
                                    'required': true,
                                    'multiSelect': false,
                                    'options': [
                                        {
                                            'value': 'Chat',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Email',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Meeting',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Phone',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Website',
                                            'requiredWhenChosen': null
                                        }
                                    ],
                                    'values': []
                                },
                                {
                                    'type': 'BOOLEAN',
                                    'name': 'After_Hours__c',
                                    'label': 'After Hours',
                                    'required': false,
                                    'value': false
                                },
                                {
                                    'type': 'PICK_LIST',
                                    'name': 'Reason',
                                    'label': 'Source of Issue',
                                    'required': true,
                                    'multiSelect': false,
                                    'options': [
                                        {
                                            'value': 'Client Issue',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Emmi Issue',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Patient Issue',
                                            'requiredWhenChosen': null
                                        }
                                    ],
                                    'values': []
                                }
                            ]
                        },
                        {
                            'name': 'Additional Patient Information',
                            'fields': [
                                {
                                    'type': 'PICK_LIST',
                                    'name': 'Best_Way_to_Contact__c',
                                    'label': 'Best Way to Contact',
                                    'required': false,
                                    'multiSelect': false,
                                    'options': [
                                        {
                                            'value': 'Email',
                                            'requiredWhenChosen': null
                                        },
                                        {
                                            'value': 'Phone',
                                            'requiredWhenChosen': null
                                        }
                                    ],
                                    'values': []
                                },
                                {
                                    'type': 'STRING',
                                    'name': 'Access_Code_Text__c',
                                    'label': 'Access Code (Text)',
                                    'required': false,
                                    'maxLength': 100,
                                    'value': ''
                                },
                                {
                                    'type': 'EMAIL',
                                    'name': 'Email__c',
                                    'label': 'Email',
                                    'required': false,
                                    'maxLength': null,
                                    'value': ''
                                },
                                {
                                    'type': 'DATE',
                                    'name': 'DOB__c',
                                    'label': 'DOB',
                                    'required': false,
                                    'value': null
                                },
                                {
                                    'type': 'PHONE',
                                    'name': 'Phone__c',
                                    'label': 'Phone',
                                    'required': false,
                                    'maxLength': null,
                                    'value': ''
                                }
                            ]
                        },
                        {
                            'name': 'Web Information',
                            'fields': [
                                {
                                    'type': 'STRING',
                                    'name': 'SuppliedCompany',
                                    'label': 'Company',
                                    'required': false,
                                    'maxLength': 80,
                                    'value': ''
                                },
                                {
                                    'type': 'EMAIL',
                                    'name': 'SuppliedEmail',
                                    'label': 'Email Address',
                                    'required': false,
                                    'maxLength': null,
                                    'value': ''
                                },
                                {
                                    'type': 'STRING',
                                    'name': 'SuppliedName',
                                    'label': 'Name',
                                    'required': false,
                                    'maxLength': 80,
                                    'value': ''
                                },
                                {
                                    'type': 'STRING',
                                    'name': 'SuppliedPhone',
                                    'label': 'Phone',
                                    'required': false,
                                    'maxLength': 40,
                                    'value': ''
                                }
                            ]
                        },
                        {
                            'name': 'Description Information',
                            'fields': [
                                {
                                    'type': 'STRING',
                                    'name': 'Subject',
                                    'label': 'Subject',
                                    'required': false,
                                    'maxLength': 255,
                                    'value': ''
                                },
                                {
                                    'type': 'TEXTAREA',
                                    'name': 'Description',
                                    'label': 'Description',
                                    'required': false,
                                    'maxLength': null,
                                    'value': ''
                                }
                            ]
                        },
                        {
                            'name': 'System Information',
                            'fields': [
                                {
                                    'type': 'REFERENCE',
                                    'name': 'ContactId',
                                    'label': 'Contact ID',
                                    'required': false,
                                    'referenceId': '',
                                    'referenceName': '',
                                    'referenceType': 'Contact'
                                }
                            ]
                        }
                    ]
                };
                deferred.resolve(d);
                return deferred.promise;
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
                pageCaseType: '='
            },
            controller: function ($scope, $element, $attrs, $transclude) {

                $scope.getTypeData = function () {
                    console.log($scope.caseType);
                    // TODO: pass caseType link to service call
                    SalesforceCase.getFormData().then(function (response) {
                        console.log(response);
                        $scope.formFields = response;
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

                $scope.referenceSelect = function (item, field) {
                    console.log(item);
                    field.referenceId = item.id;
                    field.referenceName = item.name;
                    field.searchQuery = item.name;
                };

                function init() {
                    SalesforceCase.getCaseTypes().then(function (response) {
                        console.log(response);
                        $scope.caseTypes = response.types;
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
