from flask import Flask, request, render_template, url_for, flash, redirect
from forms import LoginForm
import requests
import json
from operator import itemgetter 
import os
from bs4 import BeautifulSoup
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import select
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(32)
POSTGRES = {
    'user': 'username',
    'pw': 'password',
    'db': 'anime_list',
    'host': 'localhost',
    'port': '5432',
}

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:\
%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES

db = SQLAlchemy(app)

class animes(db.Model):
    __tablename__ = 'animes'
    anime_id = db.Column('anime_id', db.INTEGER, primary_key=True)
    title = db.Column('title', db.VARCHAR)
    genre = db.Column('genre', db.VARCHAR)

    
from app import db
@app.route("/api/get-top-ten")
def get_user_watch_history():
    #gets list of top 10 rated animes by user, anime info stored in dictionaries.
    user = request.args.get("user")
    r = requests.get('https://api.jikan.moe/v3/user/' + user +'/animelist/completed')
    if r.status_code == 200:
        #transforms API call to readable data
        userdata = json.loads(r.text)
        anime_history = sorted(userdata['anime'], key=itemgetter('score'))
        for anime in anime_history:
            anime_id = anime['mal_id']
            anime_genres = get_genre_from_database(anime_id)
            anime['genres']= anime_genres['genres']
            if anime_in_database(anime_id) is None:
                genre = str(anime['genres'])
                new_anime = animes(anime_id = anime_id, title = anime['title'], genre = str(anime['genres']))
                db.session.add(new_anime)
        if db.session.new:
            print ("new session")
            db.session.commit()
            db.session.execute("UPDATE animes SET genre = REPLACE(REPLACE(REPLACE(genre, '[', ''), ']', ''), '''', '')")
            db.session.commit()
        return {"data": anime_history, "statusCode": 200}
    else:
        return {"data": "Failed", "statusCode": 400}

def anime_in_database(test_id):
    genre = animes.query.filter_by(anime_id= test_id).first()
    return genre

def get_genre_from_database(test_id):
    anime_exists = anime_in_database(test_id)
    genre_list = []
    final_list = []
    if anime_exists is None:
        # if not in database, grabs from webscrape
        test_id_genres = helper_get_genre_of_anime(test_id)
    else:
        # database needs to be in list format for this to work.
        genres = re.split(r",\s*", anime_exists.genre)
        test_id_genres = {"genres": genres}
    return test_id_genres


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
        return {"errorMessage": "Errored out", "statusCode": 400}


@app.route("/", methods=['GET', 'POST'])
def login():
    return "Hello"

#create another app.route that returns the 3 most popular genres of a user via 
# beautifulsoup, and updates my userdatabase
    #given user list of animes, return the top 3 most popular genres in the list

    

if __name__ == '__main__':
    app.run(debug=True)
