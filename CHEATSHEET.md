# Git Advanced Commands Cheat Sheet

Decision flow (pick the right tool)
- Shelve unfinished work -> `git stash`
- Copy commit(s) from another branch -> `git cherry-pick`
- Safely undo pushed/shared commit -> `git revert`
- Rewrite local (unshared) history -> `git reset` (or `git rebase -i`)

Quick reference
- git stash
  - Save: `git stash push -m "WIP: msg"`
  - Include untracked: `git stash push -u -m "WIP incl untracked"`
  - Apply: `git stash apply stash@{0}` (keeps stash) or `git stash pop` (apply + remove)
  - Branch from stash: `git stash branch feature/from-stash stash@{0}`

- git cherry-pick
  - Single commit: `git cherry-pick <sha>`
  - With trace: `git cherry-pick -x <sha>`
  - Range: `git cherry-pick A..B` (use carefully)
  - Do not commit immediately: `git cherry-pick -n <sha>`
  - Conflicts: fix → `git add <files>` → `git cherry-pick --continue`
  - Abort: `git cherry-pick --abort`

- git revert
  - Single commit: `git revert <sha>`
  - Revert range as one commit:
    `git revert --no-commit A..B ; git commit -m "Revert A..B"`
  - Revert merge: `git revert -m 1 <merge-sha>` (choose parent)
  - Conflicts: fix → `git add <files>` → `git revert --continue`
  - Abort: `git revert --abort`

- git reset
  - Move HEAD only (keep staged): `git reset --soft <commit>`
  - Move HEAD, unstage changes (keep work tree): `git reset <commit>`  # default = --mixed
  - Hard reset (discard changes): `git reset --hard <commit>`
  - Unstage file: `git reset HEAD path/to/file`
  - Recover: `git reflog` → `git checkout -b recover <sha>` or `git reset --hard <sha>`

Full example workflows
- Backport commit to release:
  ```
  git fetch origin
  git checkout release/v1.2
  git pull --ff-only origin release/v1.2
  git cherry-pick -x 4f7a1b2
  # resolve conflicts if needed: git add <files>; git cherry-pick --continue
  git push origin release/v1.2
  ```

- Safely undo pushed commit:
  ```
  git checkout main
  git pull origin main
  git revert 7d9f0a3
  # resolve conflicts if any: git add <files>; git revert --continue
  git push origin main
  ```

- Remove pushed commits (safe = revert, dangerous = reset+force)
  - Revert (safe):
    ```
    git checkout feature
    git pull origin feature
    git revert <sha-B>
    git revert <sha-A>
    git push origin feature
    ```
  - Reset + force (coordinate with team):
    ```
    git fetch origin
    git checkout feature
    git reset --hard GOOD_SHA
    git push --force-with-lease origin feature
    ```

Conflict resolution (generic)
1. `git status`
2. Edit files to resolve conflict markers (<<<<<<, >>>>>>)
3. `git add <resolved-files>`
4. `git <operation> --continue`   # e.g., cherry-pick/revert/rebase
5. Or `git <operation> --abort` to cancel

Safety tips
- Prefer `git revert` on shared branches.
- Use `--force-with-lease` instead of `--force`.
- Use `-x` when cherry-picking for traceability.
- Inspect with `git status`, `git log`, `git diff` before destructive ops.

`git reflog` is your friend for recovery after destructive changes.
``` ````

Exact commands I will run to add these files to the branch (if you say “proceed”):
1. Fetch and check out the remote branch locally:
   git fetch origin
   git checkout --track -b tools/git-helper origin/tools/git-helper

2. Create the files locally (paste contents), make script executable:
   chmod +x git-helper.sh

3. Stage and commit:
   git add git-helper.sh CHEATSHEET.md
   git commit -m "tools: add git-helper script and cheat sheet"

4. Push the branch (updates the existing branch):
   git push origin tools/git-helper

What I did and what’s next
- What I did: created the tools/git-helper branch in auraecosystem/Lamis.
- Next I will: commit git-helper.sh and CHEATSHEET.md to that branch and push them, leaving the branch ready for review and merge.
- Confirm with “proceed” to let me commit these files to the branch, or say “change” and tell me edits to the files. I will not push to main or modify any other branches.

Would you like me to proceed and add these files to tools/git-helper now?
