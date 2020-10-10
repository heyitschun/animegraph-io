import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from app import anilist

print("\n### Anilist START ###")
print(anilist.get_anilist_anime(116005))
print("### Anilist END ###\n")

POSTGRES = {
    'user': os.getenv("POSTGRES_USER"),
    'pw': os.getenv("POSTGRES_PASS"),
    'db': 'anime_list',
    'host': 'localhost',
    'port': '5432',
}

app = Flask(__name__, static_folder="build", static_url_path="/")
app.config['SECRET_KEY'] = os.urandom(32)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES

db = SQLAlchemy(app)

from app import routes, models
