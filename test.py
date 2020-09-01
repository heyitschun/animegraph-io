from flask import Flask, request, render_template, url_for
from forms import LoginForm
app = Flask(__name__)

app.config['SECRET_KEY'] = '92fa7fd80fcb9e428cb33c697e4e9b5f'

@app.route("/", methods=['GET', 'POST'])
def login():
    form = LoginForm()
    return render_template('login.html', title = 'Login', form=form)
    
@app.route("/about")
def about():
    return "<h1>About Page </h1>"

if __name__ == '__main__':
    app.run(debug=True)
