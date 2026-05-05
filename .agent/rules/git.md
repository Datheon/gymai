<!-- File: fitos/.agent/rules/git.md -->
# Git Identity — Frontend Agent

## Identity
When committing and pushing to GitHub, always use this identity:

GIT_AUTHOR_NAME="datheonFrontend"
GIT_AUTHOR_EMAIL="datheonFrontend@users.noreply.github.com"
GIT_COMMITTER_NAME="datheonFrontend"
GIT_COMMITTER_EMAIL="datheonFrontend@users.noreply.github.com"

## Push
Token is stored in .env.agents (never committed to git)
Remote: https://datheonFrontend:TOKEN@github.com/Datheon/gymai.git

## Commit format
Always follow Conventional Commits + Taiga:
feat(features/auth/login): add login form TG-14 #in-progress

## Rules
- Never commit directly to main without human review
- Always reference a Taiga issue with TG-XX
- Always use the agent identity, never the human identity
- Token lives in .env.agents, never in this file