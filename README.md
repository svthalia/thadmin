# typescript-app

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Docker container

A `Dockerfile` is included in the root folder of the repository. For building the docker file, you can run `docker build -t [tag] .`. Note that the docker uses `nginx` to run a webserver.

### Setting environment variables

Normally, environment variables are included during build and can not be changed afterwards. This is a problem when building a docker container which can be applied to different scenarios (e.g. with different OAuth servers for authentication). Due to this fact, environment variables can be either included during build with a `.env` file in the root directory or with docker environment variables afterwards. Using docker environment variables will overwrite the environment variables included during build.

Environment variables that are available and should be overwritable by docker environment variables later should be included in the `docker.blueprint.env` file. Note that this file must use `'` for indicating strings and the format is as follows:
```
    '[NAME_OF_VARIABLE_IN_VUE]': '${NAME_OF_ENV_VARIABLE}'
```
Before starting the `nginx` process, the docker environment variables will be set under the `window.__env__` variable in the `index.html` file.

### Using environment variables

To use environment variables that can be set during runtime (with docker environment variables), add the variable to the `docker.blueprint.env` file as explained above. Then use the `getEnvVar` function in `src/util/env.ts` for getting the value of an environment variable.
