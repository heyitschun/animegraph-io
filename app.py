from flask import Flask, request, render_template, url_for, flash, redirect
from forms import LoginForm
import requests
import json
from operator import itemgetter 
app = Flask(__name__)
import os
import bs4

app.config['SECRET_KEY'] = os.urandom(32)

@app.route("/api/get-top-ten", methods =['GET','POST'])
def get_user_watch_history():
    #gets list of top 10 rated animes by user, anime info stored in dictionaries.
    user = "hxhelena"
    #user = request.args.get("user")
    r = requests.get('https://api.jikan.moe/v3/user/' + user +'/animelist/all')
    if r.status_code == 200:
        userdata = json.loads(r.text)
        anime_history = sorted(userdata['anime'], key=itemgetter('score'))
        return {"data": anime_history, "statusCode": 200}
    else:
        return {"data": "Failed", "statusCode": 400}

@app.route("/api/get-anime-genre")
def get_genre_of_anime(anime_id):
    URL = 'https://myanimelist.net/anime/'
    animepage = requests.get(URL) + anime_id
    soup = BeautifulSoup(page.content, 'html.parser')
    genres = soup.find_all('span', itemprop='genres')
    print (genres)
    

    #check database for anime genre, if doesn't exist, then BeautifulSoup
    # returns data to database.
    # in my aggregate function, i'd call this func for every anime to update
    # dict of anime_data.


@app.route("/", methods=['GET', 'POST'])
def login():
    return "Hello"

#create another app.route that returns the 3 most popular genres of a user via 
# beautifulsoup, and updates my userdatabase
    #given user list of animes, return the top 3 most popular genres in the list

    

if __name__ == '__main__':
    app.run(debug=True)
