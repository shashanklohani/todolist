import React, { Component } from "react";
import FlipMove from "react-flip-move";
import "./TodoItem.css";

class TodoItems extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      status: "Pending",
      editable: "false",
      val: 0,
      startId: ""
    };

    this.editTask = this.editTask.bind(this);
    this.createTasks = this.createTasks.bind(this);
    this.allowDrop = this.allowDrop.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  createTasks (item, index) {
    return <div className="listItem" key={index +"listItem"} id={"listItem" + index} draggable="true" onDragOver={(e)=>this.allowDrop(e)} onDragStart={this.dragStart} onDrop={this.onDrop}>
      <button id={"statusButton" + index} key={index +"statusButton"} className="Button" onClick={()=>this.changeStatus(item.key)}>
      {item.status === "pending" ? "Pending" : "Completed"}
      </button>
      <li className="List" id={"list" + index} key={index +"list"} style={item.status === "pending" ? {textDecoration : "none"} : {textDecoration : "line-through"}} onClick= {()=>this.editTask(index, item.key)}>{item.text}
      </li>
      <button id={"deleteButton" + index} key={index +"deleteButton"} className="Button" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.delete(item.key)}}>DELETE
      </button>
    </div>
  }

  allowDrop(ev){
    console.log("allow drop");
    ev.preventDefault();
  }

  dragStart(ev){
    console.log("on start");
    var startId = ev.target.id;
    this.setState({startId: startId});
  }

  onDrop(ev){
    var dropId = ev.target.id;
    this.props.rearrangeTasks(this.state.startId, dropId);
    console.log("on drop");
  }

  changeStatus(key){
    console.log("change status");
    this.props.changeStatus(key);
  }

  editTask(index, key){
    this.setState({editable: "true"});
    var text = document.getElementById("list" + index).innerHTML;
    this.props.editItem(text, key);
  }

  delete(key) {
    this.props.delete(key);
  }
  
  render() {
    var todoEntries = this.props.entries;
    var listItems = todoEntries.map((entry, index) => this.createTasks(entry, index));
    
    return (
      <ul className="theList">
        <FlipMove duration={250} easing="ease-out">
          {listItems}
        </FlipMove>
      </ul>
    );
  }
};
export default TodoItems;