import requests

def get_mal_anime(mal_id):
    """Scrapes relevant information from the anime's page on MyAnimeList.

    If the parsing was successful, returns a dictionary

    Parameters
    ----------
    int: mal_id
        MyAnimeList id of the show.

    Returns
    -------
    dict
        Returns dictionary object containing scraped data.
    """
    try:
        URL = 'https://myanimelist.net/anime/' + str(mal_id)
        animepage = requests.get(URL).text
        soup = BeautifulSoup(animepage, 'lxml')
        genres = soup.find_all('span', itemprop='genre')
        members = soup.find("span", class_ = "numbers members").text
        members = members.split(' ', 1)[1]
        members = int(members.replace(",", ''))
        genre_list= []
        for g in genres:
            genre_list.append(g.string)
        if (soup.find("div", class_ = "score-label")) is None:
            score = float(0)
        else:
            score = float(soup.find("div", class_ = "score-label").text)
        anime_update = {}
        anime_update['genres'] = genre_list
        anime_update['members'] = members
        anime_update['score'] = score
        anime_update['statusCode'] = 200
        test_id_data = {"genres": genres, "members": members, "score": score}
        return anime_update
    except:
        return {"errorMessage": mal_id, "statusCode": 400}