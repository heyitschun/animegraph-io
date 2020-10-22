from app import db

class animes(db.Model):
    __tablename__ = 'animes'
    anime_id = db.Column('anime_id', db.INTEGER, primary_key=True)
    title = db.Column('title', db.VARCHAR)
    genre = db.Column('genre', db.VARCHAR)
    members = db.Column('members', db.INTEGER)
    score = db.Column('score', db.FLOAT)


def anime_in_database(test_id):
    genre = db.query.filter_by(anime_id= test_id).first()
    print("!@#!#!@#!@", genre)
    return genre