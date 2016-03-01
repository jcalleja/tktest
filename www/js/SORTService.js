angular.module('SORTServicesModule', [])
    .service('SORTArrayService', function() {
        var a = [2, 23, 15, 4, 30, 1];
        var results = [];

        service.sortArray = function(a) {
            results = a;
            return results;
        };
    });