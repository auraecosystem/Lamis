git clone https://github.com/nodejs/node.git
cd node
sudo apt-get update
sudo apt-get install libasound2-dev
sudo dnf install alsa-lib-devel
sudo pacman -S alsa-lib
pip install pyalsaaudio
./configure --node-builtin-modules-path "$(pwd)"
winget configure .\.configurations\configuration.dsc.yaml
Set-ExecutionPolicy Unrestricted -Force
iex ((New-Object System.Net.WebClient).DownloadString('https://boxstarter.org/bootstrapper.ps1'))
get-boxstarter -Force
Install-BoxstarterPackage https://raw.githubusercontent.com/nodejs/node/HEAD/tools/bootstrap/windows_boxstarter -DisableReboots
refreshenv
sudo usermod -aG audio $USER
speaker-test -t wav -c 2

"ollama pull llama3.3"
"ollama pull qwen3"
"ollama pull mistral"
# Get paper metadata
curl "https://arxiv.gg/api/v1/papers/1706.03762"

# Search papers (keyword)
curl "https://arxiv.gg/api/v1/search?q=transformer&limit=10"

# Semantic search (requires embeddings)
curl "https://arxiv.gg/api/v1/search/semantic?q=attention+mechanism&limit=10"

# Fetch paper with embedding generation
curl -X POST "https://arxiv.gg/api/v1/papers/2301.00001/fetch?embedding=true"

# Generate embedding for a paper
curl -X POST "https://arxiv.gg/api/v1/papers/1706.03762/embeddings"

# Get citation graph
curl "https://arxiv.gg/api/v1/papers/1706.03762/graph"

# Export as BibTeX
curl "https://arxiv.gg/api/v1/papers/1706.03762/export/bibtex"
git clone https://github.com/josStorer/RWKV-Runner

# Then
cd RWKV-Runner
python ./backend-python/main.py #The backend inference service has been started, request /switch-model API to load the model, refer to the API documentation: http://127.0.0.1:8000/docs

# Or
cd RWKV-Runner/frontend
npm ci
npm run build #Compile the frontend
cd ..
python ./backend-python/webui_server.py #Start the frontend service separately
# Or
python ./backend-python/main.py --webui #Start the frontend and backend service at the same time

# Help Info
python ./backend-python/main.py -h
