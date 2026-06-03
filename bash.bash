find . -maxdepth 2 -name "package.json"
find . -maxdepth 2 -name "requirements.txt"
find . -maxdepth 2 -name "pyproject.toml"
find . -maxdepth 2 -name "pom.xml"
find . -maxdepth 2 -name "build.gradle"
find . -maxdepth 2 -name "Cargo.toml"
find . -maxdepth 2 -name "go.mod"
pip install \
fastapi \
uvicorn \
langchain \
langgraph \
chromadb \
sentence-transformers \
openai \
google-genai \
anthropic \
groq \
openai-whisper \
pydantic \
python-dotenv \
websockets
