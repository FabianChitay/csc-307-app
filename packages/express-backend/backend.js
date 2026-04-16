// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByJob = (job) => {
  return users["users_list"].filter((user) => user["job"] === job);
};

const findUserByNameandJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job,
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  // generateId(user);
  users["users_list"].push(user);
  return user;
};

const deleteUser = (user) => {
  const index = users["users_list"].indexOf(user);
  users["users_list"].splice(index, 1);
};

const generateId = (user) => {
  user["id"] = Math.floor(1000000 * Math.random()).toString();
};

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  let result = users;
  if (name != undefined && job != undefined) {
    result = findUserByNameandJob(name, job);
    result = { users_list: result };
  } else if (name != undefined) {
    result = findUserByName(name);
    result = { users_list: result };
  } else if (job != undefined) {
    result = findUserByJob(job);
    result = { users_list: result };
  }
  res.send(result);
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

/*
app.delete("/users", (req, res) => {
  const userToDelete = findUserById(req.params["id"]);
  deleteUser(userToDelete);
  res.status(204).send();
});
*/

//new function, delete from id url?
app.delete("/users/:id", (req, res) => {
  const userToDelete = findUserById(req.params["id"]);
  console.log(req.params);
  console.log(userToDelete);
  console.log("user ", userToDelete.name, " found.");
  if (userToDelete === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    deleteUser(userToDelete);
    console.log("user deleted.");
    res.status(204).send();
  }
});

app.post("/users", (req, res) => {
  // generateId(req.body);
  const userToAdd = req.body;
  generateId(userToAdd);
  // userToAdd.id = Math.floor(1000000 * Math.random());
  addUser(userToAdd);
  console.log("user ", userToAdd.name, "added.");
  res.status(201).send(userToAdd);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
