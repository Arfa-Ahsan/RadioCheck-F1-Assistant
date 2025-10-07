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
    """Search the web for current info using Tavily."""
    response = tavily_client.search(query=query, search_depth="advanced")
    results = response.get("results", [])
    if not results:
        return "No results found."
    output = []
    for r in results[:3]:
        title = r.get("title", "")
        content = r.get("content", "")
        url = r.get("url", "")
        output.append(f"🔹 {title}\n{content}\n🔗 {url}")
    return "\n\n".join(output)
