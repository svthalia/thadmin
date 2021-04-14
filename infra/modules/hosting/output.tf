output "s3_bucket" {
  description = "S3 bucket id where this application lives"
  value       = aws_s3_bucket.this.id
}