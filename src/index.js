import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
/**
 * Moves an item from one list to another list.
 */

const id4List = {
  droppable: "tasks",
  droppable2: "inProgress",
  droppable3: "review",
  droppable4: "done"
};
const move = (
  source,
  destination,
  droppableSource,
  droppableDestination,
  setState
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  const sourceId = id4List[droppableSource.droppableId];
  const destId = id4List[droppableDestination.droppableId];

  destClone.splice(droppableDestination.index, 0, removed);

  // optimistic update
  setState({
    [sourceId]: sourceClone,
    [destId]: destClone
  });

  const updateTaskInProgress = () => {
    axios.put(`/api/updateTaskToInProgress/${removed.task_id}`).then(res => {
      setState({
        [sourceId]: sourceClone,
        [destId]: destClone
      });
    });
  };

  const updateTaskToDo = () => {
    axios.put(`/api/updateTaskToDo/${removed.task_id}`).then(res => {
      setState({
        [sourceId]: sourceClone,
        [destId]: destClone
      });
    });
  };
  const updateTaskToReview = () => {
    axios.put(`/api/updateTaskToReview/${removed.task_id}`).then(res => {
      setState({
        [sourceId]: sourceClone,
        [destId]: destClone
      });
    });
  };

  const updateTaskToDone = () => {
    axios.put(`/api/updateTaskToDone/${removed.task_id}`).then(res => {
      setState({
        [sourceId]: sourceClone,
        [destId]: destClone
      });
    });
  };
  if (droppableDestination.droppableId === "droppable2") {
    updateTaskInProgress();
  } else if (droppableDestination.droppableId === "droppable3") {
    updateTaskToReview();
  } else if (droppableDestination.droppableId === "droppable") {
    updateTaskToDo();
  }
  const result = {};
  result[sourceId] = sourceClone;
  result[destId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      inProgress: [],
      review: [],
      done: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async componentDidMount() {
    await this.getTasksToDo();
    await this.getTasksInProgress();
    await this.getTasksReview();
    // await this.getTasksDone();
  }

  getTasksToDo = () => {
    let owner = 1;
    axios
      .get(`/api/getToDoTasks/${owner}`)
      .then(res => {
        this.setState({ tasks: res.data });
      })
      .catch(err => console.log("err", err));
  };

  getTasksInProgress = () => {
    let owner = 1;
    axios
      .get(`/api/getInProgressTasks/${owner}`)
      .then(res => {
        this.setState({ inProgress: res.data });
      })
      .catch(err => console.log("err", err));
  };

  getTasksReview = () => {
    let owner = 1;
    axios
      .get(`/api/getReviewTasks/${owner}`)
      .then(res => {
        this.setState({ review: res.data });
      })
      .catch(err => console.log("err", err));
  };

  getTasksDone = () => {
    let owner = 1;
    axios
      .get(`/api/getDoneTasks/${owner}`)
      .then(res => {
        this.setState({ tasks: res.data });
      })
      .catch(err => console.log("err", err));
  };

  getList = id => this.state[id4List[id]];

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const DDD = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { DDD };

      if (source.droppableId === "droppable2") {
        state = { inProgress: DDD };
        this.setState({ ...this.state, state });
      } else if (source.droppableId === "droppable3") {
        state = { review: DDD };
        this.setState({ ...this.state, state });
      } else if (source.droppableId === "droppable") {
        state = { tasks: DDD };
        this.setState({ ...this.state, state });
      }
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination,
        data => {
          this.setState({ ...this.state, ...data });
        }
      );
      console.log("this.state :", this.state);
    }
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.tasks.map((task, index) => (
                <Draggable
                  key={task.task_id}
                  draggableId={task.task_id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div>{task.task_id}</div>
                      <div>{task.task_name}</div>
                      <div>{task.task_description}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="droppable2">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.inProgress.map((task, index) => (
                <Draggable
                  key={task.task_id}
                  draggableId={task.task_id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div>{task.task_id}</div>
                      <div>{task.task_name}</div>
                      <div>{task.task_description}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="droppable3">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.review.map((task, index) => (
                <Draggable
                  key={task.task_id}
                  draggableId={task.task_id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div>{task.task_id}</div>
                      <div>{task.task_name}</div>
                      <div>{task.task_description}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

// Put the thing into the DOM!
ReactDOM.render(<App />, document.getElementById("root"));
