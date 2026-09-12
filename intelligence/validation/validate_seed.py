import json
import sys
from pathlib import Path


SEED_DIR = Path(__file__).resolve().parents[2] / "data" / "seed"


REQUIRED_FILES = [
    "districts.json",
    "sectors.json",
    "job_roles.json",
    "skills.json",
    "subskills.json",
    "job_role_requirements.json",
    "training_curricula.json",
    "curriculum_skill_mapping.json",
    "learning_resources.json",
    "resource_skill_mapping.json",
    "candidate_profiles.json",
    "candidate_skills.json",
    "candidate_learning.json",
    "training_centres.json",
    "market_demand.json",
    "training_supply.json",
]


def load_json(filename):
    path = SEED_DIR / filename

    if not path.exists():
        fail(f"Missing file: {filename}")

    try:
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        fail(f"Invalid JSON in {filename}: {e}")

    if not isinstance(data, list):
        fail(f"{filename} must contain a JSON array")

    return data


def fail(message):
    print(f"❌ {message}")
    sys.exit(1)


def ids(data, filename):
    result = set()

    for i, row in enumerate(data, 1):
        if "id" not in row:
            fail(f"{filename} row {i}: missing id")

        if row["id"] in result:
            fail(f"{filename} row {i}: duplicate id {row['id']}")

        result.add(row["id"])

    return result


def require_fields(data, filename, fields):
    for i, row in enumerate(data, 1):
        for field in fields:
            if field not in row:
                fail(f"{filename} row {i}: missing field '{field}'")


def require_fk(value, valid_ids, filename, row_number, field):
    if value not in valid_ids:
        fail(
            f"{filename} row {row_number}: "
            f"{field}={value} does not exist"
        )


def main():
    print("================================")
    print("SkillUp Seed Validation")
    print("================================\n")

    # ---------------------------------------------------------
    # 1. Load files
    # ---------------------------------------------------------

    data = {}

    for filename in REQUIRED_FILES:
        data[filename] = load_json(filename)

    print("✓ JSON files valid")

    # ---------------------------------------------------------
    # 2. Required fields
    # ---------------------------------------------------------

    require_fields(
        data["districts.json"],
        "districts.json",
        ["id", "state", "name"],
    )

    require_fields(
        data["sectors.json"],
        "sectors.json",
        ["id", "name"],
    )

    require_fields(
        data["job_roles.json"],
        "job_roles.json",
        ["id", "sector_id", "name"],
    )

    require_fields(
        data["skills.json"],
        "skills.json",
        ["id", "sector_id", "name"],
    )

    require_fields(
        data["subskills.json"],
        "subskills.json",
        ["id", "skill_id", "name"],
    )

    print("✓ Required fields valid")

    # ---------------------------------------------------------
    # 3. Primary IDs
    # ---------------------------------------------------------

    district_ids = ids(data["districts.json"], "districts.json")
    sector_ids = ids(data["sectors.json"], "sectors.json")
    job_role_ids = ids(data["job_roles.json"], "job_roles.json")
    skill_ids = ids(data["skills.json"], "skills.json")
    subskill_ids = ids(data["subskills.json"], "subskills.json")
    curriculum_ids = ids(
        data["training_curricula.json"],
        "training_curricula.json",
    )
    resource_ids = ids(
        data["learning_resources.json"],
        "learning_resources.json",
    )
    candidate_profile_ids = ids(
        data["candidate_profiles.json"],
        "candidate_profiles.json",
    )
    training_centre_ids = ids(
        data["training_centres.json"],
        "training_centres.json",
    )

    print("✓ Primary keys valid")

    # ---------------------------------------------------------
    # 4. Job role -> sector
    # ---------------------------------------------------------

    job_role_sector = {}

    for i, row in enumerate(data["job_roles.json"], 1):
        require_fk(
            row["sector_id"],
            sector_ids,
            "job_roles.json",
            i,
            "sector_id",
        )

        job_role_sector[row["id"]] = row["sector_id"]

    # ---------------------------------------------------------
    # 5. Skill -> sector
    # ---------------------------------------------------------

    skill_sector = {}

    for i, row in enumerate(data["skills.json"], 1):
        require_fk(
            row["sector_id"],
            sector_ids,
            "skills.json",
            i,
            "sector_id",
        )

        skill_sector[row["id"]] = row["sector_id"]

    # ---------------------------------------------------------
    # 6. Subskill -> skill
    # ---------------------------------------------------------

    subskill_skill = {}

    for i, row in enumerate(data["subskills.json"], 1):
        require_fk(
            row["skill_id"],
            skill_ids,
            "subskills.json",
            i,
            "skill_id",
        )

        subskill_skill[row["id"]] = row["skill_id"]

    print("✓ Skill/Subskill mappings valid")

    # ---------------------------------------------------------
    # 7. Job role requirements
    # ---------------------------------------------------------

    for i, row in enumerate(
        data["job_role_requirements.json"], 1
    ):
        require_fk(
            row["job_role_id"],
            job_role_ids,
            "job_role_requirements.json",
            i,
            "job_role_id",
        )

        require_fk(
            row["skill_id"],
            skill_ids,
            "job_role_requirements.json",
            i,
            "skill_id",
        )

    print("✓ Job Role/Sector mappings valid")

    # ---------------------------------------------------------
    # 8. Curriculum mappings
    # ---------------------------------------------------------

    for i, row in enumerate(
        data["curriculum_skill_mapping.json"], 1
    ):
        require_fk(
            row["curriculum_id"],
            curriculum_ids,
            "curriculum_skill_mapping.json",
            i,
            "curriculum_id",
        )

        require_fk(
            row["skill_id"],
            skill_ids,
            "curriculum_skill_mapping.json",
            i,
            "skill_id",
        )

        require_fk(
            row["subskill_id"],
            subskill_ids,
            "curriculum_skill_mapping.json",
            i,
            "subskill_id",
        )

        actual_skill = subskill_skill[row["subskill_id"]]

        if actual_skill != row["skill_id"]:
            fail(
                "curriculum_skill_mapping.json "
                f"row {i}: subskill_id={row['subskill_id']} "
                f"belongs to skill_id={actual_skill}, "
                f"but row uses skill_id={row['skill_id']}"
            )

    print("✓ Curriculum mappings valid")

    # ---------------------------------------------------------
    # 9. Learning resource mappings
    # ---------------------------------------------------------

    for i, row in enumerate(
        data["resource_skill_mapping.json"], 1
    ):
        require_fk(
            row["learning_resource_id"],
            resource_ids,
            "resource_skill_mapping.json",
            i,
            "learning_resource_id",
        )

        require_fk(
            row["skill_id"],
            skill_ids,
            "resource_skill_mapping.json",
            i,
            "skill_id",
        )

        require_fk(
            row["subskill_id"],
            subskill_ids,
            "resource_skill_mapping.json",
            i,
            "subskill_id",
        )

        actual_skill = subskill_skill[row["subskill_id"]]

        if actual_skill != row["skill_id"]:
            fail(
                "resource_skill_mapping.json "
                f"row {i}: subskill_id={row['subskill_id']} "
                f"belongs to skill_id={actual_skill}, "
                f"but row uses skill_id={row['skill_id']}"
            )

    print("✓ Learning resource mappings valid")

    # ---------------------------------------------------------
    # 10. Candidate profiles
    # ---------------------------------------------------------

    for i, row in enumerate(
        data["candidate_profiles.json"], 1
    ):
        require_fk(
            row["district_id"],
            district_ids,
            "candidate_profiles.json",
            i,
            "district_id",
        )

        require_fk(
            row["career_goal_job_role_id"],
            job_role_ids,
            "candidate_profiles.json",
            i,
            "career_goal_job_role_id",
        )

    # Candidate skills
    for i, row in enumerate(data["candidate_skills.json"], 1):
        require_fk(
            row["candidate_id"],
            candidate_profile_ids,
            "candidate_skills.json",
            i,
            "candidate_id",
        )

        require_fk(
            row["skill_id"],
            skill_ids,
            "candidate_skills.json",
            i,
            "skill_id",
        )

    print("✓ Candidate mappings valid")

    # ---------------------------------------------------------
    # 11. Training centres
    # ---------------------------------------------------------

    for i, row in enumerate(
        data["training_centres.json"], 1
    ):
        require_fk(
            row["district_id"],
            district_ids,
            "training_centres.json",
            i,
            "district_id",
        )

    # ---------------------------------------------------------
    # 12. Market demand
    # ---------------------------------------------------------

    for i, row in enumerate(
        data["market_demand.json"], 1
    ):
        require_fk(
            row["district_id"],
            district_ids,
            "market_demand.json",
            i,
            "district_id",
        )

        require_fk(
            row["job_role_id"],
            job_role_ids,
            "market_demand.json",
            i,
            "job_role_id",
        )

        require_fk(
            row["skill_id"],
            skill_ids,
            "market_demand.json",
            i,
            "skill_id",
        )

        if row["demand_count"] < 0:
            fail(
                f"market_demand.json row {i}: "
                "demand_count cannot be negative"
            )

        if row["source_type"] != "PROTOTYPE_SYNTHETIC":
            fail(
                f"market_demand.json row {i}: "
                "source_type must be PROTOTYPE_SYNTHETIC"
            )

    print("✓ Market demand valid")

    # ---------------------------------------------------------
    # 13. Training supply
    # ---------------------------------------------------------

    for i, row in enumerate(
        data["training_supply.json"], 1
    ):
        require_fk(
            row["training_centre_id"],
            training_centre_ids,
            "training_supply.json",
            i,
            "training_centre_id",
        )

        require_fk(
            row["job_role_id"],
            job_role_ids,
            "training_supply.json",
            i,
            "job_role_id",
        )

        require_fk(
            row["skill_id"],
            skill_ids,
            "training_supply.json",
            i,
            "skill_id",
        )

        if row["capacity"] < 0:
            fail(
                f"training_supply.json row {i}: "
                "capacity cannot be negative"
            )

    print("✓ Training supply valid")

    # ---------------------------------------------------------
    # 14. Candidate learning
    # ---------------------------------------------------------

    for i, row in enumerate(
        data["candidate_learning.json"], 1
    ):
        require_fk(
            row["candidate_id"],
            candidate_profile_ids,
            "candidate_learning.json",
            i,
            "candidate_id",
        )

        require_fk(
            row["learning_resource_id"],
            resource_ids,
            "candidate_learning.json",
            i,
            "learning_resource_id",
        )

        progress = row.get("progress", 0)

        if not 0 <= progress <= 100:
            fail(
                f"candidate_learning.json row {i}: "
                "progress must be between 0 and 100"
            )

    print("✓ Candidate learning valid")

    # ---------------------------------------------------------
    # SUCCESS
    # ---------------------------------------------------------

    print("\n================================")
    print("SEED VALIDATION PASSED")
    print("================================")


if __name__ == "__main__":
    main()