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
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=

DATABASE_URL=sqlite:///lamis.db
CHROMA_DB=./memory

WHISPER_MODEL=large-v3
OLLAMA_HOST=http://localhost:11434
