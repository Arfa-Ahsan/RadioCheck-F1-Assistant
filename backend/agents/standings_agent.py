from langchain.tools import tool
import os
import json

@tool
def get_f1_standings(query: str = "drivers", driver_name: str = "", top: int = 10) -> str:
    """
    Retrieve F1 driver or team standings from local scraped data.
    - query: "drivers" (default) or "teams"
    - driver_name: if provided, returns only that driver's standing
    - top: if query is "drivers", returns top N drivers (default 10); if "all", returns all drivers
    """
    base_path = os.path.dirname(os.path.abspath(__file__))
    driver_path = os.path.join(base_path, "..", "scraped_data", "driver_standing.json")
    team_path = os.path.join(base_path, "..", "scraped_data", "team_standing.json")

    if query.lower() == "teams":
        with open(team_path, "r", encoding="utf-8") as f:
            teams = json.load(f)
        lines = ["🏆 **F1 Constructors' Standings**"]
        for t in teams[:10]:
            lines.append(f"{t['POS.']}. {t['TEAM']} — {t['PTS.']} pts")
        return "\n".join(lines)

    # Default: drivers
    with open(driver_path, "r", encoding="utf-8") as f:
        drivers = json.load(f)

    if driver_name:
        found = [d for d in drivers if driver_name.lower() in d['DRIVER'].lower()]
        if not found:
            return f"No driver found for '{driver_name}'."
        d = found[0]
        return (
            f"**{d['DRIVER']}**\n"
            f"- Position: {d['POS.']}\n"
            f"- Team: {d['TEAM']}\n"
            f"- Nationality: {d['NATIONALITY']}\n"
            f"- Points: {d['PTS.']}"
        )

    # If 'all' in query, return all drivers
    if "all" in query.lower():
        show = drivers
    else:
        show = drivers[:top]
    lines = ["🏁 **F1 Drivers' Standings**"]
    for d in show:
        lines.append(f"{d['POS.']}. {d['DRIVER']} ({d['TEAM']}) — {d['PTS.']} pts")
    return "\n".join(lines)
