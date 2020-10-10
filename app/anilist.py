import requests

API_URL = "https://graphql.anilist.co"

# Query string for Anilist's graphql api
QUERY = """
query ($id: Int) {
    Media (id: $id, type: ANIME) {
        id
        idMal
        title {
            english
        }
        genres
        averageScore
        popularity
    }
}
"""

# The query field 'popularity' used above is not used in the same way by MAL.
# On MAL, 'favorites' indicates the number of users with the show on a list.

def get_anilist_anime(id):
    """Returns dict with anime information from the Anilist API.

    Parameters
    ----------
    int: id
       Anilist id of the show.

    Returns
    -------
    dict
        Returns dictionary object containing results from the query.
    """
    variables = { "id": id }
    response = requests.post(API_URL, json={"query": QUERY,
                                            "variables": variables})

    return response.json()


