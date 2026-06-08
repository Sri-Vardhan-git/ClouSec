from flask import Flask, jsonify, request
from clousec.scanners.ec2_scanner import scan_security_group
from clousec.scanners.s3_scanner import scan_bucket
from clousec.scanners.iam_scanner import scan_role
from clousec.utils.db import findings_collection
from clousec.services.inventory_service import get_inventory
from flask_cors import CORS


app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])


@app.route("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/inventory")
def inventory():
    return jsonify(get_inventory())

@app.route("/findings")
def list_findings():
    status = request.args.get("status")  # OPEN or RESOLVED

    query = {}
    if status:
        query["status"] = status.upper()

    findings = list(findings_collection.find(query, {"_id": 0}))

    return jsonify(findings)


@app.route("/event", methods=["POST"])
def handle_event():
    event = request.json

    if not event:
        return jsonify({"error": "Invalid event"}), 400

    source = event.get("source")
    region = event.get("region")
    detail = event.get("detail", {})
    event_name = detail.get("eventName")

    print(f"[EVENT] {source} | {event_name} | {region}")

    # -------------------------
    # EC2 Events
    # -------------------------
    if source == "aws.ec2":

        if event_name == "RunInstances":
            instances = detail.get("responseElements", {}) \
                              .get("instancesSet", {}) \
                              .get("items", [])

            for inst in instances:
                instance_id = inst.get("instanceId")
                if instance_id:
                    scan_instance(region, instance_id)

        elif event_name in [
            "ModifyInstanceAttribute",
            "StartInstances",
            "StopInstances"
        ]:
            instance_id = detail.get("requestParameters", {}).get("instanceId")
            if instance_id:
                scan_instance(region, instance_id)

        elif event_name in [
            "AuthorizeSecurityGroupIngress",
            "RevokeSecurityGroupIngress"
        ]:
            sg_id = detail.get("requestParameters", {}).get("groupId")
            if sg_id:
                scan_security_group(region, sg_id)

    # -------------------------
    # S3 Events
    # -------------------------
    elif source == "aws.s3":

        bucket_name = detail.get("requestParameters", {}).get("bucketName")
        if bucket_name:
            scan_bucket(bucket_name)

    # -------------------------
    # IAM Events
    # -------------------------
    elif source == "aws.iam":

        user_name = detail.get("requestParameters", {}).get("userName")
        role_name = detail.get("requestParameters", {}).get("roleName")

        if user_name:
            scan_user(user_name)

        if role_name:
            scan_role(role_name)

    return jsonify({"status": "processed"})


@app.route("/dashboard")
def dashboard():

    # Count OPEN findings
    open_count = findings_collection.count_documents({"status": "OPEN"})

    # Count RESOLVED findings
    resolved_count = findings_collection.count_documents({"status": "RESOLVED"})

    # -----------------------------
    # Group by severity (OPEN only)
    # -----------------------------
    severity_pipeline = [
        {"$match": {"status": "OPEN"}},
        {
            "$group": {
                "_id": "$severity",
                "count": {"$sum": 1}
            }
        }
    ]

    severity_result = findings_collection.aggregate(severity_pipeline)
    by_severity = {r["_id"]: r["count"] for r in severity_result}

    # -----------------------------
    # Group by service (OPEN only)
    # -----------------------------
    service_pipeline = [
        {"$match": {"status": "OPEN"}},
        {
            "$group": {
                "_id": "$service",
                "count": {"$sum": 1}
            }
        }
    ]

    service_result = findings_collection.aggregate(service_pipeline)
    by_service = {r["_id"]: r["count"] for r in service_result}

    # -----------------------------
    # Open findings list
    # -----------------------------
    open_findings = list(
        findings_collection.find(
            {"status": "OPEN"},
            {
                "_id": 0,
                "issue": 1,
                "resource_id": 1,
                "severity": 1,
                "region": 1,
                "service": 1,
            },
        ).limit(10)
    )

    summary = {
        "open": open_count,
        "resolved": resolved_count,
        "by_severity": by_severity,
        "by_service": by_service,
        "open_findings": open_findings,
    }

    return jsonify(summary)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
