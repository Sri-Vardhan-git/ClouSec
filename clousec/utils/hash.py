import hashlib

def generate_finding_id(service, resource_id, issue, region):
    raw = f"{service}:{resource_id}:{issue}:{region}"
    return hashlib.sha256(raw.encode()).hexdigest()
