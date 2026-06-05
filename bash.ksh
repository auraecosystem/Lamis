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
# Install Cachix
nix profile install nixpkgs#cachix

# Authenticate
cachix authtoken YOUR_TOKEN

# Create or use a cache
cachix use lamis

# Build project
nix build

# Push build outputs
nix build --no-link --print-out-paths | cachix push lamis
# Livecrawl both web and news results
curl -G https://ydc-index.io/v1/search \
  -H "X-API-Key: api_key" \
  --data-urlencode "query=latest AI developments" \
  -d count=5 \
  -d livecrawl=all \
  -d livecrawl_formats=markdown
