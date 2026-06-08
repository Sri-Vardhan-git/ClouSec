from datetime import datetime
from clousec.utils.db import findings_collection
from clousec.utils.hash import generate_finding_id


def upsert_finding(service, resource_id, issue, severity, region):
    finding_id = generate_finding_id(service, resource_id, issue, region)

    now = datetime.utcnow()

    findings_collection.update_one(
        {"finding_id": finding_id},
        {
            "$set": {
                "service": service,
                "resource_id": resource_id,
                "issue": issue,
                "severity": severity,
                "region": region,
                "status": "OPEN",
                "last_seen": now,
            },
            "$setOnInsert": {
                "first_seen": now,
                "resolved_at": None,
            },
        },
        upsert=True,
    )


def resolve_finding(service, resource_id, issue, region):
    findings_collection.update_one(
        {
            "service": service,
            "resource_id": resource_id,
            "issue": issue,
            "region": region,
            "status": "OPEN"
        },
        {
            "$set": {
                "status": "RESOLVED",
                "resolved_at": datetime.utcnow(),
                "last_seen": datetime.utcnow()
            }
        }
    )
