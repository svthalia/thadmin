# Thadmin

### The history of Thadmin
Once upon a time, Thalia managed their own student canteen. It was the time that Martijn 
Broenland, treasurer of Thalia during that time, built a system to administer Thalia's inventory: _Thadmin_.
The system was really great and was updated over and over again. And when the former faculty building was demolished and
replaced by the new Huygens building, and the new student canteens were shared with other associations, Thadmin stayed.
But as with every proper software product, after about 15 years, they start falling apart, especially when they are 
<s>not really</s> really not maintained. In 2020, the Thadmin is still being used as a TUI-based barcode scanner point
of sale console, pushing canteen sales to Tantalus.

Fast-forward to 2021: Thalia released their very own payment system Thalia Pay. To allow members to use this payment 
system for point of sale orders, Thalia needs a cash register system. It's time to revive Thadmin.

### What is Thadmin
Thadmin is a frontend Point of Sale client that integrates with Thalia's [`concrexit`](https://github.com/svthalia/concrexit).
It provides a nice user interface for (committee/board) members to create orders on the `concrexit` sales backend. 
Moreover, it shows QR codes that members can scan to pay for their orders. This payment functionality itself, however,
is not implemented in Thadmin itself. Thadmin really only provides a user interface to those that are managing shifts.

### Getting started
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

It is also possible to define these variables in your terminal's environment directly.

Also note that you will need a running [`concrexit`](https://github.com/svthalia/concrexit) instance on your machine 
to use the previous `.env` configuration. The `concrexit` instance must also be configured for accepting OAuth requests 
from `Thadmin`.

### Linting
Use `yarn lint` to lint and fix files.

### Deploying

Use `yarn build` to compile and minify for production. This will give you the correct distributable files.

However, this repository also contains the full infrastructure to deploy staged environments. 
You need an installation of [Terraform](https://terraform.io) to do this. We recommend using [tfenv](https://github.com/tfutils/tfenv) to install the correct version.

To be able to deploy Thadmin you need access to the Thalia AWS account with permissions to the Route53, Cloudfront, ACM and S3 services. However, if you only want to update the application itself you should only need access to the correct S3 bucket.

#### First time

To deploy the develop environment make sure your working directory is set to `infra/stages/develop`.

1. Setup the correct variables (see 'Getting started')
2. Run `terraform init`
3. Run `terraform apply` to deploy everything

It is possible to target certain resources and deploy only parts of the configuration:

```
terraform apply -target="module.thadmin_hosting"
terraform destroy -target="module.thadmin_routing"
```

#### Environments

The main branch of this repository automatically deploys to our staging environment. We have setup GitHub Environments to be able to semi-automatically deploy the production version as well.

