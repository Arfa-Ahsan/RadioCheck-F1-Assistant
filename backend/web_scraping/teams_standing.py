import os
import requests
from bs4 import BeautifulSoup
import json
import re

# URL to scrape (team standings)
url = "https://www.formula1.com/en/results/2025/team"
headers = {"User-Agent": "Mozilla/5.0"}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

# Same class used for team-table
table = soup.find("table", class_="f1-table f1-table-with-data w-full")

os.makedirs("scraped_data", exist_ok=True)

if not table:
    print("❌ Team standings table not found. Might be loaded via JavaScript.")
else:
    rows = table.find_all("tr")
    data = []
    # Get headers (e.g. “POS.”, “TEAM”, “PTS.”)
    headers = [th.text.strip() for th in rows[0].find_all("th")]

    for row in rows[1:]:
        cells = [td.text.strip() for td in row.find_all("td")]
        if len(cells) == len(headers):
            data.append(dict(zip(headers, cells)))


    # Save
    output_path = "scraped_data/team_standing.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ Team standings data saved to {output_path}")
