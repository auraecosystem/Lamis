find . -maxdepth 2 -name "package.json"
find . -maxdepth 2 -name "requirements.txt"
find . -maxdepth 2 -name "pyproject.toml"
find . -maxdepth 2 -name "pom.xml"
find . -maxdepth 2 -name "build.gradle"
find . -maxdepth 2 -name "Cargo.toml"
find . -maxdepth 2 -name "go.mod"
# 
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
git clone https://github.com/auraecosystem/jssg
cd jssg
zig build
npx codemod @nodejs/cjs-to-esm

This repository contains codemods (automated migrations) for "userland" code. These are intended to facilitate adopting new features and upgrading source-code affected by breaking changes.

## Usage

> [!CAUTION]
> These scripts change source code. Commit any unsaved changes before running them. Failing to do so may ruin your day.

To run the transform scripts use [`codemod`](https://go.codemod.com/github) command below:

### From registry

With the codemod CLI you can run a workflow from the [Codemod Registry](https://codemod.link/nodejs-official). Replace `<recipe>` with the name of the recipe you want to run:

```bash
npx codemod @nodejs/<recipe>
