##########
# Locals #
##########

locals {
  mime_type_mappings = {
    html = "text/html",
    js   = "text/javascript",
    css  = "text/css"
  }

  root_directory = "${abspath(path.module)}/../../../"
}

##############
# S3 bucket #
##############
resource "aws_s3_bucket" "this" {
  bucket        = "thalia-${var.prefix}"
  force_destroy = "true"
  tags = var.tags
}

resource "aws_s3_bucket_acl" "this" {
  bucket = aws_s3_bucket.this.id
  acl    = "private"
}

resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag", "Content-Type", "Accept"]
    max_age_seconds = 3000
  }
}

############
# Building #
############

data "external" "code_build" {
  program = ["bash", "-c", <<EOT
(yarn build) >&2 && echo "{\"dest\": \"dist\"}"
EOT
  ]
  working_dir = local.root_directory
}

############
# Uploading objects #
############

resource "aws_s3_object" "code_build_object" {
  for_each = fileset("${data.external.code_build.working_dir}/${data.external.code_build.result.dest}", "**")
  key      = each.value
  source   = "${data.external.code_build.working_dir}/${data.external.code_build.result.dest}/${each.value}"
  bucket   = aws_s3_bucket.this.bucket

  etag         = filemd5("${data.external.code_build.working_dir}/${data.external.code_build.result.dest}/${each.value}")
  content_type = lookup(local.mime_type_mappings, concat(regexall("\\.([^\\.]*)$", each.value), [[""]])[0][0], "application/octet-stream")
}