# Thadmin _vieux_
==============

Getting started
---------------

1. Install the [Yarn](https://yarnpkg.com/) package manager
2. Clone this repository
3. Use `yarn install` to install the required packages
4. Use `yarn serve` to serve the test server
5. Note that you might need to setup a `.env` file in the root of the cloned repository. The `.env` file will need to 
look something like the following (for local development):
   
```
VUE_APP_API_BASE_URI=http://localhost:8000
VUE_APP_API_AUTHORIZATION_ENDPOINT=/user/oauth/authorize/
VUE_APP_API_OAUTH_CLIENT_ID=[client_id]
VUE_APP_API_OAUTH_REDIRECT_URI=http://localhost:8080/auth/callback
```

Also note that you will need a running [`concrexit`](https://github.com/svthalia/concrexit) instance on your machine 
to use the previous `.env` configuration. The `concrexit` instance must also be configured for accepting OAuth requests 
from `Thadmin`.

### Production
Use `yarn build` to compile and minify for production.

### Linting
Use `yarn lint` to lint and fix files
