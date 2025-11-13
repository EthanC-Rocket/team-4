
from fastapi import FastAPI, HTTPException, Query, Header
from pydantic import BaseModel
from typing import Optional
import random
import requests
from questions_dao import QuestionsDAO
from question_validator import QuestionEntity

app = FastAPI()
dao = QuestionsDAO()

AUTH_SERVER_URL = "http://127.0.0.1:5000/auth"

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

class QuestionCreate(BaseModel):
    option1: str
    option2: str
    category: str

@app.post("/questions")
def create_question(question: QuestionCreate, token: str = Header(...)):
    if not authenticate_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized or not AI Developer.")
    entity = QuestionEntity(
        option1=question.option1,
        option2=question.option2,
        category=question.category
    )
    if not entity.is_valid():
        raise HTTPException(status_code=400, detail=entity.errors)
    new_q = dao.create_question(
        option1=entity.option1,
        option2=entity.option2,
        category=entity.category
    )
    return new_q

@app.post("/questions/{question_id}/upvote")
def upvote_option(question_id: int, option: int = Query(..., ge=1, le=2), token: str = Header(...)):
    if not authenticate_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized or not AI Developer.")
    success = dao.update_votes(question_id, option)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found or invalid option.")
    return {"message": f"Upvoted option {option} for question {question_id}"}

@app.delete("/questions/{question_id}")
def delete_question(question_id: int, token: str = Header(...)):
    if not authenticate_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized or not AI Developer.")
    success = dao.delete_question(question_id)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found.")
    return {"message": f"Deleted question {question_id}"}

@app.get("/questions/random")
def get_random_question(token: str = Header(...)):
    if not authenticate_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized or not AI Developer.")
    q = dao.get_random_question()
    if not q:
        raise HTTPException(status_code=404, detail="No questions available.")
    return q

@app.get("/questions/random_by_category")
def get_random_question_by_category(category: str, token: str = Header(...)):
    if not authenticate_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized or not AI Developer.")
    questions = dao.get_questions_by_category(category)
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this category.")
    return random.choice(questions)
