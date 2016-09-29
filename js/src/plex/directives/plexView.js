angular.module('plex').directive("plexView", ['$rootScope', '$anchorScroll', '$compile', '$controller', '$q', '$window', '$document', 'Plex', 'PlexResolver', '$animate', '$timeout', function($rootScope, $anchorScroll, $compile, $controller, $q, $window, $document, Plex, PlexResolver, $animate, $timeout) {
    return {
        restrict: 'EA',
        terminal: true,
        transclude: 'element',
        compile: function(element, attr, linker) {
            return function(scope, $element, attr) {
                function toggleViews(old, current) {
                    if (old)
                        old.element.css({
                            display: 'none'
                        });
                    current.element.css({
                        display: 'block'
                    });

                    // al nuevo que abrimos le agregamos
                    // position: absolute; width: 80%; left: 10%; z-index: 1001; background: white;

                    // entre medio metemos
                    // <div class="backdrop" style="    background: rgba(238,238,238,.7); position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;height: 100vh;    box-shadow: 1px 1px 10px #ccc;-moz-box-shadow:     box-shadow: 1px 1px 10px #ccc;"></div>

                    // y luego el que tiene el display none: lo pasamos a block
                    if (current.ui.modal){
                        // ocultamos nanvbar
                        $(".navbar.navbar-default").css("display", "none");

                        current.element.css({
                            position: "absolute",
                            width: "80%",
                            left: "10%",
                            zIndex: "1001"
                        });

                        old.element.css({
                            display: 'block',
                            position: 'fixed'
                        });
                    }

                    // cerramos
                    // $(".backdrop").click(function(){
                    //
                    // });

                    // si la que cerramos tenia el modal
                    // entonces mostramos de nuevo la barra de navegacion
                    // y quitamos el backdrop para hacer el efecto de transparencia
                    if (old && old.ui.modal){
                        // mostramos barra de navegacion
                        $(".navbar.navbar-default").css({
                            display: "block"
                        });

                        // eliminamos el backdrop
                        $(".backdrop").remove();

                        console.log(old);
                        current.element.css({
                            position: "inherit"
                        });
                    }

                    Plex.currentView(current);
                    Plex.initUI();
                    $window.scrollTo(current.scrollLeft || 0, current.scrollTop || 0);
                }

                // Abre una nueva vista
                scope.$on('$plex-openView', function(event, view) {
                    view.route.then(function(route) {
                        // Elimina las vistas que puedan existir hacia adelante
                        var currentIndex = Number($window.history.state) || 0;
                        while (Plex.viewStack.length > currentIndex + 1) {
                            var temp = Plex.viewStack.pop();
                            temp.scope.$destroy();
                            temp.element.remove();
                        }

                        // Crea la vista
                        Plex.addView(view);

                        var locals = route.locals;
                        var template = locals.$template;
                        view.scope = scope.$new();
                        linker(view.scope, function(clone) {
                            // Prepara la vista anterior
                            var oldView = Plex.viewStack.length > 1 ? Plex.viewStack[Plex.viewStack.length - 2] : null;
                            if (oldView && oldView.element) {
                                oldView.scrollTop = $document[0].documentElement.scrollTop;
                                oldView.scrollLeft = $document[0].documentElement.scrollLeft;
                            }

                            // Crea una entrada en el browser
                            if (Plex.viewStack.length > 1) {
                                //$window.history.pushState(Plex.viewStack.length - 1, null, route.originalPath)
                                $window.history.pushState(Plex.viewStack.length - 1, null, null);
                            }

                            // Prepara el elemento
                            clone.html(template);
                            $element.after(clone);
                            view.element = clone;
                            toggleViews(oldView, view);

                            // 1. Linkea
                            var link = $compile(clone.contents());
                            // 2. Instancia el controlador
                            if (route.controller) {
                                locals.$scope = view.scope;
                                var controller = $controller(route.controller, locals);
                                clone.data('$ngControllerController', controller);
                                clone.contents().data('$ngControllerController', controller);
                            }

                            if (view.ui.modal != "undefined" && view.ui.modal){
                                //si es modal
                                // ocultamos nav-bar
                                var modal = "";

                                var modal_template = '<div class="im-modal" style="box-shadow: 5px 5px 20px #666;background: white;margin-bottom: 100px;">';
                                    modal_template += '<div class="im-modal-header" style="padding: 10px; border-bottom: 1px solid #eee; display: block; height: 60px;">';
                                    modal_template += '<span class="" style="display: inline-block; padding: 5px 10px; font-weight: bold; text-transform: uppercase; color: cornflowerblue; font-size: 18px;">' + Plex.title + '</span>';
                                    modal_template += '<button style="/* right: 10px; *//* position: absolute; *//* top: 10px; */background: none;border: none;font-weight: bold;font-size: 20px;height: 40px;width: 30px;float: right;" ng-click="Plex.closeView()">X</button>';
                                modal_template += '</div>';
                                modal_template += '<div class="im-modal-body" style="padding: 10px 20px;">' + template + '</div>';
                                modal_template += '<div class="im-modal-footer" style="min-height: 60px;" >';
                                modal_template += '</div>';

                                template = modal_template;

                                // creamos el backdrop
                                var backdrop = '<div class="backdrop" style=" background: rgba(0,0,0,.5); position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;height: 100vh; box-shadow: 1px 1px 10px #ccc;-moz-box-shadow: box-shadow: 1px 1px 10px #ccc;"></div>';

                                // Prepara el elemento
                                clone.html(template);
                                $element.after(clone);
                                $element.before(backdrop);
                                view.element = clone;
                                toggleViews(oldView, view);

                                // 1. Linkea
                                var link = $compile(clone.contents());
                                // 2. Instancia el controlador
                                if (route.controller) {
                                    locals.$scope = view.scope;
                                    var controller = $controller(route.controller, locals);
                                    clone.data('$ngControllerController', controller);
                                    clone.contents().data('$ngControllerController', controller);
                                }
                            }
                            // 3. Compila
                            link(view.scope);
                            //scope.$broadcast('$plex-initUI');
                            Plex.initUI();

                            /*
                            26/03/2014 | jgabriel | Este código está copiado de ng-view. Hay que ver si hace falta
                            view.scope.$eval(attr.onload || '');

                            // $anchorScroll might listen on event...
                            $anchorScroll();
                            */
                        });
                    });
                });

                // Cierra la vista actual
                scope.$on('$plex-closeView', function(event, gotoView) {
                    var oldView = Plex.currentView();
                    var view = Plex.viewStack[gotoView];
                    toggleViews(oldView, view);
                });

                // Responde cuando se navega con los botones Back/Forward en el browser
                angular.element($window).on('popstate', function( /*event*/ ) {
                    //var gotoView = Number(event.originalEvent.state) || 0;
                    var gotoView = $window.history.state;
                    // Usa $timeout para no romper el ciclo de rendering de Angular cuando se cierran varias vistas consecutivamente
                    $timeout(function() {
                        scope.$emit('$plex-closeView', gotoView);
                    });
                    /*
                    scope.$apply(function () {
                        scope.$emit('$plex-closeView', gotoView);
                    });
                    */
                });

                // Inicializa la primera página
                $window.history.replaceState(0, null, null);
                var path = $window.location.pathname.substr(($document.find('base').attr('href') || '/').length - 1);
                Plex.openView(path);
            };
        }
    };
}]);
