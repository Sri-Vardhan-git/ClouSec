import boto3
import json
from clousec.models import upsert_finding

iam = boto3.client("iam")


def is_policy_overly_permissive(policy_doc):
    statements = policy_doc.get("Statement", [])

    for stmt in statements:
        if stmt.get("Effect") == "Allow":
            if stmt.get("Action") == "*" or stmt.get("Resource") == "*":
                return True

    return False


def scan_role(role_name):
    policies = iam.list_attached_role_policies(RoleName=role_name)

    for p in policies["AttachedPolicies"]:
        policy_arn = p["PolicyArn"]

        version = iam.get_policy(PolicyArn=policy_arn)["Policy"]["DefaultVersionId"]

        policy_doc = iam.get_policy_version(
            PolicyArn=policy_arn,
            VersionId=version
        )["PolicyVersion"]["Document"]

        if is_policy_overly_permissive(policy_doc):
            upsert_finding(
                "IAM",
                role_name,
                "Overly permissive IAM policy",
                "CRITICAL",
                "global",
            )
