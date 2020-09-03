from flask import Flask, request, render_template, url_for, flash, redirect
from forms import LoginForm
import requests
import json
from operator import itemgetter 
app = Flask(__name__)
import os

app.config['SECRET_KEY'] = os.urandom(32)

@app.route("/api/get-top-ten")
def get_list_of_top_10_animes():
    #gets list of top 10 rated animes by user, anime info stored in dictionaries.
    user = request.args.get("user")
    r = requests.get('https://api.jikan.moe/v3/user/' + user +'/animelist/all')
    if r.status_code == 200:
        userdata = json.loads(r.text)
        anime_sorted = sorted(userdata['anime'], key=itemgetter('score'))
        anime_top_ten = anime_sorted[0:10]
        return {"data": {"top-ten": anime_top_ten}, "statusCode": 200}
    else:
        return {"data": "Failed", "statusCode": 400}
    
@app.route("/", methods=['GET', 'POST'])
def login():
    return "Hello"
    

if __name__ == '__main__':
    app.run(debug=True)
