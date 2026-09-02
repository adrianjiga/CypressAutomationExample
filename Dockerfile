# The tag MUST match the `cypress` version resolved in package-lock.json.
#
# `cypress/included:X` ships a pre-downloaded Cypress binary for X in the image's
# binary cache. The `npm ci` below then installs whatever the lockfile pins. If the
# two disagree, the npm package looks for a binary that is not in the cache and the
# container fails before a single spec runs.
#
# Dependabot bumps this tag and the npm dependency on the same weekly schedule, but
# they arrive as separate PRs — merge them together, never one alone.
FROM cypress/included:15.21.1

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npx", "cypress", "run"]
