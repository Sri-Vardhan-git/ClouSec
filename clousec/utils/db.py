from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI not found in environment variables")

client = MongoClient(MONGO_URI)

# ✅ NEW DATABASE NAME
db = client["clousec_prod"]

findings_collection = db["findings"]
inventory_collection = db["inventory"]

# -------------------------
# Indexes (IMPORTANT)
# -------------------------

# Unique finding per issue per resource
findings_collection.create_index(
    [
        ("service", 1),
        ("resource_id", 1),
        ("issue", 1),
        ("region", 1),
    ],
    unique=True
)

# For dashboard performance
findings_collection.create_index("status")
findings_collection.create_index("severity")
findings_collection.create_index("service")

print("✅ MongoDB Atlas connected - clousec_prod ready")
