import boto3

def list_ec2_instances():
    ec2 = boto3.client('ec2')
    response = ec2.describe_instances()

    print("\n=== EC2 INSTANCES ===")
    for reservation in response['Reservations']:
        for instance in reservation['Instances']:
            print(f"Instance ID: {instance['InstanceId']}")
            print(f"State: {instance['State']['Name']}")
            print(f"Type: {instance['InstanceType']}")
            print("-" * 30)


def list_s3_buckets():
    s3 = boto3.client('s3')
    response = s3.list_buckets()

    print("\n=== S3 BUCKETS ===")
    for bucket in response['Buckets']:
        print(bucket['Name'])


def list_iam_users():
    iam = boto3.client('iam')
    response = iam.list_users()

    print("\n=== IAM USERS ===")
    for user in response['Users']:
        print(user['UserName'])


if __name__ == "__main__":
    list_ec2_instances()
    list_s3_buckets()
    list_iam_users()