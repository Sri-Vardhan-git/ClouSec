import boto3
from clousec.config import ALLOWED_REGIONS


def get_inventory():
    inventory = {
        "ec2_instances": [],
        "security_groups": [],
        "s3_buckets": [],
        "iam_users": [],
        "iam_roles": [],
    }

    # EC2 (limited regions)
    for region in ALLOWED_REGIONS:
        ec2 = boto3.client("ec2", region_name=region)

        # Instances
        instances = ec2.describe_instances()
        for reservation in instances["Reservations"]:
            for instance in reservation["Instances"]:
                inventory["ec2_instances"].append({
                    "instance_id": instance["InstanceId"],
                    "state": instance["State"]["Name"],
                    "type": instance["InstanceType"],
                    "region": region
                })

        # Security Groups
        sgs = ec2.describe_security_groups()
        for sg in sgs["SecurityGroups"]:
            inventory["security_groups"].append({
                "group_id": sg["GroupId"],
                "group_name": sg["GroupName"],
                "region": region
            })

    # S3
    s3 = boto3.client("s3")
    buckets = s3.list_buckets()["Buckets"]
    for bucket in buckets:
        inventory["s3_buckets"].append({
            "bucket_name": bucket["Name"]
        })

    # IAM
    iam = boto3.client("iam")

    users = iam.list_users()["Users"]
    for user in users:
        inventory["iam_users"].append({
            "user_name": user["UserName"]
        })

    roles = iam.list_roles()["Roles"]
    for role in roles:
        inventory["iam_roles"].append({
            "role_name": role["RoleName"]
        })

    return inventory
