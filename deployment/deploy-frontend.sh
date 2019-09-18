#!/bin/bash -e

function deploy() {
  echo "================================================================"
  echo "Deploying frontend branch $1 in version $2"
  echo "================================================================"

  tmp=$(mktemp -d -t parker-XXXXXXXXXX)
  echo "Temp dir: $tmp"

  git --git-dir=$GIT_DIR --work-tree $tmp checkout $1 -- frontend
  cd "$tmp/frontend"
  npm install
  npm run build
  npm run deploy -- --version $2
  cd -

  rm -rf $tmp
}

for ref in $@;
do
  branch=$(basename $ref)
  if [ "$branch" != "master" ];
  then
    deploy $branch $branch
  else
    deploy $branch "release"
  fi
done
