# Quick Reference Commands

##### During development, there are several commands you may find yourself coming back to frequently. Keep this page up-to-date as you run across these common commands.

**Open a Tinker session:**
_Tinker is an interactive shell for Laravel that allows you to run PHP code and interact with your application's database, models, and other services from the command line._

```sh
php artisan tinker
```

**Upon switching to a new branch:**
_You may never have to use these commands after running them the first time, but they can be helpful if you run into some unexpected errors_

```sh
composer install
npm install
```

**After making front-end changes:**
_Any time you make changes on Vue pages or components, you will likely need to rebuild your application._

```sh
npm build
```

**If Livewire is giving you problems:**
_Livewire is a fullt-stack framework for Laravel that is used with front-end UI. You often will need to run this command after running a build_

```sh
php artisan vendor:publish --tag=livewire:assets --force
```

**Clearing caches:**
_Laravel caches configurations, views, and routes for performance. If something isn’t updating as expected, clearing caches can help._

```sh
php artisan cache:clear
php artisan view:clear
php artisan config:clear
php artisan route:clear
```

**Resetting sessions (e.g. if you get the 403 error on the CRM login page):**
_Clears all active user sessions in the database, which can fix authentication issues._

```sh
mysql -u root -p -e "DELETE FROM sessions;" plunjweb
```

**Discard changes (like build files) to switch branches:**
_If you have uncommitted changes that are causing conflicts when switching branches, this will reset everything to the last committed state._

```sh
git reset --hard && git clean -fd
```

**Delete a branch:**
_Removes a local Git branch that you no longer need. Use -D instead of -d to force delete if necessary._

```sh
git branch -d <branch-name>
```

**Get updates from remote repository:**
_Fetches the latest changes from the remote repo without merging them. The --prune flag removes references to deleted remote branches._

```sh
git fetch --prune
```

**List branches locally and remotely:**
_Displays all branches. Add -r to see only remote branches, or remove -a to see only local branches._

```sh
git branch -a
```

**Create a new branch:**
_Creates and switches to a new branch for development._

```sh
git checkout -b <branch-name>
```

**Push a new branch to remote repository:**
_Publishes your newly created branch to the remote repository and sets it to track changes._

```sh
git push -u origin <branch-name>
```

**Get latest changes from dev**
_If you find your repository is behind the dev branch, you can checkout your branch and run the following command to get the latest changes:_

```sh
git merge dev
```
