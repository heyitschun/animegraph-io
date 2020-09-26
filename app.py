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
from collections import OrderedDict
from operator import getitem 
import itertools
import random
import time

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder="build", static_url_path="/")

app.config['SECRET_KEY'] = os.urandom(32)
POSTGRES = {
    'user': os.getenv("POSTGRES_USER"),
    'pw': os.getenv("POSTGRES_PASS"),
    'db': 'anime_list',
    'host': 'localhost',
    'port': '5432',
}

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")

db = SQLAlchemy(app)

class animes(db.Model):
    __tablename__ = 'animes'
    anime_id = db.Column('anime_id', db.INTEGER, primary_key=True)
    title = db.Column('title', db.VARCHAR)
    genre = db.Column('genre', db.VARCHAR)
    members = db.Column('members', db.INTEGER)
    score = db.Column('score', db.FLOAT)

from app import db

@app.route("/api/get-top-ten", methods=["GET"])
def get_user_watch_history():
    #gets list of top 10 rated animes by user, anime info stored in dictionaries.
    user = request.args.get("user")
    data = {}
    total_anime_history = []
    i = 1
    r = requests.get('https://api.jikan.moe/v3/user/' + user +'/animelist/completed')
    userdata = json.loads(r.text)
    while 'anime' in userdata.keys() and len(userdata['anime']) != 0:
            #transforms API call to readable data
            userdata = json.loads(r.text)
            anime_history = sorted(userdata['anime'], key=itemgetter('score'))
            for anime in anime_history:
                anime_id = anime['mal_id']
                anime_genres_members = get_needed_data_from_database(anime_id)
                genres = anime_genres_members["genres"]
                members = anime_genres_members["members"]
                scores = anime_genres_members["score"]
                anime['genres']= genres
                anime['members']= members
                anime['MAL_score'] = float(scores)
                if anime_in_database(anime_id) is None:
                    genre = str(anime['genres'])
                    new_anime = animes(anime_id = anime_id, title = anime['title'], genre = str(anime['genres']), members = int(anime['members']), score = anime['MAL_score'])
                    db.session.add(new_anime)
            if db.session.new:
                db.session.commit()
                db.session.execute("UPDATE animes SET genre = REPLACE(REPLACE(REPLACE(genre, '[', ''), ']', ''), '''', '')")
                db.session.commit()
            total_anime_history = total_anime_history + anime_history
            i += 1
            r = requests.get('https://api.jikan.moe/v3/user/' + user +'/animelist/completed/' + str(i))
            userdata = json.loads(r.text)
    total_anime_history = [anime for anime in total_anime_history if anime["MAL_score"]>0]
    data = {"data": total_anime_history, "statusCode": 200}

    top_three = get_complete_list(data)
    return top_three


def anime_in_database(test_id):
    genre = animes.query.filter_by(anime_id= test_id).first()
    return genre

def get_needed_data_from_database(test_id):
    anime_exists = anime_in_database(test_id)
    if anime_exists is None:
        # if not in database, grabs from webscrape
        test_id_data = helper_get_needed_data_of_anime(test_id)
    else:
        # database needs to be in list format for this to work.
        genres = re.split(r",\s*", anime_exists.genre)
        members = anime_exists.members
        score = anime_exists.score
        test_id_data = {"genres": genres, "members": members, "score": score}
    return test_id_data


@app.route("/api/get-anime-genre")
def get_anime_genre():
    #implements helper method in case we need to return the genres list 
    if request.args.get("id") == None:
        return {"data": "Failed", "statusCode": 400}

    return helper_get_needed_data_of_anime(request.args.get("id"))

def helper_get_needed_data_of_anime(anime_id):
    return helper_get_genre_of_anime(anime_id)

def helper_get_genre_of_anime(anime_id):
    #gets genre of anime given ID, scraped from MAL using BeautifulSoup, can replace later w database.
    try:
        URL = 'https://myanimelist.net/anime/' + str(anime_id)
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
        test_id_data = {"genres": genres, "members": members, "score": score}
        return anime_update
    except:
        return {"errorMessage": anime_id, "statusCode": 400}


def get_top_three_genres(animes): 
    data = animes["data"]
    # add genre to dictionary if the genre is not in dictionary keys, otherwise increase value by 1
    dict_of_genres = {} # {"Shounen": 5, "Adventure": 10}
    for a in data:
        for g in a["genres"]:
            if g not in dict_of_genres.keys():
                dict_of_genres[g] = {}
                dict_of_genres[g]["animes"] = []
                dict_of_genres[g]["occurrences"] = 1
            else:
                dict_of_genres[g]["occurrences"] += 1
            #if this anime is within the top 20? 30?
            dict_of_genres[g]["animes"].append(a)
    dict_of_genres = OrderedDict(sorted(dict_of_genres.items(), key = lambda x:getitem(x[1], 'occurrences'), reverse=True))
    top_three = dict(itertools.islice(dict_of_genres.items(), 3))
    return top_three

def get_complete_list(animes):
    top_three = get_top_three_genres(animes)
    for value in top_three.values():
        scores = [d["score"] for d in value["animes"]]
        scores_set = set(scores)
        proper_length = min(50, len(value["animes"]))
        if len(scores_set) == 1:
            random.shuffle(value["animes"])
            value["animes"] = value["animes"][:proper_length]
        else:
            value["animes"] = sorted(value["animes"], key=itemgetter("score"), reverse=True) 
            value["animes"] = value["animes"][:proper_length]
    return top_three

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")

if __name__ == '__main__':
    app.run(debug=False)
