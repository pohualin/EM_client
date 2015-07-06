'use strict';

angular.module('emmiManager')

/**
 * Controller for the UserClient Support metadata section
 */
    .controller('UserClientSupportMetaDataController', ['$scope', '$controller', 'UsersClientService', '$alert', '$modal',
        function ($scope, $controller, UsersClientService, $alert, $modal) {

            $controller('UserClientSupportMetaDataCommon', {$scope: $scope});

            var salesforceCaseModal = $modal({
                scope: $scope,
                template: 'admin-facing/partials/common/directives/salesforce-form/modal.html',
                animation: 'none',
                backdropAnimation: 'emmi-fade',
                show: false,
                backdrop: 'static'
            });

            $scope.startSalesforceCase = function () {
                // Call the service to retrieve Salesforce data
                /* jshint ignore:start */
                $scope.sfData = {
                    "type": {
                        "id": "012500000009F6GAAU",
                        "name": "1. Patient"
                    },
                    "sections": [
                        {
                            "name": "Case Information",
                            "fields": [
                                {
                                    "type": "PICK_LIST",
                                    "name": "Status",
                                    "label": "Status",
                                    "required": true,
                                    "multiSelect": false,
                                    "options": [
                                        {
                                            "value": "New",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Escalated - Technology",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Escalated - Management",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Escalated - CSS",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Escalated - Sales",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Escalated - Third Party",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "In Progress",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Resolved - Technology",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Resolved - Management",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Resolved - CSS",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Resolved - CSM",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Resolved - Sales",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Closed - Resolved",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Closed - Unresolved",
                                            "requiredWhenChosen": [
                                                {
                                                    "type": "PICK_LIST",
                                                    "name": "Unresolved_Comments__c",
                                                    "label": "Unresolved Comments",
                                                    "required": true,
                                                    "multiSelect": false,
                                                    "options": [
                                                        {
                                                            "value": "Bug",
                                                            "requiredWhenChosen": null
                                                        },
                                                        {
                                                            "value": "Computer Error",
                                                            "requiredWhenChosen": null
                                                        },
                                                        {
                                                            "value": "Patient",
                                                            "requiredWhenChosen": null
                                                        },
                                                        {
                                                            "value": "Unconfirmed",
                                                            "requiredWhenChosen": null
                                                        }
                                                    ],
                                                    "values": []
                                                }
                                            ]
                                        }
                                    ],
                                    "values": [
                                        "New"
                                    ]
                                },
                                {
                                    "type": "REFERENCE",
                                    "name": "CSS_Specialist__c",
                                    "label": "CSS Specialist",
                                    "required": false,
                                    "referenceId": "",
                                    "referenceName": "",
                                    "referenceType": "User"
                                },
                                {
                                    "type": "REFERENCE",
                                    "name": "AccountId",
                                    "label": "Account ID",
                                    "required": true,
                                    "referenceId": "",
                                    "referenceName": "",
                                    "referenceType": "Account"
                                },
                                {
                                    "type": "PICK_LIST",
                                    "name": "Priority",
                                    "label": "Priority",
                                    "required": true,
                                    "multiSelect": false,
                                    "options": [
                                        {
                                            "value": "High",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Medium",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Low",
                                            "requiredWhenChosen": null
                                        }
                                    ],
                                    "values": [
                                        "Medium"
                                    ]
                                },
                                {
                                    "type": "STRING",
                                    "name": "Patient_Name__c",
                                    "label": "Patient Name",
                                    "required": false,
                                    "maxLength": 100,
                                    "value": ""
                                },
                                {
                                    "type": "PICK_LIST",
                                    "name": "Type",
                                    "label": "Case Type",
                                    "required": true,
                                    "multiSelect": false,
                                    "options": [
                                        {
                                            "value": "Emmi Technical Issue",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Expired View-by Date",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Incorrect Patient Information",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Mobile",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Patient Error",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "User Technical Issue",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Other",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "What is Emmi?",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "No Internet Access",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Patient Unsubscribing to Notifications",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Inactive Access Code",
                                            "requiredWhenChosen": null
                                        }
                                    ],
                                    "values": []
                                },
                                {
                                    "type": "PICK_LIST",
                                    "name": "Origin",
                                    "label": "Case Origin",
                                    "required": true,
                                    "multiSelect": false,
                                    "options": [
                                        {
                                            "value": "Chat",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Email",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Meeting",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Phone",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Website",
                                            "requiredWhenChosen": null
                                        }
                                    ],
                                    "values": []
                                },
                                {
                                    "type": "BOOLEAN",
                                    "name": "After_Hours__c",
                                    "label": "After Hours",
                                    "required": false,
                                    "value": false
                                },
                                {
                                    "type": "PICK_LIST",
                                    "name": "Reason",
                                    "label": "Source of Issue",
                                    "required": true,
                                    "multiSelect": false,
                                    "options": [
                                        {
                                            "value": "Client Issue",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Emmi Issue",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Patient Issue",
                                            "requiredWhenChosen": null
                                        }
                                    ],
                                    "values": []
                                }
                            ]
                        },
                        {
                            "name": "Additional Patient Information",
                            "fields": [
                                {
                                    "type": "PICK_LIST",
                                    "name": "Best_Way_to_Contact__c",
                                    "label": "Best Way to Contact",
                                    "required": false,
                                    "multiSelect": false,
                                    "options": [
                                        {
                                            "value": "Email",
                                            "requiredWhenChosen": null
                                        },
                                        {
                                            "value": "Phone",
                                            "requiredWhenChosen": null
                                        }
                                    ],
                                    "values": []
                                },
                                {
                                    "type": "STRING",
                                    "name": "Access_Code_Text__c",
                                    "label": "Access Code (Text)",
                                    "required": false,
                                    "maxLength": 100,
                                    "value": ""
                                },
                                {
                                    "type": "EMAIL",
                                    "name": "Email__c",
                                    "label": "Email",
                                    "required": false,
                                    "maxLength": null,
                                    "value": ""
                                },
                                {
                                    "type": "DATE",
                                    "name": "DOB__c",
                                    "label": "DOB",
                                    "required": false,
                                    "value": null
                                },
                                {
                                    "type": "PHONE",
                                    "name": "Phone__c",
                                    "label": "Phone",
                                    "required": false,
                                    "maxLength": null,
                                    "value": ""
                                }
                            ]
                        },
                        {
                            "name": "Web Information",
                            "fields": [
                                {
                                    "type": "STRING",
                                    "name": "SuppliedCompany",
                                    "label": "Company",
                                    "required": false,
                                    "maxLength": 80,
                                    "value": ""
                                },
                                {
                                    "type": "EMAIL",
                                    "name": "SuppliedEmail",
                                    "label": "Email Address",
                                    "required": false,
                                    "maxLength": null,
                                    "value": ""
                                },
                                {
                                    "type": "STRING",
                                    "name": "SuppliedName",
                                    "label": "Name",
                                    "required": false,
                                    "maxLength": 80,
                                    "value": ""
                                },
                                {
                                    "type": "STRING",
                                    "name": "SuppliedPhone",
                                    "label": "Phone",
                                    "required": false,
                                    "maxLength": 40,
                                    "value": ""
                                }
                            ]
                        },
                        {
                            "name": "Description Information",
                            "fields": [
                                {
                                    "type": "STRING",
                                    "name": "Subject",
                                    "label": "Subject",
                                    "required": false,
                                    "maxLength": 255,
                                    "value": ""
                                },
                                {
                                    "type": "TEXTAREA",
                                    "name": "Description",
                                    "label": "Description",
                                    "required": false,
                                    "maxLength": null,
                                    "value": ""
                                }
                            ]
                        },
                        {
                            "name": "System Information",
                            "fields": [
                                {
                                    "type": "REFERENCE",
                                    "name": "ContactId",
                                    "label": "Contact ID",
                                    "required": false,
                                    "referenceId": "",
                                    "referenceName": "",
                                    "referenceType": "Contact"
                                }
                            ]
                        }
                    ]
                };
                /* jshint ignore:end */
                salesforceCaseModal.$promise.then(salesforceCaseModal.show);
            };

            $scope.makeActive = function(){
                $scope.userClientEdit.entity.active = true;
            };

            /**
             * Show/Hide save and cancel buttons
             */
            $scope.showCancelSave = function(){
                if(angular.equals($scope.originalUserClient, $scope.userClientEdit)){
                    $scope.cancel();
                }
                return !angular.equals($scope.originalUserClient, $scope.userClientEdit);
            };

            /**
             * When cancel is clicked in edit mode
             */
            $scope.cancel = function () {
                // Reset form to pristine
                $scope.userClientEdit = angular.copy($scope.originalUserClient);
                $scope.userClientFormSubmitted = false;
                $scope.userClientForm.$setPristine();
                delete $scope.loginError;
                delete $scope.emailError;
                _paq.push(['trackEvent', 'Form Action', 'Client User Edit', 'Cancel']);
            };

            /**
             * Called when Save button is clicked
             */
            $scope.save = function (form) {
                $scope.userClientFormSubmitted = true;
                if (form.$valid) {
                    var beforeSaveStatus = $scope.originalUserClient.currentlyActive;
                    var formDirty = form.$dirty;
                    $scope.whenSaving = true;
                    UsersClientService.update($scope.userClientEdit).then(
                        function success(response) {
                            var savedUserClient = response.data;
                            $scope.originalUserClient = savedUserClient;
                            $scope.userClientEdit = angular.copy($scope.originalUserClient);
                            $scope.metadataChanged(); // inform the parent controller that things have changed
                            $scope.editMode = false;
                            if (savedUserClient.currentlyActive !== beforeSaveStatus){
                                var message = 'User <b>' + savedUserClient.entity.login + '</b>';
                                 // status has changed
                                if (savedUserClient.currentlyActive){
                                    // now activated
                                    message += ' is now active.';
                                } else {
                                    // now deactivated
                                    message += ' has been deactivated.';
                                }
                                $alert({
                                    content: message
                                });
                            }
                            if (formDirty) {
                                $alert({
                                    content: 'User <b>' + savedUserClient.entity.login + '</b> has been successfully updated.'
                                });
                            }
                            _paq.push(['trackEvent', 'Form Action', 'Client User Edit', 'Save']);
                            // Reset the form to pristine for EM-522/EM-634
                            form.$setPristine();

                            // reset the errors
                            delete $scope.loginError;
                            delete $scope.emailError;
                        }, function error(response) {
                            $scope.handleSaveError(response);
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                } else {
                    $scope.formValidationError();
                }
            };

            $scope.originalUserClient = UsersClientService.getUserClient();
            $scope.userClientEdit = angular.copy($scope.originalUserClient);
            $scope.userClientFormSubmitted = false;
        }])

;
