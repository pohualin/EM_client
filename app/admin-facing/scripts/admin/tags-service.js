'use strict';
angular.module('emmiManager')
    .service('AdminManageGroupService', ['$http', 'UriTemplate',
        function ($http, UriTemplate) {
            return {

                /**
                 * Determines if a reference group is 'deletable'. Reference Groups are
                 * deletable when there are no client groups pointing to them.
                 *
                 * @param groupResource to check
                 * @returns {*}
                 */
                setDeleteFlag: function (groupResource) {
                    return $http.get(UriTemplate.create(groupResource.link.deletable).stringify())
                        .then(function ok() {
                            groupResource.deletable = true;
                        }, function error() {
                            groupResource.deletable = false;
                        });
                },

                /**
                 * Deletes a Reference Group
                 *
                 * @param groupResource to be deleted
                 * @returns {HttpPromise}
                 */
                remove: function (groupResource) {
                    return $http.delete(groupResource.link.self);
                }

            };
        }])
;
