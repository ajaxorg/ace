#!/bin/bash
set -e


cd `dirname $0`/..
SOURCE=`pwd`

mkdir -p .apigenerator

# check if api dir is clean
if ! [ -f .apigenerator/.git/HEAD ]; then
    git clone git@github.com:ajaxorg/ace-api-docs.git .apigenerator
fi

pushd .apigenerator
git pull origin master # fetch

rm -rf ./doc

npm i
export ACE_VERSION="v$(node -p 'require("../package.json").version')"
node generateAnnotations.js ../src
node generateNewDts.js ace.d.ts
node generateDoc.js ./doc

rm -rf ./doc-repo
git worktree prune
git worktree add --force --no-checkout doc-repo origin/gh-pages

cd doc-repo
mv ../doc/* .
git reset origin/gh-pages
git add .

if [ "$(git status --porcelain)" ];  then
    git commit -m "build api reference $ACE_VERSION"
    git push origin HEAD:gh-pages --force
fi

popd



git worktree prune
rm -rf .apigenerator/ace-gh-pages
git worktree add --force --no-checkout .apigenerator/ace-gh-pages HEAD


pushd .apigenerator/ace-gh-pages
git reset > /dev/null
git rm -rf api  || :
mv ../doc-repo ./api
echo '[submodule "doc/wiki"]
        path = doc/wiki
        url = https://github.com/ajaxorg/ace.wiki.git
[submodule "build"]
        path = build
        url = https://github.com/ajaxorg/ace-builds.git
[submodule "api"]
        path = api
        url = https://github.com/ajaxorg/ace-api-docs.git' > .gitmodules
git add .gitmodules api

git commit -m "build api reference $ACE_VERSION"

git push --progress "origin"  HEAD:refs/heads/gh-pages --force

popd