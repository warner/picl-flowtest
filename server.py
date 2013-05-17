#!/usr/bin/python

import random
from flask import Flask, render_template, request, jsonify

class State:
    pass
sessions = {}
accounts = {"known": {"password": "password"}}

app = Flask("flowserver")

@app.route("/")
def root():
    sessionID = random.randrange(1000000)
    return render_template("index.html", name="Bob", sessionID=sessionID)


@app.route("/api", methods=["POST"])
def api():
    sessionID = int(request.json["sessionID"])
    if sessionID not in sessions:
        sessions[sessionID] = State()
    state = sessions[sessionID]
    verb = request.json["verb"]
    body = request.json["body"]

    if verb == "list-all-accounts":
        # this is obviously just for demo purposes
        return jsonify(accounts)

    if verb == "email":
        email = body["email"]
        print "Email", email
        state.tryingForEmail = email
        known = False
        if email in accounts:
            known = True
        return jsonify(ok="ok", known=known)

    if verb == "attach":
        expected = accounts[state.tryingForEmail]["password"]
        if body["password"] == expected:
            state.email = state.tryingForEmail # this marks success
            return jsonify(correct=True)
        return jsonify(correct=False)

    if verb == "create-account":
        print "create-account", body["password"]
        accounts[state.tryingForEmail] = {"password": body["password"]}
        state.email = state.tryingForEmail
        return jsonify(ok="ok")

    if verb == "create-reset-code":
        code = "%03d-%03d-%04d" % (random.randrange(1000),
                                   random.randrange(1000),
                                   random.randrange(10000))
        state.expectedCode = code
        return jsonify(code=code)

    if verb == "got-code":
        if body["code"] == state.expectedCode:
            state.email = state.tryingForEmail
            return jsonify(correct=True)
        return jsonify(correct=False)

    if verb == "reset-account":
        print "reset-account", body["password"]
        accounts[state.email]["password"] = body["password"]
        return jsonify(ok=True)

    return jsonify(error="unknown verb")

if __name__ == '__main__':
    app.debug = True
    app.run()
