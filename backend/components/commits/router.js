const express = require('express');
const router = express.Router();

const { GitHubRepository } = require('../../utils/githubClient');
const Model = require('./model');
const Service = require('./service');
const Controller = require('./controller');

const model = Model(GitHubRepository);
const service = Service(model);
const controller = Controller(service);

const commitsRouter = (app, route, ctr = controller) => {
  const { findAll, findOne } = ctr;
  router.get('/:author/:repositoryName/branches/:branchName/commits', findAll);
  router.get(
    '/:author/:repositoryName/branches/:branchName/commits/:commitSha',
    findOne
  );

  app.use(route, router);
};

module.exports = commitsRouter;
