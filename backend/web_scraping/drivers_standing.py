import os
import requests
from bs4 import BeautifulSoup
import json
import re

# URL to scrape
url = "https://www.formula1.com/en/results/2025/drivers"
headers = {"User-Agent": "Mozilla/5.0"}

# Send the request
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

# Find the table by class
table = soup.find("table", class_="f1-table f1-table-with-data w-full")

# Create output folder if it doesn't exist
os.makedirs("scraped_data", exist_ok=True)

if not table:
    print("❌ Table not found. Might be loaded via JavaScript.")
else:
    rows = table.find_all("tr")
    data = []

    # Extract headers
    headers = [th.text.strip() for th in rows[0].find_all("th")]

    # Extract table rows
    for row in rows[1:]:
        cells = [td.text.strip() for td in row.find_all("td")]
        if len(cells) == len(headers):
            data.append(dict(zip(headers, cells)))

    # --- CLEANING SECTION ---
    for item in data:
        driver = item.get("DRIVER", "")
        # Remove trailing 3-letter code like "PIA", "NOR", etc.
        item["DRIVER"] = re.sub(r"[A-Z]{3}$", "", driver).strip()

        # Clean up special spaces and trim
        for key, value in item.items():
            if isinstance(value, str):
                item[key] = value.replace("\xa0", " ").strip()

    # --- SAVE CLEANED DATA ---
    output_path = "scraped_data/driver_standing.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ Data saved successfully to {output_path}")
