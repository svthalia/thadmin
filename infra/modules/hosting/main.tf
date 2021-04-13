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
  bucket = "thalia-${var.prefix}"
  acl    = "private"
  force_destroy = "true"

  tags = var.tags
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

resource "aws_s3_bucket_object" "code_build_object" {
  for_each = fileset("${data.external.code_build.working_dir}/${data.external.code_build.result.dest}", "**")
	key    = each.value
	source = "${data.external.code_build.working_dir}/${data.external.code_build.result.dest}/${each.value}"
	bucket = aws_s3_bucket.this.bucket

  etag         = filemd5("${data.external.code_build.working_dir}/${data.external.code_build.result.dest}/${each.value}")
  content_type = lookup(local.mime_type_mappings, concat(regexall("\\.([^\\.]*)$", each.value), [[""]])[0][0], "application/octet-stream")
}