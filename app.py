from flask import Flask, request, render_template, url_for, flash, redirect
from forms import LoginForm
import requests
import json
from operator import itemgetter 
app = Flask(__name__)
import os
from bs4 import BeautifulSoup

app.config['SECRET_KEY'] = os.urandom(32)

@app.route("/api/get-top-ten")
def get_user_watch_history():
    #gets list of top 10 rated animes by user, anime info stored in dictionaries.
    user = request.args.get("user")
    r = requests.get('https://api.jikan.moe/v3/user/' + user +'/animelist/completed')
    if r.status_code == 200:
        userdata = json.loads(r.text)
        anime_history = sorted(userdata['anime'], key=itemgetter('score'))
        for anime in anime_history:
            anime_id = anime['mal_id']
            anime_genres = helper_get_genre_of_anime(anime_id)
            anime['genres']= anime_genres['genres']
        return {"data": anime_history, "statusCode": 200}
    else:
        return {"data": "Failed", "statusCode": 400}

@app.route("/api/get-anime-genre")
def get_anime_genre():
    #implements helper method in case we need to return the genres list 
    if request.args.get("id") == None:
        return {"data": "Failed", "statusCode": 400}

    return helper_get_genre_of_anime(request.args.get("id"))

def helper_get_genre_of_anime(anime_id):
    #gets genre of anime given ID, scraped from MAL using BeautifulSoup, can replace later w database.
    try:
        URL = 'https://myanimelist.net/anime/' + str(anime_id)
        animepage = requests.get(URL).text
        soup = BeautifulSoup(animepage, 'lxml')
        genres = soup.find_all('span', itemprop='genre')
        genre_list= []
        for g in genres:
            genre_list.append(g.string)
        return {"genres": genre_list, "statusCode": 200}
    except Exception as e:
        print(e)
        return {"errorMessage": "Errored out", "statusCode": 400}


@app.route("/", methods=['GET', 'POST'])
def login():
    return "Hello"

#create another app.route that returns the 3 most popular genres of a user via 
# beautifulsoup, and updates my userdatabase
    #given user list of animes, return the top 3 most popular genres in the list

    

if __name__ == '__main__':
    app.run(debug=True)
