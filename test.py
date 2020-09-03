from flask import Flask, request, render_template, url_for, flash, redirect
from forms import LoginForm
import requests
app = Flask(__name__)

app.config['SECRET_KEY']

def validate_MAL_login(user):
    try:
        r = requests.get('https://api.jikan.moe/v3/user/' + user)
        if r.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.HTTPError as e:
        return False

@app.route("/", methods=['GET', 'POST'])
def login():
    form = LoginForm()
    user = form.username.data
    if form.validate_on_submit():
        if  validate_MAL_login(user):
            flash(f'Account login successful for {user}!', 'success')
            return redirect(url_for('login'))
        else:
            flash(f'This is not a valid MyAnimeList account.')
    return render_template('login.html', title = 'Login', form=form)
    
@app.route("/profile")
def profile():
    return "<h1>Profile Page </h1>"

if __name__ == '__main__':
    app.run(debug=True)
