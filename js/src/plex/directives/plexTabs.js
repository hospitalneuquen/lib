/**
 * @ngdoc directive
 * @module plex
 * @name plex-tabs
 * @description
 * To-do
 **/
angular.module('plex').directive("plexTabs", [function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, element, attrs, controller) {
            var lis = element.find("> UL > LI");
            var divs = element.find("> DIV");

            // var lis = (element.find("UL.nav-tabs > LI").length) ? element.find("UL.nav-tabs > LI") : element.find("> UL > LI") ;
            // var divs = (element.find("DIV.tab-content").length) ? element.find("DIV.tab-content") : element.find("> DIV");
            // var lis = (element.closest("UL.nav-tabs > LI").length) ? element.closest("UL.nav-tabs > LI") : element.find("> UL > LI") ;
            // var divs = (element.closest("DIV.tab-content").length) ? element.closest("DIV.tab-content") : element.find("> DIV");

            // Functions
            var activate = function(index) {
                try {
                    // if (angular.element(divs[index])){
                        lis.removeClass('active');
                        divs.css('display', 'none');
                        angular.element(lis[index]).addClass('active');
                        angular.element(divs[index]).css('display', 'block');

                        if (angular.element(lis[index]).hasClass("disabled") || angular.element(lis[index]).attr("disabled")){
                            angular.element(lis[index]).removeClass("disabled");
                        }
                    // }
                } catch (e) {}
            };

            // Prepare LIs
            element.find("> UL").addClass("nav nav-tabs");
            lis.on("click", function() {
                var $this = angular.element(this);

                if (!$this.attr("disabled")){ // || !$this.hasClass("disabled")
                    activate($this.index());

                    // Bind
                    scope.$apply(function() {
                        controller.$setViewValue($this.index());
                    });
                }
            });

            // lis.each(function(i){
            //     console.log(lis[i]);
            //     if (lis[i].attr("disabled")){
            //         lis[i].addClass("disabled");
            //     }
            // });

            // lis.each(function(i) {
            //     $mdInkRipple.attach(scope, angular.element(this), {
            //         center: false,
            //         dimBackground: true,
            //         outline: false,
            //         rippleSize: 'full'
            //     });
            // });

            // Prepare DIVs
            divs.css('display', 'none');

            // Watch changes
            scope.$watch(function() {
                return controller.$modelValue;
            }, function(current) {
                activate(current);
            });
        }
    };
}]);
