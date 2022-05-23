Notifies latest releses.

## Setup & Usage

1. Clone the project and `cd` into it
2. Copy `projects.json.example` to `projects.json` and fill accordingly
3. Copy `.env.example` to `.env` and fill accordingly
4. Run `node release-check.js`

## How It Works

`projects.json` contains a list of projects and their current version. When `release-check.js` is run, it will check for latest versions of the locally defined projects, and if any are different, it will notify over Slack and update it's local source.
