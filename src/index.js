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
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

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

  id4List = {
    droppable: "tasks",
    droppable2: "inProgress",
    droppable3: "review",
    droppable4: "done"
  };

  componentDidMount() {
    this.getTasksToDo();
    this.getTasksInProgress();
    this.getTasksReview();
    this.getTasksDone();
  }

  getTasksToDo = () => {
    let owner = 1;
    axios
      .get(`/api/getToDoTasks/${owner}`)
      .then(res => {
        console.log("res :", res);
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

  // updateTaskInProgress = () => {
  //   axios.put(`/api/updateTaskToInProgress/${task_id}`).then(res => {
  //     this.setState({ tasks: res.data, inProgress: res.data });
  //   });
  // };

  getList = id => this.state[this.id4List[id]];

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const tasks = reorder(
      this.state.tasks,
      result.source.index,
      result.destination.index
    );

    this.setState({
      tasks
    });
  }

  onDragEnd = result => {
    const { source, destination } = result;
    console.log("source :", source);
    console.log("destination :", destination);

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const tasks = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { tasks };

      if (source.droppableId === "droppable2") {
        state = { inProgress: tasks };
      }
      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        tasks: result.droppable,
        inProgress: result.droppable2
      });
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
      </DragDropContext>
    );
  }
}

// Put the thing into the DOM!
ReactDOM.render(<App />, document.getElementById("root"));
