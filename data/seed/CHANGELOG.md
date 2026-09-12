# v2 changes vs your uploaded seed

## Bug fix
- `job_role_requirements.required_level` and `candidate_skills.proficiency` used `"BASIC"`,
  which isn't in your API enum (`BEGINNER, INTERMEDIATE, ADVANCED, EXPERT`). Replaced with
  `BEGINNER` everywhere so candidate-vs-requirement matching won't silently break.

## market_demand.json / training_supply.json — now 3 years (2024–2026), not 1
Your original files only had `year: 2026`, so `priorityFactors.demandGrowthPercent` and
`futureDemand` (INCREASING/STABLE/DECREASING) had nothing to compute from. I back-derived
2024/2025 from your 2026 numbers using per-sector growth rates, with a deliberate story:

- EV/Automotive and Renewable Energy demand grow fastest (18–20%/yr) — matches the real
  state-level EV/solar push narrative.
- Training capacity in **Nashik, Chhatrapati Sambhajinagar, Nanded, Amravati** grows much
  slower than demand (capacity growth = ~35% of demand growth) — these districts show a
  visibly widening gap 2024→2026, which is a clean "priority district" story for your demo.
- **Pune, Mumbai City, Thane** keep supply closer to demand (~90%), so they read as
  comparatively well-served — useful contrast when a judge asks "show me a district that's
  doing fine vs. one that isn't."

Verified aggregate gap trend (demand − supply, summed across all roles/skills):
Nashik goes from a gap of 446 (2024) to 779 (2026) — a ~75% increase — while Mumbai City
grows a much flatter ~16% over the same period. That's the kind of number you can show live.

## candidate_curriculum_enrollments.json — new file
This table didn't exist in your original seed (it was added to the schema after the seed
was generated). Added 10 enrollment records linking candidates → curricula → training
centres in their own district, with realistic status distribution (ENROLLED 20%,
IN_PROGRESS 35%, COMPLETED 35%, DROPPED 10%) and enrolled_at/completed_at dates.

## candidate_profiles / candidate_skills / candidate_learning — expanded from 1 → 25 candidates
Your original seed had exactly one candidate (tied to the `candidate@skillup.demo` login).
That's fine for a single login demo but too thin for admin dashboards (district rankings,
skill-gap views, aggregate charts all look empty or trivial with n=1). Added 24 more:
- Spread across all 10 districts
- Career goals and skills biased toward the sector mix of their district (not random noise)
- 2–4 skills each, weighted toward Beginner/Intermediate (matches real early-career profiles)
- 0–3 learning resource enrollments, 0–2 curriculum enrollments

## synthetic_candidate_users.json — new file
The 24 new candidate profiles need `user_id` foreign keys. Since `demo_users.json` is meant
to stay as your 4 curated login accounts, I put the 24 synthetic candidate user records in a
separate file (ids 101–124, `password_hash: "SYNTHETIC_SEED"`) rather than polluting your
login fixture. Merge these into your `users` table alongside `demo_users.json`.

## Unchanged (already solid, no notes)
districts, sectors, job_roles, skills, subskills, training_curricula,
curriculum_skill_mapping, learning_resources, resource_skill_mapping, training_centres,
demo_users.
