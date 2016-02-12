module.exports = function(grunt) {
    // Permite observar cambios en archivos
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Permite concatenar archivos
    grunt.loadNpmTasks('grunt-contrib-concat');
    // Permite compilar LESS
    grunt.loadNpmTasks('grunt-contrib-less');
    // Permite copiar archivos
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Orden de las tareas
    grunt.registerTask('default', ['concat:js', 'less:global', 'less:fontawesome', 'less:cosmo', 'concat:cosmo', 'concat:svgEdit', 'copy']);

    grunt.initConfig({
        // Configuración de watch
        watch: {
            js: {
                files: ['js/src/**/*.*'],
                tasks: ['default']
            },
            css: {
                files: ['css/src/**/*.*'],
                tasks: ['default']
            },
        },
        // Configuración de la tarea grunt-contrib-concat
        concat: {
            options: {
                //banner: '<%= banner %>',
                stripBanners: false,
                separator: '\n',
            },
            js: { // Archivos .js
                dest: './js/dist/lib.js',
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/angular/angular.js',
                    'bower_components/angular-animate/angular-animate.js',
                    'bower_components/angular-route/angular-route.js',
                    'bower_components/angular-sanitize/angular-sanitize.js',
                    'js/src/patches/angular-locale_es-ar.js',

                    // UI
                    'bower_components/angular-strap/dist/modules/compiler.js',
                    'bower_components/angular-strap/dist/modules/affix.js',
                    'bower_components/angular-strap/dist/modules/button.js',
                    'bower_components/angular-strap/dist/modules/tooltip.js',
                    'bower_components/angular-strap/dist/modules/tooltip.tpl.js',
                    'bower_components/angular-strap/dist/modules/date-parser.js',
                    'bower_components/angular-strap/dist/modules/debounce.js',
                    'bower_components/angular-strap/dist/modules/dimensions.js',
                    'bower_components/angular-strap/dist/modules/datepicker.js',
                    'bower_components/angular-strap/dist/modules/date-formatter.js',
                    'bower_components/angular-strap/dist/modules/date-parser.js',
                    'js/src/patches/datepicker.tpl.patched.js',
                    'bower_components/angular-strap/dist/modules/dropdown.js',
                    'bower_components/angular-strap/dist/modules/dropdown.tpl.js',
                    'bower_components/angular-strap/dist/modules/modal.js',
                    'bower_components/angular-strap/dist/modules/modal.tpl.js',
                    'bower_components/angular-strap/dist/modules/popover.js',
                    'bower_components/angular-strap/dist/modules/popover.tpl.js',
                    'bower_components/angular-strap/dist/modules/timepicker.js',
                    'js/src/patches/timepicker.tpl.patched.js',
                    'bower_components/angular-strap/dist/modules/tab.js',
                    'bower_components/angular-strap/dist/modules/tab.tpl.js',
                    'bower_components/angular-strap/dist/modules/raf.js',

                    // Other
                    'bower_components/ocLazyLoad/dist/ocLazyLoad.min.js',
                    'bower_components/angular-bindonce/bindonce.js',
                    'bower_components/ng-file-upload/ng-file-upload.js',
                    'js/src/patches/angular-load.js',

                    // Global
                    'js/src/global/modules/Global.js',
                    'js/src/global/services/Global.js',
                    'js/src/global/services/Session.js',
                    'js/src/global/services/SSO.js',
                    'js/src/global/services/Server.js',

                    // Plex
                    'js/src/plex/lib/moment/moment.js',
                    'js/src/plex/lib/moment/es.js',
                    'js/src/plex/lib/select2/select2.js',
                    'js/src/plex/lib/select2/select2_locale_es.js',
                    'js/src/plex/lib/textangular/rangy-core.js',
                    'js/src/plex/lib/textangular/rangy-selectionsaverestore.js',
                    'js/src/plex/lib/textangular/textAngularSetup.js',
                    'js/src/plex/lib/textangular/textAngular.js',
                    'js/src/plex/modules/plex.js',
                    'js/src/plex/services/plex.js',
                    'js/src/plex/services/PlexResolver.js',
                    'js/src/plex/directives/form.js',
                    'js/src/plex/directives/plexActions.js',
                    'js/src/plex/directives/plexEnter.js',
                    'js/src/plex/directives/plexFocus.js',
                    'js/src/plex/directives/plexInclude.js',
                    'js/src/plex/directives/plexSkin.js',
                    'js/src/plex/directives/plexFilter.js',
                    'js/src/plex/directives/plexMax.js',
                    'js/src/plex/directives/plexMin.js',
                    'js/src/plex/directives/plex.js',
                    'js/src/plex/directives/plexForm.js',
                    'js/src/plex/directives/plexSubmit.js',
                    'js/src/plex/directives/plexCancel.js',
                    'js/src/plex/directives/plexView.js',
                    'js/src/plex/directives/plexWorking.js',
                    'js/src/plex/directives/plexSelect.js',
                    'js/src/plex/directives/title.js',
                    'js/src/plex/filters/fromNow.js',
                    'js/src/plex/directives/plexMap.js',
                    'js/src/plex/directives/plexChart.js',
                    'js/src/plex/directives/plexCanvas.js',
                    'js/src/plex/directives/plexMinLength.js',
                    'js/src/plex/directives/plexMaxLength.js',

                    // Config
                    'js/src/config.js'
                ]
            },
            svgEdit: { // Archivos .js
                dest: './js/dist/plex-canvas/svg-editor.min.js',
                src: [
                    'js/src/plex/lib/svg-edit/js-hotkeys/jquery.hotkeys.min.js',
                    'js/src/plex/lib/svg-edit/jquerybbq/jquery.bbq.min.js',
                    'js/src/plex/lib/svg-edit/svgicons/jquery.svgicons.js',
                    'js/src/plex/lib/svg-edit/jgraduate/jquery.jgraduate.min.js',
                    'js/src/plex/lib/svg-edit/spinbtn/JQuerySpinBtn.min.js',
                    'js/src/plex/lib/svg-edit/jquery-ui/jquery-ui-1.8.17.custom.min.js',
                    'js/src/plex/lib/svg-edit/jgraduate/jpicker.js',
                    'js/src/plex/lib/svg-edit/locale/locale.js',
                    'js/src/plex/lib/svg-edit/svgedit.compiled.js',
                    // 'js/src/plex/lib/svg-edit/svgedit.js',
                    // 'js/src/plex/lib/svg-edit/jquery-svg.js',
                    // 'js/src/plex/lib/svg-edit/contextmenu/jquery.contextMenu.js',
                    // 'js/src/plex/lib/svg-edit/browser.js',
                    // 'js/src/plex/lib/svg-edit/svgtransformlist.js',
                    // 'js/src/plex/lib/svg-edit/math.js',
                    // 'js/src/plex/lib/svg-edit/units.js',
                    // 'js/src/plex/lib/svg-edit/svgutils.js',
                    // 'js/src/plex/lib/svg-edit/sanitize.js',
                    // 'js/src/plex/lib/svg-edit/history.js',
                    // 'js/src/plex/lib/svg-edit/coords.js',
                    // 'js/src/plex/lib/svg-edit/recalculate.js',
                    // 'js/src/plex/lib/svg-edit/select.js',
                    // 'js/src/plex/lib/svg-edit/draw.js',
                    // 'js/src/plex/lib/svg-edit/path.js',
                    // 'js/src/plex/lib/svg-edit/svgcanvas.js',
                    // 'js/src/plex/lib/svg-edit/svg-editor.js',
                    // 'js/src/plex/lib/svg-edit/locale/locale.js',
                    // 'js/src/plex/lib/svg-edit/canvg/rgbcolor.js',
                    // 'js/src/plex/lib/svg-edit/canvg/canvg.js',
                ]
            },
            cosmo: { // Archivos .css generados por la tarea 'less'
                src: [
                    'css/src/plex/global.css',
                    'css/src/bootswatch/cosmo/build.css',
                    'css/src/webfont-medical-icons/wfmi-style.css',
                    'bower_components/angular-motion/dist/angular-motion.css',
                    '.tmp/font-awesome.css',
                    'js/src/plex/lib/textangular/textAngular.css',
                ],
                dest: 'css/dist/lib.cosmo.css',
            }
        },
        // Configuración de la tarea grunt-contrib-less
        less: {
            global: {
                files: [{
                    src: ['css/src/plex/global.less'],
                    dest: 'css/src/plex/global.css'
                }]
            },
            fontawesome: {
                files: [{
                    src: ['bower_components/font-awesome/less/font-awesome.less'],
                    dest: '.tmp/font-awesome.css'
                }],
                options: {
                    modifyVars: {
                        'fa-font-path': '"fonts"',
                    }
                },
            },
            cosmo: {
                files: [{
                    src: ['css/src/bootswatch/cosmo/build.less'],
                    dest: 'css/src/bootswatch/cosmo/build.css'
                }]
            }
        },
        // Configuración de la tarea copy
        copy: {
            medical: {
                cwd: 'css/src/webfont-medical-icons/fonts',
                src: '**/*',
                dest: 'css/dist/fonts',
                expand: true
            },
            fontawesome: {
                cwd: 'bower_components/font-awesome/fonts',
                src: '**/*',
                dest: 'css/dist/fonts',
                expand: true
            },
            cosmo: {
                cwd: 'css/src/bootswatch/cosmo/fonts',
                src: '**/*',
                dest: 'css/dist/fonts',
                expand: true
            },
            // svgEdit: {
            //     cwd: 'js/src/plex/lib/svg-edit',
            //     src: '**/*',
            //     dest: 'js/dist/plex-canvas',
            //     expand: true
            // }
        }
    });
};
