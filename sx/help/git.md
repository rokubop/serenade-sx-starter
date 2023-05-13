## git

*show help* *page down* *page up* *down <num>* *up <num>*

### Setting up your private repo

1. Create a private repository on GitHub

2. Change the remote URL to the new repository on GitHub:
   
```bash
git remote set-url origin https://github.com/yourusername/your_private_repo.git
```

3. Push the code to the private repository
```bash
git push -u origin main
```

Now you can do normal commands like `git add .` and `git commit -m "message"` and `git push` to your private repo


## Updating serenade-sx

If you want to pull updates from [serenade-sx-starter](https://github.com/rokubop/serenade-sx-starter)

1. Set Up a Remote to the Original Repository
```bash
git remote add upstream https://github.com/rokubop/serenade-sx-starter.git
# or SSH: git remote add upstream git@github.com:rokubop/serenade-sx-starter.git
git fetch upstream
```

2. Pull in Changes from the Original Repository
```bash
git pull upstream main
```