from langchain.tools import tool
import re
import textwrap
from googleapiclient.discovery import build
import os
from datetime import datetime
youtube_key = os.getenv('YOUTUBE_API_KEY')
youtube = build('youtube', 'v3', developerKey=youtube_key)


@tool
def get_f1_highlights(query: str = "Formula 1 highlights", max_results: int = 3) -> str:
    """
    Fetches Formula 1 highlight videos from the official Formula 1 YouTube channel.
    If a year is specified, searches for highlights from that year.
    If no year is specified, returns the most recent highlights.
    
    Examples:
    - "Monza Grand Prix 2023" - Gets Monza highlights from 2023
    - "Singapore Grand Prix" - Gets most recent Singapore GP highlights
    - "highlights 2022" - Gets general F1 highlights from 2022
    """
    current_year = datetime.now().year
    
    # Detect an explicit year in the user's query (e.g., "2024", "2023")
    year_match = re.search(r"\b(20\d{2})\b", query)
    year = year_match.group(1) if year_match else str(current_year)
    
    # Clean the query and remove year to avoid duplication
    search_text = re.sub(r"\b20\d{2}\b", "", query).strip()
    
    # Build search query - always include the year
    search_query = f"{search_text} {year}" if search_text else f"Formula 1 {year}"
    
    # If a specific year was requested, use relevance order and filter by date range
    # Otherwise, use date order for most recent
    search_params = {
        "part": "snippet",
        "q": search_query,
        "maxResults": max_results,
        "type": "video",
        "channelId": "UCB_qr75-ydFVKSF9Dmo6izg"
    }
    
    # If searching for a specific year, order by relevance and add date filters
    if year_match:
        search_params["order"] = "relevance"
        # Set date range for the specified year
        search_params["publishedAfter"] = f"{year}-01-01T00:00:00Z"
        search_params["publishedBefore"] = f"{int(year)+1}-01-01T00:00:00Z"
    else:
        # For most recent, order by date
        search_params["order"] = "date"
    
    request = youtube.search().list(**search_params)
    response = request.execute()
    videos = response.get("items", [])
    
    if not videos:
        return f"No F1 videos found for '{search_query}'."
    
    # Take the top results without filtering by keywords
    filtered_videos = videos[:max_results]
    
    # Format output
    header = f"🎥 **F1 Highlights — {search_query}**\n\n"
    output = [header]
    
    for idx, video in enumerate(filtered_videos, start=1):
        title = video["snippet"]["title"]
        video_id = video["id"]["videoId"]
        description = video["snippet"].get("description", "").strip()
        description = textwrap.shorten(description, width=150, placeholder="...")
        published_at = video["snippet"].get("publishedAt", "")[:10]
        url = f"https://www.youtube.com/watch?v={video_id}"
        
        formatted = (
            f"**{idx}. {title}**\n"
            f"{description}\n"
            f"[Watch on YouTube]({url})\n"
            f" Published: {published_at}_\n\n"
            f"---\n\n"
        )
        output.append(formatted)
    
    return "".join(output)
