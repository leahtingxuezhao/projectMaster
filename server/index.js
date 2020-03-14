require("dotenv").config();
const express = require("express");
const massive = require("massive");
const app = express();
const { CONNECTION_STRING, SERVER_PORT } = process.env;
const taskCtrl = require("./taskController");

app.use(express.json());

// server static files when hitting the server
app.use(express.static("build"));

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  app.listen(SERVER_PORT, () =>
    console.log(`Server is listening on port ${SERVER_PORT}`)
  );
});

//ENDPOINTS

//task endpoints
app.get("/api/getToDoTasks/:owner", taskCtrl.getToDoTasks);
app.get("/api/getInProgressTasks/:owner", taskCtrl.getInProgressTasks);
app.get("/api/getReviewTasks/:owner", taskCtrl.getReviewTasks);
app.get("/api/getDoneTasks/:owner", taskCtrl.getDoneTasks);
app.put("/api/updateTaskToInProgress/:task_id", taskCtrl.updateTaskInProgress);
app.put("/api/updateTaskToReview/:task_id", taskCtrl.updateTaskReview);
app.put("/api/updateTaskToDone/:task_id", taskCtrl.updateTaskDone);
app.put("/api/updateTaskToDo/:task_id", taskCtrl.updateTaskToDo);

// app.delete("/api/deleteTask/:user_id", taskCtrl.deleteTask);
