/**
 *
 * @ngdoc service
 * @module plex
 * @name Plex
 * @description
 * Permite interactuar con la UI
 *
 **/
angular.module('plex').factory('Plex', ["$rootScope", "PlexResolver", "$window", "$modal", "$q", "$timeout", "Global", "Session", "$alert", function($rootScope, PlexResolver, $window, $modal, $q, $timeout, Global, Session, $alert) {
    var self = {
        /*
        ViewStack es un array de objetos son las siguientes propiedades:
            - element: elemento visual que se muestra u oculta
            - deferred: promesa que se resuelve cuando se cierra la vista
            - ui: opciones de la interfase de usuario
            - formController: relaciona los botones "Guardar" y "Cancelar" con métodos del controlador actual
        */
        viewStack: [], // array of {element, deferred, ui, form}
        currentViewIndex: null,
        title: null,
        subtitle: null,
        currentSkin: null,
        loading: {
            smallCount: 0,
            bigCount: 0,
            showSmall: false,
            showBig: false,
            update: function(value, useBig) // Indica que la aplicación está cargando datos, o bien que ha finalizado
                {
                    if (useBig) {
                        if (value)
                            this.bigCount++;
                        else if (this.bigCount > 0)
                            this.bigCount--;
                        this.showBig = this.bigCount > 0;
                    } else {
                        if (value)
                            this.smallCount++;
                        else if (this.smallCount > 0)
                            this.smallCount--;
                        this.showSmall = this.smallCount > 0;
                    }
                }
        },
        actions: [], // Acciones que se muestran en el footer. Es un array de {title, icon, [url | handler], visible, disabled}
        menuActions: null, // Acciones que se muestran en menú a la izquierda del nav-bar
        userActions: [{
            icon: 'mdi mdi-logout',
            text: 'Cerrar sessión',
            handler: function() {
                Session.logout();
            }
        }, {
            icon: 'mdi mdi-account-switch',
            text: 'Cambiar usuario',
            handler: function() {
                Session.logout();
            }
        }],
        submitForm: function() {
            var form = self.currentView().form;
            if (!form.isSubmitting) {
                $rootScope.$broadcast('$plex-before-submit', form.controller);
                if (form.controller.$valid) {
                    form.isSubmitting = true;

                    // Clear warnings
                    self.warning.show = false;

                    var result = form.submitHandler();
                    if (angular.isDefined(result)) {
                        // Is it a promise?
                        if (angular.isDefined(result.finally))
                            result
                            .then(function() {
                                form.controller.$setPristine(true);
                            })
                            .finally(function() {
                                form.isSubmitting = false;
                            });
                        else {
                            if (result) {
                                form.isSubmitting = false;
                                form.controller.$setPristine(true);
                            }
                        }
                    } else {
                        form.isSubmitting = false;
                        form.controller.$setPristine(true);
                    }
                } else {
                    self.alert("Por favor verifique los datos ingresados", "warning");
                }
                $rootScope.$broadcast('$plex-after-submit', form.controller);
            }
        },
        cancelForm: function() {
            var handler = self.currentView().form.cancelHandler;
            if (handler) handler();
        },
        isFormValid: function(showErrors) {
            var form = self.currentView().form;
            if (form) {
                if (form.controller.$valid)
                    return true;
                else {
                    if (showErrors) {
                        // Marca los controladores como modificados para que muestren los errores
                        angular.forEach(form.controller.$error, function(property) {
                            angular.forEach(property, function(controller) {
                                //controller.$setPristine(false);
                                controller.$setViewValue(controller.$viewValue);
                            });
                        });
                    }
                    return false;
                }
            } else
                return true;
        },
        /**
         *
         * @ngdoc method
         * @name Plex#alert:
         * @param {String} message Mensaje a mostrar
         * @param {String} type info (default) | warning | success
         * @param {Number} duration Cantidad de tiempo que estará abierto. Por default: 2000ms
         * @param {Event} event Objeto de evento de la operación actual. Cuando se especifica, la alerta se muestra cerca del elemento relacionado
         * @description Muestra una alerta al usuario.
         *
         * Ejemplo:
         *
         *      Plex.alert("Este es un mensaje", "warning", 300)
         **/
        alert: function(message, type, duration, event) {
            var a = $alert({
                content: message,
                placement: event && event.target ? 'top-left' : 'top-right',
                type: type || 'info',
                show: true,
                duration: angular.isNumber(duration) ? duration / 1000 : 2,
                //container: event && event.target ? event.target : false,
            });
            a.$promise.then(function(obj) {
                if (event && event.target) {
                    var $element = angular.element(obj.element);
                    var $target = angular.element(event.target);
                    var $win = angular.element($window);
                    var offset = $target.offset();
                    $element.css('margin', 0);
                    $element.offset({
                        top: offset.top - $win.scrollTop() - 80,
                        left: offset.left - $win.scrollLeft()
                    });
                }
            });
        },
        //clearAlerts: function () {
        //    self.error.show = false;
        //    self.warning.show = false;
        //    self.info.show = false;
        //},
        addView: function(view) {
            angular.extend(view, {
                ui: { // Será inicializado cuando el controlador llame a initView()
                    title: null,
                    subtitle: null,
                    actions: null
                },
                form: null // Será inicializado en linkForm()
            });
            self.viewStack.push(view);
            self.currentView(view);
            return view;
        },
        currentView: function(view) {
            if (view) {
                self.currentViewIndex = self.viewStack.indexOf(view);
                return view;
            } else {
                return angular.isNumber(self.currentViewIndex) ? self.viewStack[self.currentViewIndex] : null;
            }
        },
        /**
         *
         * @ngdoc method
         * @name Plex#openView
         * @param {String} path Ruta
         * @return {Promise} promise Resuelve cuando se llama el método ```Plex.closeView()``` o el usuario hace click en el botón *atrás* del browser
         * @description Permite cargar una vista y un controlador asociados.
         *
         * Ejemplo:
         *
         *      Plex.openView("/myRoute").then(function(returnValue) { ... })
         **/
        openView: function(path) {
            console.log(path);
            var deferred = $q.defer();
            Global.waitInit().then(function() {
                // Muestra la vista (usa $timeout para no romper el ciclo de rendering)
                $timeout(function() {
                    $rootScope.$broadcast('$plex-openView', {
                        route: PlexResolver.resolve(path.indexOf('/') !== 0 ? '/' + path : path),
                        deferred: deferred
                    });
                });
            });
            return deferred.promise;
        },
        /**
         *
         * @ngdoc method
         * @name Plex#closeView
         * @param {Object=} returnValue Objeto que se devuelve a openView
         * @description Cierra la vista actual y resuelve la promise abierta en ```Plex.openView()```
         *
         * Ejemplo:
         *
         *      Plex.closeView(true);
         **/
        closeView: function(returnValue) {
            //if (self.currentViewIndex > 0) {
            //    var view = self.currentView();
            //    // Usa $timeout para no romper el ciclo de rendering
            //    $timeout(function () {
            //        $window.history.back();
            //        view.deferred.resolve(returnValue);
            //    });
            //}

            // Usa $timeout para no romper el ciclo de rendering
            $timeout(function() {
                if (self.currentViewIndex > 0) {
                    var view = self.currentView();
                    $window.history.back();
                    view.deferred.resolve(returnValue);
                }
            }, 50);
        },
        openDialog: function(url) {
            // TODO: Abrir un modal
            $window.open(url);
        },
        initUI: function() {
            var currentView = self.currentView();
            self.title = currentView.ui.title;
            self.subtitle = currentView.ui.subtitle;
            self.actions = [];
            angular.forEach(currentView.ui.actions, function(a) {
                if ((!angular.isDefined(a.visible)) || a.visible)
                    self.actions.push(a);
            });
        },
        /**
         *
         * @ngdoc method
         * @name Plex#initView
         * @param {settings=} settings Objeto conteniendo uno o más parámetros para inicializar la vista
         *   - **title**: Título
         *   - **subtitle**: Subtítulo
         *   - **actions**: Array de acciones con las siguientes opciones
         *      - *title*: Título del ícono
         *      - *icon*: Icono
         *      - *handler*: Función a ejecutar cuando se hace clic en el ícono
         * @description Inicializa la vista actual
         *
         * Ejemplo:
         *
         Plex.initView({
                title: "Punto de inicio",
                actions: [{
                    title: "Camas",
                    icon: "fa fa-bed",
                    handler: function() {
                        Plex.openView('mapa');
                    }
                }]
            });
         **/
        initView: function(settings) {
            // Esta función es llamada por el controlador para inicializar la vista
            var currentView = self.currentView();

            // Prepara la acciones
            if (settings.actions) {
                for (var i = 0; i < settings.actions.length; i++) {
                    var action = settings.actions[i];
                    action.action = function() {
                        if (this.handler)
                            this.handler();
                        else
                        if (this.url)
                            self.openView(this.url);
                    };
                }
            }

            // Inicializa la UI
            angular.extend(currentView.ui, settings);
            self.initUI();
        },
        initApplication: function(applicationId) {
            self.menuActions = [{
                text: "<i class=\"fa fa-home\"></i><span>Volver a la Intranet</span>",
                click: function() {
                    window.location = "/";
                }
            }, {
                divider: true
            }, {
                text: "<i class=\"fa fa-user\"></i><span>¿Problemas de identificación del paciente o datos desactualizados?</span>",
                click: function() {
                    self.openView('/feedback/paciente');
                }
            }, {
                text: "<i class=\"fa fa-flag\"></i><span>¿Diagnóstico/problema no encontrado o con nombre confuso?</span>",
                click: function() {
                    self.openView('/feedback/diagnostico');
                }
            }, {
                text: "<i class=\"fa fa-comments\"></i><span>Reportar una sugerencia o problema de la aplicación</span>",
                click: function() {
                    $q.when(self.currentView().route, function(route) {
                        // TODO: debería estar la URL final (i.e. con los parámetros incorporados)
                        self.openView('/feedback/app/' + encodeURIComponent(route.originalPath) + ' ' + JSON.stringify(route.params) + '/' + encodeURIComponent(route.controller));
                    });
                }
            }];
        },
        linkForm: function(controller, submitHandler, cancelHandler) { // Esta función es llamada por la directiva plexForm
            if (!controller)
                throw "Utilice la directiva plex-form para vincular un formulario a la vista.";
            if (!submitHandler)
                throw "El formulario debe tener asociado un submit handler. Puede definir un método submit() en el scope del controlador.";
            if (!cancelHandler)
                throw "El formulario debe tener asociado un cancel handler. Puede definir un método cancel() en el scope del controlador.";

            self.currentView().form = {
                controller: controller,
                submitHandler: submitHandler,
                cancelHandler: cancelHandler
            }
        },
        unlinkForm: function(controller) { // Esta función es llamada por la directiva plexForm
            // TODO: Revisar porque esto no funciona bien!!!! El PlexForm->scope.destroy se llama en momentos inadecuados!!!
            // Momentáneamente recorro todas las vistas

            //self.currentView().form = null;
            this.viewStack.forEach(function(view) {
                if (view.form && (view.form.controller == controller)) {
                    view.form = null;
                }
            })
        }
    }

    return self;
}]);
