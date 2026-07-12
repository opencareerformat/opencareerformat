#!/usr/bin/env python3
"""Minimal OCF command-line helper.

This script intentionally uses only the Python standard library. It does not
implement schema validation itself; the validate command delegates to the
reference Node/AJV validator.
"""

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


def main(argv):
    if len(argv) == 2:
        return print_summary(Path(argv[1]))

    if len(argv) == 3 and argv[1] == "summary":
        return print_summary(Path(argv[2]))

    if len(argv) == 3 and argv[1] == "validate":
        return run_validator(Path(argv[2]))

    if len(argv) == 4 and argv[1] == "--filter" and argv[2] == "private":
        return print_private_filtered(Path(argv[3]))

    print_usage()
    return 2


def print_usage():
    print(
        "\n".join(
            [
                "Usage:",
                "  python3 reference/cli/ocf.py <file.ocf.json>",
                "  python3 reference/cli/ocf.py summary <file.ocf.json>",
                "  python3 reference/cli/ocf.py validate <file.ocf.json>",
                "  python3 reference/cli/ocf.py --filter private <file.ocf.json>",
            ]
        ),
        file=sys.stderr,
    )


def load_json(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def print_summary(path):
    doc = load_json(path)
    meta = doc.get("meta", {})
    person = doc.get("person", {})

    print("OCF summary")
    print(f"File: {path}")
    print(f"schemaVersion: {doc.get('schemaVersion', '(missing)')}")
    print(f"meta.id: {meta.get('id', '(missing)')}")
    print(f"fileRole: {meta.get('fileRole', '(missing)')}")
    print(f"name: {render_name(person.get('name'))}")
    print(f"headline: {person.get('headline', '(missing)')}")

    summary = person.get("summary")
    if summary:
        print(f"summary: {summary}")

    print("")
    print("Counts")
    for key in [
        "sourceArtifacts",
        "experience",
        "skills",
        "certifications",
        "education",
        "projects",
        "publications",
        "openQuestions",
        "cautions",
        "talkingPoints",
        "positioningVariants",
    ]:
        value = doc.get(key)
        if isinstance(value, list):
            print(f"{key}: {len(value)}")

    headline_variants = [
        item
        for item in doc.get("positioningVariants", [])
        if isinstance(item, dict) and item.get("kind") == "headline"
    ]
    if headline_variants:
        print("")
        print("Headline variants")
        for item in headline_variants:
            label = item.get("label") or item.get("id") or "(unlabeled)"
            headline = item.get("headline", "(missing headline)")
            visibility = item.get("visibility", "(default)")
            print(f"- {label} [{visibility}]: {headline}")

    return 0


def run_validator(path):
    repo_root = Path(__file__).resolve().parents[2]
    validator = repo_root / "reference" / "validator" / "validate.js"
    node = os.environ.get("NODE") or shutil.which("node")
    if not node:
        print("Node.js not found. Install Node.js or set NODE=/path/to/node.", file=sys.stderr)
        return 127
    return subprocess.run([node, str(validator), str(path)]).returncode


def render_name(name):
    if isinstance(name, dict):
        return name.get("renderAs") or " ".join(
            part for part in [name.get("given"), name.get("family")] if part
        ) or "(missing)"
    if isinstance(name, str):
        return name
    return "(missing)"


def print_private_filtered(path):
    repo_root = Path(__file__).resolve().parents[2]
    filter_script = repo_root / "reference" / "cli" / "filter-private.js"
    node = os.environ.get("NODE") or shutil.which("node")
    if not node:
        print("Node.js not found. Install Node.js or set NODE=/path/to/node.", file=sys.stderr)
        return 127
    return subprocess.run([node, str(filter_script), str(path)]).returncode


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
