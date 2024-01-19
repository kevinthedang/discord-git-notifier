# Git Notifier Discord Bot [![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-darkgreen.svg)](https://creativecommons.org/licenses/by-nc/4.0/) [![Release Badge](https://img.shields.io/github/v/release/kevinthedang/discord-git-notifier?logo=github)](https://github.com/kevinthedang/discord-git-notifier/releases/latest)
Sometimes it's annoying to go on GitHub or ask my friends if they made changes to the codebase. So, I want to create a bot that will notify me if changes are made to a repository so I don't need to ask or check. It would also be cool if the bot displays the diff into a codeblock on discord to see what was added!

## Ideas
Git discord bot idea to keep simple updates to discord channels on:
* Commits
* Merges
* Pull Requests
* Releases
* Issues
* Maybe more when I think of them
I am thinking of either having all messages either link to a channel in a server or just have multiple channels (maybe even 1 thread per repository) to handle different repositories.

## Other Considerations
Another thing I've considered is handle organizations/issues/etc.  
An alternative to this is to have a trello integration for when:
* Cards update/change for a card (when someone hits "Save" when updating a card on Trello)
* People are added to cards/assigned
* When a date changes for a certain card
* When something has been completed/checked off on a checklist that a card might have
So it would be a Git/Trello Discord Bot (OR maybe known as a simple Agile Bot, but then I'd have to handle more things too)

Something to consider in terms of accounts and running scripts!!!
* The Bot is it's own Discord User and Trello Account!
* When making requests, it will be acting on it's own for listening to boards/workspaces
    * What might be security risks for this as a Trello account?

## Resources
* [NodeJS](https://nodejs.org/en/download/)
    * This project will use `v18.18.2` so that nodemon will work properly, `v18.19.0` and up does not work for some reason.
    * Consider using [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md#about) for multiple node versions.
* [Discord Developer Portal](https://discord.com/developers/docs/intro)
    * [Discord.js Docs](https://discord.js.org/docs/packages/discord.js/main)
* [Trello REST API Docs](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/#api-group-actions)
    * [Trello Power-Ups Reference](https://developer.atlassian.com/cloud/trello/power-ups/)
* [GitHub REST API Docs](https://docs.github.com/en/rest)
    * [Getting started with the Rest API](https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api?apiVersion=2022-11-28&tool=javascript)
    * [Octokit.js](https://github.com/octokit/octokit.js/#readme)

## Acknowledgement
* [Kevin Dang](https://github.com/kevinthedang)

I found the following to be helpful with current ideas: [gitbot](https://github.com/statch/gitbot)

[discord-git-notifier](https://github.com/kevinthedang/discord-git-notifier) © 2023 by [Kevin Dang](https://github.com/kevinthedang) is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1)