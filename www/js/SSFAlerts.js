angular.module('SSFAlerts', [])
    .service('SSFAlertsService', ['$ionicPopup', '$q', function($ionicPopup, $q) {
        var service = this;

       /* service.showAlert = function(title, body) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: body
            });
            alertPopup.then();
        };
        */
        
        service.showAlert = function(title, body) {
            navigator.notification.alert(body, null, title);
        };
        
        

        service.showConfirm = function(title, body) {
            var defer = $q.defer();
            var confirmCallback = function(buttonIndex) {
                if ( buttonIndex === 1 ) {
                    defer.resolve(true);
                } else {
                    defer.resolve(false);
                }
            };
            navigator.notification.confirm(body, confirmCallback, title);
            return defer.promise;
        };
    }]);