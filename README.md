Emmi Manager Client
=============================

The client-side setup for this project will run on [AngularJS]
(https://angularjs.org/). It was scaffolded using the AngularJS
with [GulpJS Yeoman generator] (https://github.com/Swiip/generator-gulp-angular).
Front-end dependency management is handled through Bower.

Tools
-----------------------------------

- [Bower](http://bower.io/)
- [GulpJS](http://gulpjs.com/)
- [Karma](http://karma-runner.github.io/)
- [Protractor](https://github.com/angular/protractor)
- [Hologram](http://trulia.github.io/hologram/)

Setup
-----------------------------------

Pull down the Git repo and run these commands from the root (where the
package.json and bower.json files live):

- run `npm install` (may need to run under `sudo`)
- run `bower install` (may need to run under `sudo`)
- install gulp via `npm install -g gulp` (may need to run under `sudo`)
- need sass >= 3.3.8; via `gem install sass` (may need to run under `sudo`)

You can review [Swiip Generator] (https://github.com/Swiip/generator-gulp-angular) for the
different Gulp commands available.

- `gulp serve`: starts the server which listens for changes (sync server) on the source files
- `gulp serve:dist`: launch sync server using optimized files

File Structure
-----------------------------------

- app/ : Holds all app source files (Bower dependencies, images, html, javascript, stylesheets) for the client-side app
- dist/ : Holds all compiled app resources that will be deployed to production
- gulp/ : Holds the configuration files for our different Gulp tasks
- styleguide/ : The Hologram-generated styleguide site
- styleguide_assets/ : Hologram styleguide assets (HTML partials, docs-specific CSS) for the generated styleguide
- test/ : Configuration and spec tests for our unit tests and end-to-end tests

Hologram Style Guide Generator
-----------------------------------

Make sure you have Ruby installed.
- run `gem install hologram` (may need to run under `sudo`)
- run `hologram`

The updated or new style guide should get generated in the `styleguide` directory.
