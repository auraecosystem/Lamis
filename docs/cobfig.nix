echo 'use_nix --arg sharedLibDeps {} --argstr icu small' > .envrc
direnv allow .
make build-ci -j12
