'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', ['$scope', '$translate', '$alert', 'tmhDynamicLocale', 'account', 'MainService',
        function ($scope, $translate, $alert, tmhDynamicLocale, account, MainService) {

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

                // see if the password is going to expire soon
                MainService.checkPasswordExpiration(account).then(function (response) {
                    if (response.showReminder) {
                    	var expiredAlertMessage = response.passwordExpiresInDays === 1 ? 'Your password will expire in ' + response.passwordExpiresInDays + ' day.'
                    			                                                       : 'Your password will expire in ' + response.passwordExpiresInDays + ' days.';
                    	if (!$scope.passwordAlert) {
                    		$scope.passwordAlert = $alert({
                    			content: expiredAlertMessage,
                                templateUrl: 'client-facing/main/password-reminder-alert.tpl.html',
                    			type: 'warning'
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
