variable "prefix" {
  description = "Name to be used on all the resources as identifier"
  type        = string
}

variable "stage" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "aws_account_id" {
  type = string
}

variable "aws_profile" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "aws_tags" {
  type = map(string)
}