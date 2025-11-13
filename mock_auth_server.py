from flask import Flask, jsonify, request
import json
import os

app = Flask(__name__)

USER_FILE = os.path.join(os.path.dirname(__file__), "user_credentials.json")

def load_users():
    with open(USER_FILE, "r") as f:
        return json.load(f)

@app.route('/auth', methods=['POST', 'GET'])
def authenticate():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing Bearer token in Authorization header."}), 401
    token = auth_header[7:]  # Remove 'Bearer ' prefix
    # Token format: username-secret-token
    if not token.endswith('-secret-token'):
        return jsonify({"error": "Invalid token format."}), 401
    username = token[:-13]  # Remove '-secret-token'
    users = load_users()
    user = next((u for u in users if u["username"] == username), None)
    if not user:
        return jsonify({"error": "User not found."}), 404
    # Return user info (excluding password hash)
    return jsonify({
        "name": user["name"],
        "username": user["username"],
        "title": user["title"]
    })

import bcrypt
@app.route('/generate_token', methods=['POST'])
def generate_token():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password required."}), 400
    users = load_users()
    user = next((u for u in users if u["username"] == username), None)
    if not user:
        return jsonify({"error": "User not found."}), 404
    # Compare password using bcrypt
    if not bcrypt.checkpw(password.encode('utf-8'), user["password_hash"].encode('utf-8')):
        return jsonify({"error": "Invalid password."}), 401
    token = f"{username}-secret-token"
    return jsonify({"token": token})

@app.route('/add_account', methods=['POST'])
def add_account():
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')
    title = "AI Developer"
    if not all([name, username, password, title]):
        return jsonify({"error": "All fields (name, username, password, title) are required."}), 400
    users = load_users()
    if any(u["username"] == username for u in users):
        return jsonify({"error": "Username already exists."}), 409
    import bcrypt
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode()
    new_user = {
        "name": name,
        "username": username,
        "password_hash": password_hash,
        "title": title
    }
    users.append(new_user)
    with open(USER_FILE, "w") as f:
        json.dump(users, f, indent=2)
    return jsonify({"message": "Account created successfully.", "user": {"name": name, "username": username, "title": title}}), 201

if __name__ == "__main__":
    app.run(debug=True, port=5000)
