Emmi Manager Client
=============================

The client-side setup for this project will run on [AngularJS]
(https://angularjs.org/). It was scaffolded using the AngularJS
with [GulpJS Yeoman generator] (https://github.com/Swiip/generator-gulp-angular).
Front-end dependency management is handled through Bower...

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

- run `npm install`: this fetches the 'build system', analogous to building maven itself
    - If you have problems it could be due to previous global installation of npm based stuff. I ended up removing the npm
    cached stuff in my local user directory ~/.npm and then things started working properly locally
- install bower globally `npm install bower -g` (probably need to run under `sudo`)    
- run `bower install`: this fetches all of the javascript dependency libraries necessary to run the application, analogous to fetching dependencies in maven
- need sass >= 3.3.8; via `gem install sass` (may need to run under `sudo`)

Running on 3002 (gulp)
-----------------------------------

You can review [Swiip Generator] (https://github.com/Swiip/generator-gulp-angular) for the
different Gulp commands available.

- `./node_modules/.bin/gulp serve`: starts the server which listens for changes (sync server) on the source files
- `./node_modules/.bin/gulp serve:dist`: launch sync server using optimized files

Running on 80
-----------------------------------

To run the server on port 80, you'll need:

- a web server running on your local machine (e.g. apache, nginx, etc) 
- a virtual host that has a document root on the client-angular/app directory
    - I use [virtualhost.sh] (https://github.com/virtualhost/virtualhost.sh) 
- proxy all requests from /webapi and /api-docs to the server WAR
    - My Apache configuration looks like this:

        Header unset Content-Security-Policy
        Header add Content-Security-Policy "default-src 'none'; script-src 'self' *.emmisolutions.com; connect-src 'self'; img-src 'self' *.emmisolutions.com; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'self'"
        Header unset X-Content-Security-Policy
        Header add X-Content-Security-Policy "default-src 'none'; script-src 'self' *.emmisolutions.com; connect-src 'self'; img-src 'self' *.emmisolutions.com; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'self'"
        Header set X-Content-Type-Options "nosniff"
        Header set X-XSS-Protection "1; mode=block"
        Header set X-Frame-Options "DENY"
        Header set Strict-Transport-Security "max-age=631138519; includeSubDomains"
        
        ProxyPass /webapi http://localhost:8080/webapi
        ProxyPassReverse /webapi http://localhost:8080/webapi
        ProxyPass /webapi-client http://localhost:8080/webapi-client
        ProxyPassReverse /webapi-client http://localhost:8080/webapi-client
        ProxyPass /api-docs http://localhost:8080/api-docs
        ProxyPassReverse /webapi http://localhost:8080/api-docs
                    
- compile the main.scss file
    - In this directory run `sass app/styles/main.scss:app/styles/main.css`


File Structure
-----------------------------------

- app/ : Holds all app source files (Bower dependencies, images, html, javascript, stylesheets) for the client-side app
- dist/ : Holds all compiled app resources that will be deployed to production
- gulp/ : Holds the configuration files for our different Gulp tasks
- styleguide/ : The Hologram-generated styleguide site
- styleguide_assets/ : Hologram styleguide assets (HTML partials, docs-specific CSS) for the generated styleguide
- test/ : Configuration and spec tests for our unit tests and end-to-end tests

Coding Guidelines
-----------------------------------

- All 'page changes' should be made with `<a href="/#newPage"/>` tags rather than `<button data-ng-click="changePage()"/>`
  This ensures that the browser buttons will work properly (e.g. open in new tab, reload, etc).
- All pages which are navigable by routes must use `data-ng-cloak` on the wrapper element for the page. 


Hologram Style Guide Generator
-----------------------------------

Make sure you have Ruby installed.
- run `gem install hologram` (may need to run under `sudo`)
- run `hologram`

The updated or new style guide should get generated in the `styleguide` directory.
