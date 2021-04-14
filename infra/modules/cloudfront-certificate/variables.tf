variable "domain_name" {
  description = "Domain name to create the certificate for"
  type        = string
}

variable "zone_id" {
  description = "Route53 zone to use for validation"
  type        = string
}

variable "tags" {
  description = "AWS tags for resources"
  type        = map(string)
}