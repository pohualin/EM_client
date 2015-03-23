'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', ['$scope', '$translate', '$alert', 'tmhDynamicLocale', 'account', 'MainService', 'Session', '$rootScope',
        function ($scope, $translate, $alert, tmhDynamicLocale, account, MainService, Session, $rootScope) {

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
                if(Session.secretQuestionCreated){
                	$scope.isSecretQuestion = true;
           		}

                // see if the password is going to expire soon
                MainService.checkPasswordExpiration(account).then(function (response) {
                    if (response.showReminder) {
                        if (!$scope.passwordAlert) {
                            $rootScope.passwordAlert = $alert({
                                content: 'Your password will expire in ' + response.passwordExpiresInDays + ' days.',
                                template: 'client-facing/main/password-reminder-alert.tpl.html',
                                type: 'warning',
                                placement: 'top',
                                show: true,
                                dismissable: true
                            });
                        } else {
                            $scope.passwordAlert.show();
                        }
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
