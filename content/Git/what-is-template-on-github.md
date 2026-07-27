# What is template on github

A **template** on GitHub is a feature that allows you to use an existing repository as a starter kit for a new project. Instead of copying files manually, it automatically generates a new repository with the same files, folders, and branch structures, but without the original project's commit history.

To create one, you simply mark an existing repository as a template in its settings. Anyone with access can then click the **Use this template** button on your repository's page to start their own project.

GitHub also features other types of templates, including:

- **Issue templates:** Pre-filled forms that standardize how users and contributors report bugs or request features.
- **Pull request templates:** Checklists and review prompts that automatically appear whenever someone submits code for review.
- **Workflow templates:** Reusable CI/CD scripts (via GitHub Actions) that help teams automate their build and testing pipelines.

# Why Is a Template Needed?

Templates solve the **"cold-start" problem** of software development. Usually, beginning a new project requires hours of tedious, repetitive manual setup. Developers have to:

- Make folder structures manually.
- Install identical packages over and over.
- Write basic authentication code from scratch.
- Configure linting, formatting, and security policies.

Templates turn this standard "tribal knowledge" into a predictable, automated process. By avoiding manual, error-prone copying, teams can launch new applications or features in seconds rather than days.

# What Does It Give You?

When you create a new repository from a GitHub template, it immediately provisions your project with several high-value assets:

```
📥 Your New Repo (Generated from Template)
 ├── 📄 Clean History   -> Brand new commit timeline (no inherited history)
 ├── ⚙️ Pre-configs      -> Linting, formatting, and dependencies installed
 ├── 🏗️ Architecture    -> Strict, reliable folder & codebase structure
 └── 🛡️ Health Files    -> Standardized Issue/PR templates & license files
```

- **A Fresh Commit History:** Unlike a standard code fork, a repository generated from a template starts with a **clean history**. It contains exactly one initial commit and bears no links or ties back to the parent repository's forks.
- **Instant Boilerplate Code:** You get all of the starter codebase configurations, styling setups, database schemas, and routing architectures completely intact from the first second.
- **Automated Tooling & Safeguards:** Most professional templates include production-ready configurations for testing libraries, security hooks, and automated CI/CD workflows.
- **Community & Project Management Files:** They pre-populate your project folder with community standard guidelines like `CONTRIBUTING.md`, licensing info, structured issue forms, and explicit pull request checklists.

# Famous GitHub Template Repositories

Here are some widely used, community-trusted template repositories across different frameworks and industries. You can use these by clicking the green **"Use this template"** button on their respective pages:

Web Development & Boilerplates

- **[ixartz/Next-js-Boilerplate](https://github.com/ixartz/Next-js-Boilerplate)**: A production-ready starter kit for Next.js, packed with TypeScript, Tailwind CSS, ESLint, Prettier, and testing configurations.
- **[sahat/hackathon-starter](https://github.com/sahat/hackathon-starter)**: A famous Node.js template specifically tailored for hackathons, featuring pre-built user authentication, database connections, and API integrations.

Mobile & AI Engineering

- **[infinitered/ignite](https://github.com/infinitered/ignite)**: The most popular React Native boilerplate template on GitHub, equipped with structured architecture, state management, and developer tools.
- **[ashleve/lightning-hydra-template](https://github.com/ashleve/lightning-hydra-template)**: A highly-rated template for Machine Learning researchers using PyTorch Lightning and Hydra to organize reproducible deep learning experiments.

Multi-Purpose Curation

- **[artemnovichkov/awesome-github-templates](https://github.com/artemnovichkov/awesome-github-templates)**: A master list curated by the open-source community that aggregates high-quality templates for various languages and platforms.

# Difference between upstream and origin

In Git terminology, **`origin`** and **`upstream`** are simply nicknames (aliases) given to remote repositories so you don't have to type out long HTTPS or SSH URLs every time.

Here is the difference between them:

### 1. `origin` (Your Personal Remote)

- **What it is:** The default remote shortcut created automatically when you clone _your own_ repository from GitHub (e.g., your `my-notes-hub` repo).

- **What it does:** It points directly to **your personal fork or repository** on GitHub.

- **Usage:** This is where your day-to-day code goes. When you type `git push origin main`, you are uploading your commits, custom styles, and synced notes to your own GitHub repo to trigger your live site deployment.

### 2. `upstream` (The Source Template)

- **What it is:** A secondary remote shortcut conventionally used to point to the **original, official repository** that you forked or copied a template from (in this case, Jacky Zhao's core `jackyzha0/quartz` repository).

- **What it does:** It acts as a read-only tracking reference to the master project upstream.

- **Usage:** You use it only when you want to update your local engine framework with the latest features or bug fixes from the official Quartz creators. You would run `git fetch upstream` and `git merge upstream/main` to pull those core engine upgrades into your project without affecting your deployment repository on `origin`.

### Quick Comparison

| Feature |origin  | upstream |
|--|--|--|
| Points to | Your personal repository on GitHub |The original, official template repository|
|Who owns it?|You|The original project maintainers (e.g., Jacky Zhao)|
|Main Action|`git push origin main` (Save and deploy your work)|`git pull upstream main` (Get official framework updates)|

# I remember setting upstream to push a local git repo to remote one. what is that

You are likely thinking of setting the upstream tracking branch using the **`-u`** or **`--set-upstream`** flag (e.g., `git push -u origin main`).

While the `upstream` remote we just talked about points to the _original repository_ (like Jacky Zhao's core project), setting an upstream **tracking branch** serves a completely different, day-to-day purpose in Git.

Here is what that command actually does:

### 1. What is an Upstream Branch?

When you use `git push -u origin main`, you are telling Git:

> _"Permanently link my local `main` branch to the `main` branch on `origin`."_

### 2. Why Use It?

- **Remembers your preferences:** After you run it the very first time with `-u`, Git remembers the connection.

- **Saves typing:** For all future updates, you no longer need to type `git push origin main`. You can just type **`git push`** (or **`git pull`**), and Git will automatically know where to upload or download your changes.

### Summary of the Two Meanings:

- **`git remote add upstream <url>`**: Links your local repo to the _original source template_ so you can pull framework updates.

- **`git push -u origin main`**: Links your local _branch_ to your _remote branch_ so future `git push` commands are short and automatic.
