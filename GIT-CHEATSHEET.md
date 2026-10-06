# Git cheat sheet (VS Code only, no terminal)

You will do this loop a few times today: one branch per feature, one pull request per branch.

## Once: get the repo onto your machine

1. On GitHub, open your group's repo. Green **Code** button → **Open with Visual Studio Code**.
   Or in VS Code: **Source Control** icon in the left bar → **Clone Repository** → paste the URL.
2. Choose a folder. Open the cloned folder when asked.
3. Install the recommended extensions when VS Code suggests them.

## Loop: build a feature

### 1. Start from the latest `main`
- Click the branch name in the **bottom-left corner** of VS Code.
- Pick **main**.
- Click the **sync icon** (circular arrows, next to the branch name) to pull the latest.

### 2. Create your branch
- Click the branch name again → **Create new branch...**
- Name it `feature/<your-name>-<what>`, for example `feature/anna-lapcounter`.

### 3. Work, and commit often
- Edit your slot file. Save. The game reloads in the browser.
- When something works: **Source Control** icon → type a short message ("Add lap counter HUD") → **Commit**.
  If VS Code asks whether to stage all changes, say **Yes** (or **Always**).
- Repeat. Small commits are good commits.

### 4. Publish your branch
- In Source Control, click **Publish Branch** the first time, **Sync Changes** after that.
- Your branch is now on GitHub.

### 5. Open a pull request and merge it
- VS Code offers **Create Pull Request** after publishing. Click it. Or on GitHub, use the yellow "Compare & pull request" banner.
- Give it a title and click **Create**.
- Reload the game one last time and drive a lap. **`main` must always run.**
- GitHub should say **"This branch has no conflicts"**. Click **Merge pull request** → **Confirm merge**.

### 6. Next feature? Back to step 1
Switch to `main`, sync, create a new branch. You now have everyone's merged features on your machine. Go and play them.

## When things go wrong

- **"Conflict" when merging.** Rare if you only edited your own slot. Call the facilitator, or: open the file, VS Code shows the two versions with **Accept Current / Accept Incoming / Accept Both** buttons above them. Usually **Accept Both**. Save, commit, sync.
- **"Please clean your repository working tree before checkout."** You have uncommitted changes. Commit first, then switch branch.
- **I edited the wrong file.** Right-click the file in Source Control → **Discard Changes**. Gone.
- **I committed on `main` by accident.** Fine for today. Just **Sync** and carry on. Next time create the branch first.
- **The game is a black screen.** In the browser press F12 → **Console**. The red line tells you which file and line broke. Paste it to your AI assistant.
- **Nothing happens when I save.** Is Live Server running? The bottom-right of VS Code should say "Port: 5500". Click **Go Live** if not.
- **VS Code wants me to sign in to GitHub.** Click the Accounts icon (bottom-left) → **Sign in with GitHub**. It opens the browser; approve and come back.
