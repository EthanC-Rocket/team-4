import requests

def test_auth_success():
    url = "http://127.0.0.1:5000/auth"
    headers = {"Authorization": "Bearer mysecrettoken"}
    response = requests.get(url, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Jane Doe"
    assert data["title"] == "AI Developer"
    print("test_auth_success passed.")
    
def test_auth_missing_token():
    url = "http://127.0.0.1:5000/auth"
    response = requests.get(url)
    assert response.status_code == 401
    print("test_auth_missing_token passed.")

def test_auth_invalid_token():
    url = "http://127.0.0.1:5000/auth"
    headers = {"Authorization": "Bearer wrongtoken"}
    response = requests.get(url, headers=headers)
    assert response.status_code == 401
    print("test_auth_invalid_token passed.")

if __name__ == "__main__":
    test_auth_success()
    test_auth_missing_token()
    test_auth_invalid_token()
