'use strict';

angular.module('emmiManager')

/**
 * This directive will validate the email restrict configuration form by checking for duplicate email endings
 */
    .directive('noDuplicateEmail', ['EmailRestrictConfigurationsService', function(EmailRestrictConfigurationsService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                var delay = 1000;

                scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                    var valid = true;
                    var emailConfigurations = EmailRestrictConfigurationsService.getEmailRestrictConfigurations();

                    if (typeof emailConfigurations !== 'undefined') {
                        for (var i = 0, len = emailConfigurations.length; i < len; i++) {
                            if (emailConfigurations[i].entity.emailEnding === newVal) {
                                valid = false;
                                break;
                            }
                        }
                    }

                    ctrl.$setValidity('duplicateEmail', valid);
                }, delay);
            }
        };
    }]);
