#!/usr/bin/python

from flask import Flask, render_template, request, jsonify

app = Flask("flowserver")

@app.route("/")
def root():
    return render_template("index.html", name="Bob")
@app.route("/api", methods=["POST"])
def api():
    verb = request.json["verb"]
    body = request.json["body"]
    if verb == "email":
        print "Email", body["email"]
    return jsonify(ok="ok", known=True)

if __name__ == '__main__':
    app.debug = True
    app.run()
