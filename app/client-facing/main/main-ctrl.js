'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', ['$scope', '$translate', '$alert', 'tmhDynamicLocale', 'account', 'MainService', 'SecretQuestionService',
        function ($scope, $translate, $alert, tmhDynamicLocale, account, MainService, SecretQuestionService) {

            // initial setup
            $scope.account = account;
            $scope.today = new Date();
            $scope.changeLanguage = function (langKey) {
                $translate.use(langKey);
                tmhDynamicLocale.set(langKey);
            };


            if ($scope.authenticated) {
                // user is logged in
                $scope.page.setTitle(account.clientResource.entity.name + ' Home');

                // determine if secret questions have been answered
                SecretQuestionService.getAllUserSecretQuestionAsteriskResponse(account.id).then(function (response) {
                    if (response.data.content.length === 2) {
                        $scope.isSecretQuestion = true;
                    }
                });

                // see if the password is going to expire soon
                MainService.checkPasswordExpiration(account).then(function (response) {
                    if (response.showReminder) {
                        $alert({
                            content: 'Your password will expire in ' + response.passwordExpiresInDays + ' days.',
                            template: 'client-facing/main/password-reminder-alert.tpl.html',
                            type: 'warning',
                            placement: 'top',
                            show: true,
                            dismissable: true
                        });
                    }
                });

                // figure out which teams for which this user is allowed to schedule
                MainService.specificTeamsHavingLink(account, 'schedulePrograms')
                    .then(function (teams) {
                        $scope.teamsAllowedToSchedule = teams;
                    });
            }


        }])
;
