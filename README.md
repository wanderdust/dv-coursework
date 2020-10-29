# Data Visualization Coursework

### Git Workflow

* Check your current branch with `git branch`. If it is `master`, you first need to create another branch to start making changes.
* (optional) If you make any accidental changes in `master` (you can check by running `git status`) and you want to undo them, run `git reset HEAD --hard`. THis will undo all changes in master and will let you checkout into another branch.
* To create a new branch, do `git branch branchname` where `branchname` is the name you want to give it. It should be something related with the feature you are going to work in. For example if I'm working in the colour of a barchart I could name it barchart-colour.
* To change into that branch, do `git checkout branchname`. Now you can start making changes.
* Once you have made any changes in `branchname` that you want to commit, you first need to stage all the changes via `git add .` .Don't forget the dot at the end. (optional) If you want to see your changes in detail run `git diff --staged` .
* Run `git status` to see in green all the your changes that you want to commit.
* To finally save all your changes run `git commit -m "Short message explaining your changes`. You should add a message that explains well what you have changed.
* To push your changes into GitLab, run `git push origin branchname`. 

* If you wish to delete your branch name and start a new one:
    * First leave that branch and go into `master` using `git checkout master`
    * Then remove branch locally with `git branch --delete branchname`
    * Then remove branch in GitLab with `git push origin --delete branchname`

* And now you can start all over again by creating a new branch and adding your changes.

* This is a test