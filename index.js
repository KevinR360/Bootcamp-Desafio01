const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Kevin", "email": "kevin@gmail.com"}

let requests = 0;

const projects = [
  {
    id: "1",
    title: "Novo Projeto",
    tasks: []
  }
];

server.use((req, res, next) => {
  requests++;

  console.log(requests);

  next();
});

function checkProjectInArray(req, res, next) {
  const id = req.params.id;
  if (id != "") {
    for (var i = 0; i < projects.length; i++) {
      if (id === projects[i].id) {
        const index = i;
        req.index = index;
        const project = projects[i];
        req.project = project;
      }
    }
  }
  if (!req.project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

//GET/projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//GET/projects/:id
server.get("/projects/:id", checkProjectInArray, (req, res) => {
  return res.json(req.project);
});

//POST/projects
server.post("/projects", (req, res) => {
  projects.push(req.body);

  return res.json(projects);
});

server.put("/projects/:id", checkProjectInArray, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  projects.splice(req.index, 1);

  return res.send();
});

server.listen(3333);
