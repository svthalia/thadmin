variable "tags" {
  description = "AWS tags for resources"
  type        = map(string)
}

variable "prefix" {
  description = "Name to be used on all the resources as identifier"
  type        = string
}

variable "domain_name" {
  description = "Domain name the application will be hosted on"
  type        = string
}

variable "s3_bucket" {
  description = "Name of the S3 bucket that the application is deployed to"
  type        = string
}