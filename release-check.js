require('dotenv').config();

const axios = require('axios');
const fs = require('fs');

const projects = require('./projects.json');
const webhook = process.env.SLACK_WEBHOOK;

const updates = [];

const getProjectInfo = async (project) => {
  const {
    org,
    repo
  } = project;

  const info = await axios.get(`https://api.github.com/repos/${org}/${repo}/releases/latest`);

  // Add something here to guard against the possibility that
  // this path doesn't exist.
  return {
    version: info.data.tag_name
  };
}

const projectBlock = (project) => {
  return {
    type: 'section',
    fields: [
      {
        type: 'mrkdwn',
        text: `*Project:*\n${project.repo}`
      },
      {
        type: 'mrkdwn',
        text: `*Latest Version:*\n${project.version}`
      },
      {
        type: 'mrkdwn',
        text: `*Releases:*\n<${project.releases}>`
      }
    ]
  };
};

const buildMessage = (updates) => {
  const message = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Version change(s) found'
        }
      }
    ]
  };

  for (const project of updates) {
    message.blocks.push({
      type: 'divider'
    });

    message.blocks.push(projectBlock(project));
  }

  return message;
};

const sendMessage = (message) => {
  axios.post(webhook, message);
};

(async() => {
  for (const project of projects) {
    const {
      version
    } = await getProjectInfo(project);

    if (project.version !== version) {
      updates.push({
        repo: project.repo,
        version,
        releases: `https://github.com/${project.org}/${project.repo}/releases`
      });

      project.version = version;
    }
  };

  if (updates.length) {
    const message = buildMessage(updates);
    sendMessage(message);
    fs.writeFileSync('projects.json', JSON.stringify(projects, undefined, 2));
  }
})();
