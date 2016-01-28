Lib
==========

Conjunto de librerías para aplicaciones basadas en AngularJS y Bootstrap, que incluye -entre otras-:
* [AngularJS](github.com/angular/angular.js)
* [Bootswatch](https://github.com/thomaspark/bootswatch)

Prerequisitos
-----
* [Client GIT](https://git-scm.com/download/win)
* [Node.JS](https://nodejs.org/en/download/)
* Instalar Bower
```bash
npm install bower
```
* Instalar grunt
```bash
npm install grunt
```

Cómo compilar
------
1. Crear una nueva carpeta y navegar hasta ella
```bash
md lib
cd lib
```

2. Clonar (descargar) el repositorio
```bash
git clone https://github.com/hospitalneuquen/lib.git
```

3. Instalar dependencias de Node
```bash
npm install
```

4. Instalar dependencias de Bower
```bash
bower install
```
Si surgen problemas al instalar estas dependencias, leer http://stackoverflow.com/questions/15669091/bower-install-using-only-https

5. Compilar la librería
```bash
grunt
```

Cómo realizar cambios
-----
Si se realizan cambios en los archivos `.less` o `.js` puede utilizarse la tarea watch para faciliar la compilación:
```bash
grunt watch
```
