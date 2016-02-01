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
    grunt.registerTask('default', ['concat:js', 'less:global', 'less:fontawesome', 'less:cosmo', 'concat:cosmo', 'copy']);

    grunt.initConfig({
        // Configuración de watch
        watch: {
            scripts: {
                files: ['**/*'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
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
                    'js/src/plex/filters/fromnow.js',
                    'js/src/plex/directives/plexMap.js',
                    'js/src/plex/directives/plexChart.js',
                    'js/src/plex/directives/plexMinLength.js',
                    'js/src/plex/directives/plexMaxLength.js',

                    // Config
                    'js/src/config.js'
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
                cwd: 'css/src/webfont-medical-icons/fonts', // set working folder / root to copy
                src: '**/*', // copy all files and subfolders
                dest: 'css/dist/fonts', // destination folder
                expand: true // required when using cwd
            },
            fontawesome: {
                cwd: 'bower_components/font-awesome/fonts', // set working folder / root to copy
                src: '**/*', // copy all files and subfolders
                dest: 'css/dist/fonts', // destination folder
                expand: true // required when using cwd
            },
            cosmo: {
                cwd: 'css/src/bootswatch/cosmo/fonts', // set working folder / root to copy
                src: '**/*', // copy all files and subfolders
                dest: 'css/dist/fonts', // destination folder
                expand: true // required when using cwd
            }
        }
    });
};
