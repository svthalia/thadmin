terraform {
  required_version = ">=0.14.10"

  required_providers {
    aws = ">= 4.2.0"
  }

  backend "s3" {
    bucket = "thalia-terraform-state"
    key    = "thadmin/production.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = var.aws_region
}

module "thadmin_hosting" {
  source = "../../modules/hosting"
  prefix = var.prefix
  tags   = var.aws_tags
}

module "thadmin_routing" {
  source      = "../../modules/routing"
  prefix      = var.prefix
  domain_name = var.domain_name
  tags        = var.aws_tags
  s3_bucket   = module.thadmin_hosting.s3_bucket
}