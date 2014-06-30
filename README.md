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

- run 'npm install'
- run 'bower install'
- install gulp via 'sudo npm install -g gulp'

You can review [Swiip Generator] (https://github.com/Swiip/generator-gulp-angular) for the
different Gulp commands available.

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
- run 'gem install hologram'
- run 'hologram'

The updated or new style guide should get generated in the styleguide directory.
