import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SEED_DIR = ROOT / "data" / "seed"

OUTPUT = (
    ROOT
    / "backend"
    / "src"
    / "main"
    / "resources"
    / "db"
    / "migration"
    / "V15__seed_data.sql"
)


def load(filename):
    with open(SEED_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def sql_value(value):
    if value is None:
        return "NULL"

    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"

    if isinstance(value, (int, float)):
        return str(value)

    return "'" + str(value).replace("'", "''") + "'"


def insert(table, columns, rows):
    if not rows:
        return ""

    values = []

    for row in rows:
        values.append(
            "("
            + ", ".join(sql_value(row.get(column)) for column in columns)
            + ")"
        )

    return (
        f"INSERT INTO {table} ({', '.join(columns)}) VALUES\n"
        + ",\n".join(values)
        + ";\n"
    )


def main():

    print("================================")
    print("SkillUp V15 Seed Generator")
    print("================================\n")

    districts = load("districts.json")
    sectors = load("sectors.json")
    job_roles = load("job_roles.json")
    skills = load("skills.json")
    subskills = load("subskills.json")
    job_role_requirements = load("job_role_requirements.json")

    training_curricula = load("training_curricula.json")
    curriculum_skill_mapping = load(
        "curriculum_skill_mapping.json"
    )

    learning_resources = load("learning_resources.json")
    resource_skill_mapping = load(
        "resource_skill_mapping.json"
    )

    training_centres = load("training_centres.json")
    market_demand = load("market_demand.json")
    training_supply = load("training_supply.json")

    sql = []

    sql.append("-- SkillUp synthetic prototype seed data")
    sql.append("-- Generated from data/seed/*.json")
    sql.append("-- Source data is synthetic and intended for prototype use.\n")

    sql.append(
        insert(
            "districts",
            ["id", "state", "name"],
            districts,
        )
    )

    sql.append(
        insert(
            "sectors",
            ["id", "name"],
            sectors,
        )
    )

    sql.append(
        insert(
            "job_roles",
            ["id", "sector_id", "name"],
            job_roles,
        )
    )

    sql.append(
        insert(
            "skills",
            ["id", "sector_id", "name"],
            skills,
        )
    )

    sql.append(
        insert(
            "subskills",
            ["id", "skill_id", "name"],
            subskills,
        )
    )

    sql.append(
        insert(
            "job_role_requirements",
            [
                "job_role_id",
                "skill_id",
                "required_level",
            ],
            job_role_requirements,
        )
    )

    sql.append(
        insert(
            "training_curricula",
            ["id", "name", "version"],
            training_curricula,
        )
    )

    sql.append(
        insert(
            "curriculum_skill_mapping",
            [
                "curriculum_id",
                "skill_id",
                "subskill_id",
                "module_name",
            ],
            curriculum_skill_mapping,
        )
    )

    sql.append(
        insert(
            "learning_resources",
            [
                "id",
                "name",
                "provider",
                "url",
                "type",
                "sector_id",
                "job_role_id",
            ],
            learning_resources,
        )
    )

    sql.append(
        insert(
            "resource_skill_mapping",
            [
                "learning_resource_id",
                "skill_id",
                "subskill_id",
            ],
            resource_skill_mapping,
        )
    )

    sql.append(
        insert(
            "training_centres",
            [
                "id",
                "district_id",
                "name",
                "ownership_type",
            ],
            training_centres,
        )
    )

    sql.append(
        insert(
            "market_demand",
            [
                "id",
                "district_id",
                "job_role_id",
                "skill_id",
                "year",
                "demand_count",
                "source_type",
            ],
            market_demand,
        )
    )

    sql.append(
        insert(
            "training_supply",
            [
                "id",
                "training_centre_id",
                "job_role_id",
                "skill_id",
                "year",
                "capacity",
            ],
            training_supply,
        )
    )

    # Reset ID sequences after explicit seed IDs.
    sequence_tables = [
        "districts",
        "sectors",
        "job_roles",
        "skills",
        "subskills",
        "training_curricula",
        "learning_resources",
        "training_centres",
        "market_demand",
        "training_supply",
    ]

    for table in sequence_tables:
        sql.append(
            f"""SELECT setval(
    pg_get_serial_sequence('{table}', 'id'),
    COALESCE((SELECT MAX(id) FROM {table}), 1),
    true
);"""
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write("\n".join(sql))

    print(f"✓ Generated: {OUTPUT}")
    print()
    print(f"Districts:              {len(districts)}")
    print(f"Sectors:                {len(sectors)}")
    print(f"Job roles:              {len(job_roles)}")
    print(f"Skills:                 {len(skills)}")
    print(f"Subskills:              {len(subskills)}")
    print(
        f"Job role requirements:  {len(job_role_requirements)}"
    )
    print(f"Curricula:              {len(training_curricula)}")
    print(
        f"Curriculum mappings:    {len(curriculum_skill_mapping)}"
    )
    print(f"Learning resources:     {len(learning_resources)}")
    print(
        f"Resource mappings:      {len(resource_skill_mapping)}"
    )
    print(f"Training centres:       {len(training_centres)}")
    print(f"Market demand:          {len(market_demand)}")
    print(f"Training supply:        {len(training_supply)}")
    print()
    print("================================")
    print("V15 GENERATION COMPLETE")
    print("================================")


if __name__ == "__main__":
    main()