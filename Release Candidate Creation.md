Create Release Candidate
-----------------------------

Here are the steps required to update the versions across the groups for the client application.

1. Create a release directory. (E.g. `mkdir release ; cd release`)
2. Clone client project: `git clone git@git.emmisolutions.com:emmi-manager-release-candidate/client-angular.git`
3. Change into the source directory: `cd client-angular`
4. Edit package.json file to make non-SNAPSHOT. 
        (e.g. on OSX: `sed -i '' 's/"version": \(.*\)-SNAPSHOT"/"version": \1"/g' package.json`)
5. commit the version change: `git commit -m "created release version" package.json`
6. push to the remote repo: `git push`
7. Create a qa directory same level as the release directory. 
    (e.g. if you're still in the client-angular directory: `cd ../.. ; mkdir qa ; cd qa`)
8. Clone client project: `git clone git@git.emmisolutions.com:emmi-manager-qa/client-angular.git`
9. Change into the source directory: `cd client-angular`
9. Add upstream project: `git remote add upstream git@git.emmisolutions.com:emmi-manager-release-candidate/client-angular.git`
10. Fetch upstream changes: `git fetch upstream`
11. Merge upstream changes into master: `git merge -m "merging upstream" upstream/master`
12. Update the version in package.json to whatever is the $NEW_VERSION-SNAPSHOT.
    (e.g. on OSX to update to version 2.0.1-SNAPSHOT: 
        `sed -i '' 's/"version": ".*"/"version": "2.0.1-SNAPSHOT"/g' package.json`)
13. Commit and push: `git commit -m "new version of application" package.json ; git push`
14. Create a dev directory same level as the release directory. 
    (e.g. if you're still in the client-angular directory: `cd ../.. ; mkdir dev ; cd dev`)
15. Clone client project: `git clone git@git.emmisolutions.com:emmi-manager-development/client-angular.git`
16. Change into the source directory: `cd client-angular`
17. Add upstream project: `git remote add upstream git@git.emmisolutions.com:emmi-manager-qa/client-angular.git`
18. Fetch upstream changes: `git fetch upstream`
19. Merge upstream changes into master: `git merge -m "merging upstream" upstream/master`
20. Commit and push: `git commit -m "new version of application" package.json ; git push`
