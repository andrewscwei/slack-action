#!/bin/bash

# Required environment variables:
# - GH_TOKEN: GitHub personal access token for write permissions

DIST_DIR=dist
ORIGIN_URL="https://${GITHUB_ACTOR}:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
RELEASE_BRANCH="release"
VERSION=v$(grep '"version"' package.json | cut -d '"' -f 4 | head -n 1)

if [ "$VERSION" != "$GITHUB_REF_NAME" ]; then
  echo "Failed to create release for ${VERSION}, version mismatch between pushed tag and package.json"
  exit 1
fi

echo "Creating release for ${VERSION}..."

# Checkout new branch
if [ `git branch | grep ${RELEASE_BRANCH}` ]; then git branch -D ${RELEASE_BRANCH}; fi
git checkout -b ${RELEASE_BRANCH}

# Build
npm run build
npm prune --production

# Remove unwanted files
find . -maxdepth 1 \
  ! -name '.' \
  ! -name '..' \
  ! -name ${DIST_DIR} \
  ! -name '.git' \
  ! -name 'action.yml' \
  ! -name 'node_modules' \
  ! -name 'package.json' \
  ! -name 'README.md' \
  -exec rm -rf {} \;

# Push to release branch
MAJOR_VERSION="$(cut -d '.' -f 1 <<< "$VERSION")"
COMMIT_MESSAGE="$(git log -1 --pretty=%B)"

git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git add -fA
git commit --allow-empty -m "${COMMIT_MESSAGE}"
git push -f --set-upstream ${ORIGIN_URL} ${RELEASE_BRANCH}

gh release create ${VERSION} --generate-notes

git tag -fa ${MAJOR_VERSION} -m "Map ${MAJOR_VERSION} to ${VERSION}"
git push origin ${MAJOR_VERSION} --force

echo "Successfully created release for ${VERSION}"
