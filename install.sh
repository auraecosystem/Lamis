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
