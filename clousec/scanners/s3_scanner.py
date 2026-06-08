import boto3
from botocore.exceptions import ClientError
from clousec.models import upsert_finding, resolve_finding

s3 = boto3.client("s3")


def scan_bucket(bucket_name):
    region = "global"

    # -------------------------
    # 1️⃣ Public Policy
    # -------------------------
    try:
        status = s3.get_bucket_policy_status(Bucket=bucket_name)
        is_public = status["PolicyStatus"]["IsPublic"]
    except ClientError:
        is_public = False

    if is_public:
        upsert_finding(
            "S3", bucket_name,
            "Public bucket policy",
            "HIGH", region
        )
    else:
        resolve_finding(
            "S3", bucket_name,
            "Public bucket policy",
            region
        )

    # -------------------------
    # 2️⃣ Public ACL
    # -------------------------
    try:
        acl = s3.get_bucket_acl(Bucket=bucket_name)
        public_acl = any(
            grant.get("Grantee", {}).get("URI", "").endswith("AllUsers")
            for grant in acl.get("Grants", [])
        )
    except ClientError:
        public_acl = False

    if public_acl:
        upsert_finding(
            "S3", bucket_name,
            "Public ACL enabled",
            "HIGH", region
        )
    else:
        resolve_finding(
            "S3", bucket_name,
            "Public ACL enabled",
            region
        )

    # -------------------------
    # 3️⃣ Block Public Access Disabled
    # -------------------------
    try:
        block = s3.get_public_access_block(Bucket=bucket_name)
        config = block["PublicAccessBlockConfiguration"]
        if not all(config.values()):
            upsert_finding(
                "S3", bucket_name,
                "Block Public Access disabled",
                "HIGH", region
            )
    except ClientError:
        pass

    # -------------------------
    # 4️⃣ Encryption Disabled
    # -------------------------
    try:
        s3.get_bucket_encryption(Bucket=bucket_name)
        resolve_finding(
            "S3", bucket_name,
            "S3 bucket not encrypted",
            region
        )
    except ClientError:
        upsert_finding(
            "S3", bucket_name,
            "S3 bucket not encrypted",
            "MEDIUM", region
        )
