#!/usr/bin/python

from flask import Flask, render_template
app = Flask("flowserver")

@app.route("/")
def root():
    return render_template("index.html", name="Bob")

if __name__ == '__main__':
    app.debug = True
    app.run()
