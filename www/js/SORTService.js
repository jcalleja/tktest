angular.module('SORTServicesModule', [])
    .service('SORTArrayService', function() {
        var service = this;
        service.sortArray = function(a) {
            var swapped;
            do {
                swapped = false;
                for (var i = 0; i < a.length - 1; i++) {
                    if (a[i] > a[i + 1]) {
                        var x = a[i];
                        a[i] = a[i + 1];
                        a[i + 1] = x;
                        swapped = true;
                    }
                }
            } while (swapped);
            return a;
        };

    });