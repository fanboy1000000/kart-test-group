# Set up your machine

*Danish version: [OPSÆTNING.md](OPSÆTNING.md).*

**Part 1** is for before the day: three things to install on the Windows machine you will use. It takes about 20 minutes, most of it waiting for downloads, and needs no administrator password. If anything does not work, write to the facilitator; do not wait for the day.

**Part 2** is for the day itself, with the facilitator in the room: a GitHub account, your group's game, and your slot in it.

You need one thing from the facilitator before you start: your **Claude sign-in**, either an invitation to the company's Claude account or a note saying to use your own.

## Part 1: before the day

### 1. Install VS Code

VS Code is the editor you work in. Everything else plugs into it.

1. Go to [code.visualstudio.com](https://code.visualstudio.com) and click **Download for Windows**. You get the "User Installer", which needs no administrator password.
2. Run it. Keep the defaults, but make sure **"Add to PATH"** stays ticked.
3. Make a new folder for the day, for example `Hackathon` in your Documents folder. Open VS Code, choose **File → Open Folder**, and open that folder. If VS Code asks whether you trust the authors, click **Yes, I trust the authors**.

### 2. Install Claude and sign in

Claude is the AI assistant you will build with. It lives inside VS Code as an extension.

1. Click the **Extensions** icon in the left bar (four squares), or press **Ctrl+Shift+X**.
2. Search for **Claude Code**, by Anthropic, and click **Install**.
3. Click the **Claude** icon that appears in the left bar, or press **Ctrl+Shift+P**, type **Claude**, and choose **Claude Code: Open**.
4. Click **Sign in**. A browser opens. Sign in with the account from the facilitator's email: accept the invitation to the company's Claude organisation if you got one, otherwise use your own Claude account.
5. Back in VS Code, type **hello** in the Claude panel and press Enter. If it answers, you are signed in.

### 3. Let Claude install Git

Git is the program that keeps track of changes and talks to GitHub. VS Code and Claude both need it, and neither includes it. Claude can install it for you, which is also your first taste of how the day works: it asks for permission before it does anything, you read what it wants to do and click **Yes**.

Paste this into the Claude panel, with your own name and email in place of the capitals:

> Set up my machine for a hackathon. I do not have administrator rights, so install everything for my user only.
> 1. Install Git for Windows: download the latest 64-bit installer from https://git-scm.com/download/win and run it silently for the current user with the default options. The installer accepts the switches /VERYSILENT /NORESTART /CURRENTUSER.
> 2. Configure Git with my name "YOUR NAME" and email "YOUR EMAIL".
> 3. Install these two VS Code extensions with the `code` command: ritwickdey.LiveServer and GitHub.vscode-pull-request-github.
> 4. Check that `git --version` works, and tell me what you did. Do not install anything else.

When Claude says it is done, **close VS Code completely and open it again**, with the same folder. VS Code and Claude only find Git after a restart. Then ask Claude once more:

> Does `git --version` work?

If it answers with a version number, you are ready for the day. If Claude could not install Git, see "By hand" at the end of this document.

### Checklist for before the day

- [ ] VS Code installed
- [ ] Claude extension installed and signed in; it answered "hello"
- [ ] Git installed by Claude, VS Code restarted, `git --version` answers
- [ ] The two extensions installed: Live Server and GitHub Pull Requests

Write "ready" to the facilitator when all four are ticked.

## Part 2: on the day

The facilitator gives you two things in the room: the **link** to your group's repository on GitHub, and your **slot number** (slot 1 to slot 6), which is your file in the game.

### 4. A GitHub account

GitHub is where the group's game lives and where your work gets shared. Skip to the next step if you already have an account.

1. Go to [github.com](https://github.com) and click **Sign up**, with any email address you can read today. Pick a username you are happy to say out loud; the group will see it.
2. Verify your email address when GitHub asks.
3. Set up **two-factor authentication**: GitHub will insist on it soon, and it is better done now than halfway through the day. Go to **Settings → Password and authentication → Two-factor authentication**. The easiest option is the **GitHub Mobile** app on your phone.
4. Tell the facilitator your **username**. They add you to your group's repository so you can send your work to it. GitHub then shows you a notification, and sends an email, asking you to accept. Accept it. You can already read and clone the repository without this; you only need it from step 7 on.

### 5. Sign in to GitHub inside VS Code

This lets VS Code and Claude fetch and send your work without asking for passwords.

1. Click the **Accounts** icon, the little person in the bottom-left corner of VS Code.
2. Choose **Sign in with GitHub**. A browser opens; click **Authorize** and come back.

### 6. Get the game onto your machine

Open the Claude panel and paste this, with the link to your group's repository that the facilitator gave you:

> Clone the repository https://github.com/YOUR-ORGANISATION/YOUR-GROUP-REPO into a folder called `kart` inside this folder. If a browser window asks me to sign in to GitHub, I will handle it. When the clone is done, open the `kart` folder in this VS Code window (code -r).

If a browser window opens asking you to sign in to GitHub, do it; this happens only once.

VS Code reloads with the game folder open. If it asks whether you trust the authors, click **Yes, I trust the authors**. If it suggests installing recommended extensions, let it.

### 7. Claim your slot

Open the Claude panel again and paste this, with your slot number and name:

> I own src/features/slot-N.js. Create a branch called setup/YOUR-NAME from main. In my slot file, write my name "YOUR NAME" on the line that says "Owner:" and nothing else. Commit it with the message "Claim slot N" and publish the branch to GitHub. Then explain in plain language what the five functions in my slot file are for.

When Claude reports that the branch is published, your machine can talk to GitHub. Read its explanation of the five functions; that is what you will be filling in today.

If VS Code offers **Create Pull Request** afterwards, click it, give it a title, click **Create**, and then **Merge pull request** on the page that opens. If that confuses you, ask a helper; it is the loop you will use all day, and the Git cheat sheet in the repository shows every click.

### 8. Start the game

1. In the file list on the left, right-click `index.html` and choose **Open with Live Server**.
2. Your browser opens with the game. Click inside the page once, then hold **W**. The red kart drives. Hold the **Up arrow**: the blue kart drives.

Double-clicking `index.html` in a folder does *not* work; the game needs Live Server. Edge is fine as a browser, and so is Chrome.

### Checklist for the day

- [ ] GitHub account with two-factor authentication
- [ ] Added to your group's repository, GitHub's notification accepted
- [ ] Signed in to GitHub inside VS Code
- [ ] Game cloned; a branch with your name in your slot is on GitHub
- [ ] Game running in the browser; both karts drive

## By hand: if Claude could not do it

**Git.** Go to [git-scm.com/download/win](https://git-scm.com/download/win), download the 64-bit installer and run it. Click **Next** through every page; the defaults are right. If Windows asks for an administrator password you do not have, choose the option to install for your user only. Then open the Start menu, type **PowerShell**, open it, and paste these two lines with your own name and email, pressing Enter after each:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your@email"
```

Restart VS Code afterwards.

**Extensions.** In VS Code press **Ctrl+Shift+X**, search for **Live Server** (by Ritwick Dey) and **GitHub Pull Requests** (by GitHub), and click **Install** on each.

**The game.** Click the **Source Control** icon in the left bar (the branching lines), then **Clone Repository**, then **Clone from GitHub**, and pick your group's repository. Choose your `Hackathon` folder as the location and click **Open** when asked.

**Your slot.** Click the branch name in the bottom-left corner of VS Code and choose **Create new branch**; name it `setup/your-name`. Open `src/features/slot-N.js` and write your name on the `Owner:` line. Save. Click **Source Control**, type "Claim slot N", click **Commit** (say **Always** if it asks about staging), then click **Publish Branch**. The Git cheat sheet in the repository, `GIT-CHEATSHEET.md`, describes every click.

## If something does not work

- **Claude says it cannot download, or the install fails.** Your machine may be behind a company proxy or a policy that blocks installers. Try the steps by hand above. If that fails too, tell the facilitator; this needs the IT department, not you.
- **"git is not recognized"**, or VS Code says it cannot find Git. Close VS Code completely and open it again.
- **Claude's sign-in page never comes back to VS Code.** The sign-in page shows a code; copy it and paste it into the Claude panel.
- **"Open with Live Server" is not in the menu.** The Live Server extension is not installed. See "By hand".
- **The browser opens but the page is grey or empty.** Press **F12**, open **Console**, and show the red text to a helper.
- **Publishing the branch fails with "permission denied".** You have not been added to the repository yet, or you have not accepted GitHub's notification. Step 4.4. Check that VS Code is signed in to the same GitHub account you gave the facilitator.
