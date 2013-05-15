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
        known = False
        if body["email"] == "known":
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
