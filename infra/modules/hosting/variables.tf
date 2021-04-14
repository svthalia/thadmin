variable "tags" {
  description = "AWS tags for resources"
  type        = map(string)
}

variable "prefix" {
  description = "Name to be used on all the resources as identifier"
  type        = string
}