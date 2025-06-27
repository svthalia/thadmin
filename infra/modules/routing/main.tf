##################
# Base resources #
##################

data "aws_route53_zone" "this" {
  name = join(".", slice(split(".", var.domain_name), 1, length(split(".", var.domain_name))))
}

data "aws_s3_bucket" "this" {
  bucket = var.s3_bucket
}

##############
# CloudFront #
##############

module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "4.2.0"

  aliases = [var.domain_name]

  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  retain_on_delete    = false
  wait_for_deployment = false

  default_root_object = "index.html"

  create_origin_access_identity = true
  origin_access_identities = {
    s3_bucket = "Access from the CloudFront distribution"
  }

  origin = {
    s3_bucket = {
      domain_name = data.aws_s3_bucket.this.bucket_regional_domain_name
      s3_origin_config = {
        origin_access_identity = "s3_bucket" # key in `origin_access_identities`
      }
    }
  }

  default_cache_behavior = {
    path_pattern           = "*"
    target_origin_id       = "s3_bucket"
    viewer_protocol_policy = "redirect-to-https"
    # This is id for SecurityHeadersPolicy copied from https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-response-headers-policies.html
    response_headers_policy_id = "67f7725c-6f97-4210-82d7-5512b31e9d03"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true
    query_string    = true
  }

  custom_error_response = [
    {
      error_code            = 404
      response_code         = 200
      response_page_path    = "/index.html"
      error_caching_min_ttl = 60
    }
  ]

  viewer_certificate = {
    acm_certificate_arn      = module.acm.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }

  tags = var.tags
}

#######
# ACM #
#######

module "acm" {
  source = "../cloudfront-certificate"

  domain_name = var.domain_name
  zone_id     = data.aws_route53_zone.this.id

  tags = var.tags
}

###########
# Route53 #
###########

resource "aws_route53_record" "api" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = var.prefix
  type    = "A"

  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

######################################
# Origin Access Identity Permissions #
######################################
data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${data.aws_s3_bucket.this.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = module.cloudfront.cloudfront_origin_access_identity_iam_arns
    }
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = [data.aws_s3_bucket.this.arn]

    principals {
      type        = "AWS"
      identifiers = module.cloudfront.cloudfront_origin_access_identity_iam_arns
    }
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = data.aws_s3_bucket.this.id
  policy = data.aws_iam_policy_document.s3_policy.json
}