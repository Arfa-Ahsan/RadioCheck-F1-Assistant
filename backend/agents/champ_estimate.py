import os
import json
import random
from typing import List, Tuple, Optional
from langchain.tools import tool


@tool
def get_championship_odds(driver_name: str, total_races: int = 24, races_done: Optional[int] = None, simulations: int = 1000) -> str:
    """
    Estimate the chance of a driver winning the championship based on local standings (driver_standing.json).
    This function provides two safety checks and a Monte Carlo simulation to estimate odds more realistically:
    - Robust file path handling (relative to this module)
    - Edge cases when there are no remaining races
    - A simple Monte Carlo simulation that simulates remaining races using weights based on current points

    Parameters:
      driver_name: substring match for the driver's name
      total_races: total races in the season
      races_done: races completed so far
      simulations: number of Monte Carlo simulations to run (set to 0 to skip simulation)
    """
    base_path = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_path, "..", "scraped_data", "driver_standing.json")
    with open(data_path, "r", encoding="utf-8") as f:
        drivers = json.load(f)

    # If races_done wasn't provided, try to read from a scraped season metadata file.
    auto_notice = False
    if races_done is None:
        season_meta_path = os.path.join(base_path, "..", "scraped_data", "season_meta.json")
        try:
            with open(season_meta_path, "r", encoding="utf-8") as smf:
                meta = json.load(smf)
                # Accept multiple possible keys
                races_done = int(meta.get("races_done") or meta.get("completed_races") or meta.get("current_round") or 0)
        except FileNotFoundError:
            # fallback to previous default (keeps backward compatibility)
            races_done = 18
            auto_notice = True
        except Exception:
            races_done = 18
            auto_notice = True

    # Normalize and convert points to floats
    for d in drivers:
        try:
            d["PTS."] = float(d.get("PTS.", 0))
        except Exception:
            d["PTS."] = 0.0

    # Find leader and requested driver
    leader = max(drivers, key=lambda d: d["PTS."])
    driver = next((d for d in drivers if driver_name.lower() in d["DRIVER"].lower()), None)
    if not driver:
        return f"Could not find '{driver_name}' in the standings. Please provide a valid driver name."

    leader_points = float(leader["PTS."])
    driver_points = float(driver["PTS."])
    remaining = total_races - races_done
    if remaining <= 0:
        # Season finished or invalid input
        if driver_points >= leader_points:
            return f"{driver['DRIVER']} is currently the champion with {driver_points} points (season complete)."
        else:
            return f"The season is complete. {driver['DRIVER']} finished with {driver_points} points; leader was {leader['DRIVER']} with {leader_points} points."

    max_points = remaining * 25

    # Quick mathematical check
    if driver_points + max_points < leader_points:
        return f"{driver['DRIVER']} has no mathematical chance of winning this season."

    diff = leader_points - driver_points

    # If simulations disabled, return a simple analytic bound (clamped)
    if not simulations or simulations <= 0:
        odds = max(0.0, min(100.0, round((1 - diff / max_points) * 100.0, 2)))
        return (
            f"{driver['DRIVER']} currently has {driver_points} points.\n"
            f"Leader: {leader['DRIVER']} with {leader_points} points.\n"
            f"Simple estimated chance of winning (no simulation): {odds}%"
        )


    # Monte Carlo simulation:
    # - Use current points + 1 as weight for sampling finishing order (higher points -> more likely to finish higher)
    # - For each remaining race, sample a permutation of drivers without replacement using weighted sampling
    # - Allocate standard F1 points to top10 finishers
    points_scheme = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

    names = [d["DRIVER"] for d in drivers]
    base_points = {d["DRIVER"]: d["PTS."] for d in drivers}

    def weighted_sample_without_replacement(pop: List[str], weights: List[float], k: int) -> List[str]:
        pop_copy = pop[:]
        w = weights[:]
        selected = []
        for _ in range(min(k, len(pop_copy))):
            total = sum(w)
            if total <= 0:
                # fallback to uniform
                idx = random.randrange(len(pop_copy))
            else:
                r = random.random() * total
                cum = 0.0
                idx = 0
                for i, ww in enumerate(w):
                    cum += ww
                    if r <= cum:
                        idx = i
                        break
            selected.append(pop_copy.pop(idx))
            w.pop(idx)
        return selected

    wins = 0.0
    for sim in range(simulations):
        sim_points = base_points.copy()
        # Simulate each remaining race
        for _ in range(remaining):
            weights = [base_points[n] + 1.0 for n in names]
            order = weighted_sample_without_replacement(names, weights, k=len(names))
            # award points to top10
            for pos_idx, driver_name_sim in enumerate(order[:10]):
                sim_points[driver_name_sim] += points_scheme[pos_idx]
        # determine champion(s)
        max_pts = max(sim_points.values())
        leaders = [n for n, p in sim_points.items() if p == max_pts]
        if driver['DRIVER'] in leaders:
            # if tied between multiple drivers, count fractional win
            wins += 1.0 / len(leaders)

    odds_pct = round((wins / simulations) * 100.0, 2)

    # Compose a user-friendly summary
    return (
        f"{driver['DRIVER']} currently has {driver_points} points.\n"
        f"Leader: {leader['DRIVER']} with {leader_points} points.\n"
        f"Remaining races: {remaining}. Simulations run: {simulations}.\n"
        f"Estimated chance of winning the championship: {odds_pct}%\n"
        f"(This estimate uses a lightweight Monte Carlo simulation based on current points to model likely race finishes.)"
    )