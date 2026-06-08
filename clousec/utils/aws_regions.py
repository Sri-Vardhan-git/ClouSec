import boto3


def get_all_regions():
    """Return all enabled EC2 regions"""
    ec2 = boto3.client("ec2")

    response = ec2.describe_regions(AllRegions=False)

    return [r["RegionName"] for r in response["Regions"]]