from flask import Flask, request, jsonify
import requests
import random
from questions_dao import QuestionsDAO
from question_validator import QuestionEntity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
dao = QuestionsDAO()
AUTH_SERVER_URL = "http://127.0.0.1:5000/auth"

# Helper for authentication

def authenticate_token(token: str) -> bool:
    headers = {"Authorization": f"Bearer {token}"}
    try:
        resp = requests.get(AUTH_SERVER_URL, headers=headers)
        if resp.status_code != 200:
            return False
        data = resp.json()
        return data.get("title") == "AI Developer"
    except Exception:
        return False

@app.route("/questions", methods=["POST"])
def create_question():
    token = request.headers.get("token")
    if not token or not authenticate_token(token):
        return jsonify({"error": "Unauthorized or not AI Developer."}), 401
    data = request.get_json()
    entity = QuestionEntity(
        option1=data.get("option1"),
        option2=data.get("option2"),
        category=data.get("category")
    )
    if not entity.is_valid():
        return jsonify({"errors": entity.errors}), 400
    new_q = dao.create_question(
        option1=entity.option1,
        option2=entity.option2,
        category=entity.category
    )
    return jsonify(new_q)

@app.route("/questions/<int:question_id>/upvote", methods=["POST"])
def upvote_option(question_id):
    token = request.headers.get("token")
    if not token or not authenticate_token(token):
        return jsonify({"error": "Unauthorized or not AI Developer."}), 401
    option = request.args.get("option", type=int)
    if option not in [1, 2]:
        return jsonify({"error": "Invalid option. Must be 1 or 2."}), 400
    success = dao.update_votes(question_id, option)
    if not success:
        return jsonify({"error": "Question not found or invalid option."}), 404
    return jsonify({"message": f"Upvoted option {option} for question {question_id}"})

@app.route("/questions/<int:question_id>", methods=["GET"])
def get_question_by_id(question_id):
    token = request.headers.get("token")
    if not token or not authenticate_token(token):
        return jsonify({"error": "Unauthorized or not AI Developer."}), 401
    question = dao.get_question_by_id(question_id)
    if not question:
        return jsonify({"error": "Question not found."}), 404
    return jsonify(question)

@app.route("/questions/<int:question_id>", methods=["DELETE"])
def delete_question(question_id):
    token = request.headers.get("token")
    if not token or not authenticate_token(token):
        return jsonify({"error": "Unauthorized or not AI Developer."}), 401
    success = dao.delete_question(question_id)
    if not success:
        return jsonify({"error": "Question not found."}), 404
    return jsonify({"message": f"Deleted question {question_id}"})

@app.route("/questions/random", methods=["GET"])
def get_random_question():
    token = request.headers.get("token")
    if not token or not authenticate_token(token):
        return jsonify({"error": "Unauthorized or not AI Developer."}), 401
    q = dao.get_random_question()
    if not q:
        return jsonify({"error": "No questions available."}), 404
    return jsonify(q)

@app.route("/questions/random_by_category", methods=["GET"])
def get_random_question_by_category():
    token = request.headers.get("token")
    if not token or not authenticate_token(token):
        return jsonify({"error": "Unauthorized or not AI Developer."}), 401
    category = request.args.get("category")
    questions = dao.get_questions_by_category(category)
    if not questions:
        return jsonify({"error": "No questions found for this category."}), 404
    return jsonify(random.choice(questions))

if __name__ == "__main__":
    app.run(debug=True, port=8000)
