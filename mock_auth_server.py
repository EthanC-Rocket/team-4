
from flask import Flask, jsonify, request

app = Flask(__name__)


VALID_TOKEN = "mysecrettoken"

@app.route('/auth', methods=['POST', 'GET'])
def authenticate():
    # Require Bearer token in Authorization header
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing Bearer token in Authorization header."}), 401
    token = auth_header[7:]  # Remove 'Bearer ' prefix
    if token != VALID_TOKEN:
        return jsonify({"error": "Invalid token."}), 401
    return jsonify({
        "name": "Jane Doe",
        "title": "AI Developer"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
