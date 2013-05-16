#!/usr/bin/python

import random
from flask import Flask, render_template, request, jsonify

sessions = {}
accounts = {"known": {"password": "password"}}

app = Flask("flowserver")

@app.route("/")
def root():
    sessionID = random.randint(0, 1000000)
    return render_template("index.html", name="Bob", sessionID=sessionID)

@app.route("/api", methods=["POST"])
def api():
    sessionID = int(request.json["sessionID"])
    if sessionID not in sessions:
        sessions[sessionID] = {}
    state = sessions[sessionID]
    verb = request.json["verb"]
    body = request.json["body"]
    if verb == "email":
        email = body["email"]
        print "Email", email
        known = False
        if email in accounts:
            known = True
        return jsonify(ok="ok", known=known)
    if verb == "attach":
        if body["password"] == "password":
            return jsonify(correct=True)
        return jsonify(correct=False)
    if verb == "create-account":
        print "create-account", body["password"]
        return jsonify()
    if verb == "got-code":
        if body["code"] == "123-456-7890":
            return jsonify(correct=True)
        return jsonify(correct=False)
    if verb == "reset-account":
        print "reset-account", body["password"]
        return jsonify(ok=True)
    return jsonify(error="unknown verb")

if __name__ == '__main__':
    app.debug = True
    app.run()
