const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
let counter = 0;

// Middleware: check if exists project with id param
function checkIdExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ message: "Project do not exists" });
  }

  return next();
}

// Middleware: counter number of requests
function counterRequest(req, res, next) {
  counter++;

  console.log(`Number of requests ${counter}`);

  return next();
}

server.use(counterRequest);

// Get all projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Insert new project
server.post("/projects", (req, res) => {
  const project = req.body;

  projects.push(project);

  return res.json({ projects });
});

// Insert new task in project
server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  return res.json({ projects });
});

// Update title of project
server.put("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(p => {
    if (p.id == id) {
      p.title = title;
    }
  });

  return res.json(projects);
});

// Delete project
server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.json(projects);
});

server.listen(3333);
