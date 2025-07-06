# video_search.py
from youtubesearchpython import VideosSearch
from typing import Tuple, List

class VideoSearchManager:
    def __init__(self):
        pass

    def search_videos(self, query: str) -> Tuple[str, List[str]]:
        """
        Search for videos related to the query
        Returns: Tuple of (primary_link, [additional_links])
        """
        try:
            videosSearch = VideosSearch(query, limit=3)  # Get 3 videos
            results = videosSearch.result()['result']
            
            if not results:
                return "", []
                
            primary_link = results[0]['link']
            additional_links = [video['link'] for video in results[1:]]
            
            return primary_link, additional_links
        except Exception as e:
            print(f"Error in video search: {str(e)}")
            return "", []

    def format_video_response(self, query: str) -> dict:
        """
        Format the video search results into a response dictionary
        """
        primary_link, additional_links = self.search_videos(query)
        return {
            "primary_video": primary_link,
            "additional_videos": additional_links
        }