module.exports = {
  getToDoTasks: (req, res) => {
    const db = req.app.get("db");
    const { owner } = req.params;
    console.log("owner :", owner);
    db.get_allTasks_singleUser_todo(owner).then(data =>
      res.status(200).send(data)
    );
  },

  getInProgressTasks: (req, res) => {
    const db = req.app.get("db");
    const { owner } = req.params;
    db.get_allTasks_singleUser_inProgress(owner).then(data =>
      res.status(200).send(data)
    );
  },

  getReviewTasks: (req, res) => {
    const db = req.app.get("db");
    const { owner } = req.params;
    db.get_allTasks_singleUser_review(owner).then(data =>
      res.status(200).send(data)
    );
  },
  getDoneTasks: (req, res) => {
    const db = req.app.get("db");
    const { owner } = req.params;
    db.get_allTasks_singleUser_done(owner).then(data =>
      res.status(200).send(data)
    );
  },
  updateTaskInProgress: (req, res) => {
    const db = req.app.get("db");
    const { task_id } = req.params;
    db.update_task_to_inProgress(task_id).then(() => res.sendStatus(200));
  },
  updateTaskReview: (req, res) => {
    const db = req.app.get("db");
    const { task_id } = req.params;
    db.update_task_to_review(task_id).then(() => res.sendStatus(200));
  },
  updateTaskDone: (req, res) => {
    const db = req.app.get("db");
    const { task_id } = req.params;
    db.update_task_to_done(task_id).then(() => res.sendStatus(200));
  }
  // deleteTask: (req, res) => {
  //   const db = req.app.get("db");
  //   const { task_id } = req.params;
  //   db.tasks.delete_task(Number(task_id)).then(() => {
  //     db.tasks.delete_task(Number(task_id)).then(data => res.sendStatus(200));
  //   });
  // }
};
