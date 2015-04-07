//'use strict';
//angular.module('emmiManager')
//
///**
// * Service for activation.
// */
//    .service('NewEmailService', ['$http', 'UriTemplate', '$q', 'API',
//        function ($http, UriTemplate, $q, API) {
//            return {
//                /**
//                 * validate an email
//                 *
//                 * @param user which has the email to validate
//                 * @returns the promise
//                 *
//                 */
//                saveEmail: function (user) {
//                    var deferred = $q.defer();
//                    $http.put(UriTemplate.create(user.link.self).stringify(), user)
//                        .success(function (data) {
//                            deferred.resolve(data);
//                        })
//                        .error(function (msg) {
//                            deferred.reject(msg);
//                        });
//                    return deferred.promise;
//
//                }
//            };
//        }
//    ])
//;
