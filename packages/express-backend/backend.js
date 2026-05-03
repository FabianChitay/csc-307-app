// backend.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    job: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error("Invalid job, must be at least 2 characters.");
      },
    },
  },
  { collection: "users_list" }
);

const userModel = mongoose.model("User", UserSchema);

mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  }
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

//end of mongoDB code
//start of my code


const findUserByNameandJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job,
  );
};

const deleteUser = (user) => {
  const index = users["users_list"].indexOf(user);
  users["users_list"].splice(index, 1);
};

const generateId = (user) => {
  user["id"] = Math.floor(1000000 * Math.random()).toString();
};

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
