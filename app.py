from flask import Flask, request, render_template, url_for, flash, redirect
from forms import LoginForm
import requests
import json
from operator import itemgetter 
app = Flask(__name__)
import os

app.config['SECRET_KEY'] = os.urandom(32)

def validate_MAL_login(user):
    try:
        r = requests.get('https://api.jikan.moe/v3/user/' + user)
        if r.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.HTTPError as e:
        return False

@app.route("/api/get-top-ten")
def get_list_of_top_10_animes():
    #gets list of top 10 rated animes by user, anime info stored in dictionaries.
    user = request.args.get("user")
    r = requests.get('https://api.jikan.moe/v3/user/' + user +'/animelist/all')
    userdata = json.loads(r.text)
    anime_sorted = sorted(userdata['anime'], key=itemgetter('score'))
    anime_top_ten = anime_sorted[0:10]
    return {"data": anime_top_ten}
    

@app.route("/", methods=['GET', 'POST'])
def login():
    form = LoginForm()
    user = form.username.data
    if form.validate_on_submit():
        if  validate_MAL_login(user):
            get_list_of_top_10_animes(user)
            flash(f'Account login successful for {user}!', 'success')

            return redirect(url_for('login'))
        else:
            flash(f'This is not a valid MyAnimeList account.')
    return render_template('login.html', title = 'Login', form=form)
    
@app.route("/api/profile")
def profile():
    return "<h1>Profile Page </h1>"

if __name__ == '__main__':
    app.run(debug=True)
