'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', function ($scope, $translate, $locale, tmhDynamicLocale, focus) {
        $scope.today = new Date();
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            tmhDynamicLocale.set(langKey);
        };

        var tagGroupsFromService = {
          'page' : {
            'size' : 50,
            'totalElements' : 2,
            'totalPages' : 1,
            'number' : 0
          },
          'link' : [ {
            'rel' : 'self',
            'href' : 'https://qa6.emmisolutions.com/web-rest/webapi/referenceGroups{?page,size,sort}'
          } ],
          'content' : [ {
            'entity' : {
              'id' : 1,
              'name' : 'Specialty',
              'tag' : [ {
                'id' : 30,
                'name' : 'Palliative Care'
              }, {
                'id' : 15,
                'name' : 'Endocrinology'
              }, {
                'id' : 36,
                'name' : 'Urology'
              }, {
                'id' : 16,
                'name' : 'Opthalmology'
              }, {
                'id' : 11,
                'name' : 'Dentistry'
              }, {
                'id' : 24,
                'name' : 'Neonatology (NICU)'
              }, {
                'id' : 18,
                'name' : 'Pediatrics'
              }, {
                'id' : 13,
                'name' : 'Ear, Nose & Throat (ENT) (Otolaryngology)'
              }, {
                'id' : 25,
                'name' : 'Nephrology'
              }, {
                'id' : 27,
                'name' : 'Neurosurgery'
              }, {
                'id' : 20,
                'name' : 'Cardiology'
              }, {
                'id' : 35,
                'name' : 'Radiology'
              }, {
                'id' : 31,
                'name' : 'Pediatric Intensive Care Unit (PICU)'
              }, {
                'id' : 23,
                'name' : 'Medical Genetics'
              }, {
                'id' : 21,
                'name' : 'Hospitalists'
              }, {
                'id' : 12,
                'name' : 'Dermatology'
              }, {
                'id' : 32,
                'name' : 'Plastic Surgery'
              }, {
                'id' : 17,
                'name' : 'Gastroenterology'
              }, {
                'id' : 19,
                'name' : 'General Surgery'
              }, {
                'id' : 22,
                'name' : 'Infectious Diseases'
              }, {
                'id' : 33,
                'name' : 'Psychiatry'
              }, {
                'id' : 8,
                'name' : 'Anesthesiology'
              }, {
                'id' : 26,
                'name' : 'Neurology'
              }, {
                'id' : 28,
                'name' : 'Obesity'
              }, {
                'id' : 29,
                'name' : 'Orthopaedic Surgery'
              }, {
                'id' : 14,
                'name' : 'Emergency Department'
              }, {
                'id' : 34,
                'name' : 'Pulmonary Medicine'
              } ],
              'type' : {
                'id' : 1,
                'name' : 'SPECIALTY'
              }
            },
            'link' : [ {
              'rel' : 'self',
              'href' : 'https://qa6.emmisolutions.com/web-rest/webapi/referenceGroups'
            } ]
          }, {
            'entity' : {
              'id' : 2,
              'name' : 'Care Setting',
              'tag' : [ {
                'id' : 40,
                'name' : 'Preventative'
              }, {
                'id' : 38,
                'name' : 'Inpatient'
              }, {
                'id' : 37,
                'name' : 'Discharge'
              }, {
                'id' : 41,
                'name' : 'Wellness'
              }, {
                'id' : 39,
                'name' : 'Outpatient/ Ambulatory'
              } ],
              'type' : {
                'id' : 2,
                'name' : 'CARE_SETTING'
              }
            },
            'link' : [ {
              'rel' : 'self',
              'href' : 'https://qa6.emmisolutions.com/web-rest/webapi/referenceGroups'
            } ]
          } ]
        };
        $scope.tagGroups = tagGroupsFromService.content;

        /**
         * Puts a group into a mode where the group name is editable
         * @param tagGroup to be put in edit name mode
         */
        $scope.startEditMode = function (tagGroup) {
            tagGroup.editMode = true;
            tagGroup.original = angular.copy(tagGroup);
            tagGroup.watcher = $scope.$watch(function() { return tagGroup; }, function(newValue, oldValue) {
                if (!angular.equals(tagGroup.entity, tagGroup.original.entity, true)) {
                    tagGroup.changed = true;
                } else {
                    tagGroup.changed = false;
                }
            }, true);
            focus('focus-' + tagGroup.entity.id);
        };

        /**
         * Called when 'cancel' is clicked on an existing panel
         *
         * @param tagGroup
         */
        $scope.cancelEditMode = function (tagGroup) {
            angular.extend(tagGroup, tagGroup.original);
            tagGroup.editMode = false;
            tagGroup.watcher();
            delete tagGroup.original;
            delete tagGroup.watcher;
        };

        /**
         * Called when a client role resource 'save' button is clicked for
         * an existing role
         *
         * @param tagGroup to be updated
         */
        $scope.update = function (tagGroup) {
            console.log('Update!');
            console.log(tagGroup);
            //ManageUserTeamRolesService.saveExistingClientTeamRole(tagGroup);
        };

        /**
         * Called when the save button is clicked on a new tag group
         *
         * @param clientTeamRoleEntity to be saved
         */
        $scope.saveNewGroup = function (tagGroup) {
            // ManageUserTeamRolesService.saveNewClientTeamRole(tagGroup).then(function () {
            //     delete $scope.newTagGroup;
            //     $scope.loadExisting();
            // });
        };

        /**
         * Called when 'cancel' is clicked on the create new tag group panel
         */
        $scope.cancelNew = function () {
            delete $scope.newTagGroup;
            delete $scope.newTagGroupTags;
        };

        /**
         * Called when 'create new tag group' is clicked
         */
        $scope.createNewTagGroup = function () {
            //$scope.newTagGroup = ManageUserTeamRolesService.newClientTeamRoleEntity();
            $scope.newTagGroup = {};
            focus('focus-new-group');
        };

    })
;
