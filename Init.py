import requests

r = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model":"llama3.3",
        "prompt":"Hello"
    }
)
