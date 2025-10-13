from langchain.tools import tool
from tavily import TavilyClient
import os 
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

tavily_search_key = os.getenv("TAVILY_SEARCH_KEY")

tavily_client = TavilyClient()
@tool
def tavily_search(query: str) -> str:
    """
    Search the web for current, accurate, and factual Formula 1 information using Tavily.
    
    ⚠️ CRITICAL REQUIREMENTS:
    1. ALWAYS verify current information - F1 lineups and teams change frequently
    2. ALWAYS provide SOURCE URLs in your response - never give info without citing sources
    3. Include EXACT Grand Prix name for race-specific queries (DNFs, incidents, results)
    
    KEY EXAMPLES:
    
    Example 1 - Team Changes (2025 season):
        WRONG: Search "Lewis Hamilton team" 
        CORRECT: Search "Lewis Hamilton team 2025 current" → He's at Ferrari now, not Mercedes
    
    Example 2 - Race-Specific Queries (DNFs, incidents):
        WRONG: Search "Oscar Piastri DNF 2025"
        CORRECT: Search "Oscar Piastri DNF Azerbaijan Grand Prix 2025" → Include exact race name
    
    Example 3 - Response Format (ALWAYS include sources):
        "Lewis Hamilton drives for Ferrari in 2025 alongside Charles Leclerc.
        
        Sources:
        - Formula1.com: [URL]
        - Autosport: [URL]"
    
    SEARCH TIPS:
    - Always include "2025" or "current season" in queries
    - Use full Grand Prix names (e.g., "Azerbaijan Grand Prix" not "Baku")
    - For DNFs/incidents: "driver name DNF/incident [Grand Prix Name] 2025"
    
    ⚠️ Never assume historical data is current. Always verify the latest information.
    """
    response = tavily_client.search(query=query, search_depth="advanced")
    results = response.get("results", [])
    if not results:
        return "No results found."
    
    # Format results with emphasis on sources
    output = []
    sources_list = []
    
    # Include top 5 results for better accuracy (especially for race-specific queries)
    for i, r in enumerate(results[:5], 1):
        title = r.get("title", "")
        content = r.get("content", "")
        url = r.get("url", "")
        
        # Add formatted result
        output.append(f"🔹 Result {i}: {title}\n{content}\n🔗 Source: {url}")
        
        # Collect source for summary
        sources_list.append(f"  {i}. {url}")
    
    # Add prominent source section at the end
    sources_section = "\n\n" + "="*50 + "\n📚 SOURCES - Include these in your response:\n" + "\n".join(sources_list) + "\n" + "="*50
    
    return "\n\n".join(output) + sources_section
