import boto3
from datetime import datetime
from clousec.utils.db import findings_collection
from clousec.utils.aws_regions import get_all_regions

SENSITIVE_PORTS = {22, 3389}


def is_world_open(permission):
    """Check if rule allows 0.0.0.0/0"""
    for ip_range in permission.get("IpRanges", []):
        if ip_range.get("CidrIp") == "0.0.0.0/0":
            return True
    return False


from clousec.models import upsert_finding, resolve_finding

def scan_security_group(region, sg_id):
    print(f"🔍 Scanning EC2 security group {sg_id} in region {region}")

    ec2 = boto3.client("ec2", region_name=region)

    response = ec2.describe_security_groups(GroupIds=[sg_id])

    sg = response["SecurityGroups"][0]

    world_open_detected = False

    for perm in sg.get("IpPermissions", []):

        if is_world_open(perm):
            world_open_detected = True

            severity = "MEDIUM"

            from_port = perm.get("FromPort")
            to_port = perm.get("ToPort")

            if from_port in SENSITIVE_PORTS:
                severity = "HIGH"

            if from_port == 0 and to_port == 65535:
                severity = "CRITICAL"

            upsert_finding(
                service="EC2",
                resource_id=sg_id,
                issue="Security group open to world",
                severity=severity,
                region=region
            )

    # If no world open rule → resolve finding
    if not world_open_detected:
        resolve_finding(
            service="EC2",
            resource_id=sg_id,
            issue="Security group open to world",
            region=region
        )

    print("✅ Security group scan complete")


def scan_instance(region, instance_id):
    ec2 = boto3.client("ec2", region_name=region)

    response = ec2.describe_instances(InstanceIds=[instance_id])

    for reservation in response["Reservations"]:
        for instance in reservation["Instances"]:

            # 1️⃣ Public IP
            if instance.get("PublicIpAddress"):
                upsert_finding(
                    "EC2", instance_id,
                    "Instance has public IP",
                    "HIGH", region
                )
            else:
                resolve_finding(
                    "EC2", instance_id,
                    "Instance has public IP",
                    region
                )

            # 2️⃣ IMDSv1 Enabled
            metadata = instance.get("MetadataOptions", {})
            if metadata.get("HttpTokens") == "optional":
                upsert_finding(
                    "EC2", instance_id,
                    "IMDSv1 enabled",
                    "MEDIUM", region
                )
            else:
                resolve_finding(
                    "EC2", instance_id,
                    "IMDSv1 enabled",
                    region
                )

            # 3️⃣ Unencrypted EBS
            for block in instance.get("BlockDeviceMappings", []):
                volume_id = block["Ebs"]["VolumeId"]
                volume = ec2.describe_volumes(VolumeIds=[volume_id])["Volumes"][0]

                if not volume.get("Encrypted"):
                    upsert_finding(
                        "EC2", instance_id,
                        "Unencrypted EBS volume",
                        "HIGH", region
                    )
                else:
                    resolve_finding(
                        "EC2", instance_id,
                        "Unencrypted EBS volume",
                        region
                    )
