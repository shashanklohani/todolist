import React, { Component } from "react";
import TodoItems from "./TodoItems";

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      key: "",
      editMode: "off"
    };

    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.editText = this.editText.bind(this);
    this.setDefaultState = this.setDefaultState.bind(this);
    this.rearrangeTasks = this.rearrangeTasks.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.deleteCompletedTask = this.deleteCompletedTask.bind(this);
    this.markAllComplete = this.markAllComplete.bind(this);
  }

  componentDidMount() {
    var item = localStorage.getItem('item');

    var itemJson = JSON.parse(item);
    if(itemJson !== null){
    this.setDefaultState(itemJson);
  }
  }

  setDefaultState(json) {
    this.setState({ items: json }, function () {
      console.log(json);
    });
  }

  changeStatus(key) {
    var itemsCopy = this.state.items;
    var newItem = {};
    console.log("Change Status");

    itemsCopy.map(function (item) {
      if (item.key === key) {
        if (item.status === "pending") {
          console.log("Change Status 1");
          item.status = "completed";
          newItem = item;
        }

        else if (item.status === "completed") {
          item.status = "pending";
          console.log("Change Status 2");
          newItem = item;
        }
      }
    });
    
    this.setState({
      items: itemsCopy
    }, function () {
      localStorage.setItem('item', JSON.stringify(this.state.items));
      var url = 'http://localhost:3005/api/items/' + key;
      // fetch(url, {
      //   method: 'PUT',
      //   body: JSON.stringify(newItem),
      //   headers: { 'Content-Type': 'application/json' }
      // }).catch(err => {
      //   alert(err);
      // })
    });
  }

  addItem(e) {
    if (this._inputElement.value !== "") {
      var newItem = {
        text: this._inputElement.value,
        key: Date.now(),
        status: "pending"
      }
      this.setState((prevState) => {
        return {
          items: prevState.items.concat(newItem)
        };
      }, function () {
        localStorage.setItem('item', JSON.stringify(this.state.items));
        // fetch('http://localhost:3005/api/items', {
        //   method: 'POST',
        //   body: JSON.stringify(newItem),
        //   headers: { 'Content-Type': 'application/json' }
        // }).catch(err => {
        //   alert(err);
        // })
      });
    }
    this._inputElement.value = "";
    e.preventDefault();
  }

  deleteItem(key) {
    var filteredItems = this.state.items.filter(function (item) {
      return (item.key !== key);
    });

    this.setState({
      items: filteredItems
    }, function () {
      localStorage.setItem('item', JSON.stringify(this.state.items));
      var url = 'http://localhost:3005/api/items/' + key;
      // fetch(url, {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' }
      // }).catch(err => {
      //   alert(err);
      // })
    })
  }

  rearrangeTasks(startId, dropId) {

    var n = startId.length;
    var m = dropId.length;

    var startN = startId[n - 1];
    var dropN = dropId[m - 1];

    var item = this.state.items;

    var temp = item[startN];
    var temp2 = item[dropN];

    item[startN] = item[dropN];
    item[dropN] = temp;

    var body = [temp2, temp];
    console.log("body");
    console.log(body);
    this.setState({ items: item });

    // fetch('http://localhost:3005', {
    //   method: 'PUT',
    //   body: JSON.stringify(body),
    //   headers: { 'Content-Type': 'application/json' }
    // }).catch(err => {
    //   alert(err);
    // })
  }

  editItem(text, key) {
    this.setState({ key: key });
    document.getElementsByClassName("header")[0].style.display = "none";
    var elem = document.getElementsByClassName("listItem");
    for (var i = 0; i < elem.length; i++) {
      elem[i].style.display = "none";
    }
    document.getElementById("buttonDeleteAll").style.display = "none";
    document.getElementById("buttonMarkAll").style.display = "none";
    document.getElementsByClassName("editor")[0].style.display = "initial";
    document.getElementById("inputEditor").value = text;
  }

  editText(e) {
    e.preventDefault();
    var key = this.state.key;
    var text = this._inputEditedText.value;
    var itemCopy = this.state.items;
    var newItem = {};
    
    if (text !== "") {
      itemCopy.map(function (item) {
        if (item.key === key) {
          console.log(itemCopy);
          item.text = text;
          newItem = item;
          console.log(itemCopy);
        }
      });
    }
    
    this.setState({
      items: itemCopy
    }, function () {
      localStorage.setItem('item', JSON.stringify(this.state.items));
      var url = 'http://localhost:3005/api/items/' + key;
      // fetch(url, {
      //   method: 'PUT',
      //   body: JSON.stringify(newItem),
      //   headers: { 'Content-Type': 'application/json' }
      // }).catch(err => {
      //   alert(err);
      // })
    });

    document.getElementsByClassName("header")[0].style.display = "flex";
    var elem = document.getElementsByClassName("listItem");
    for (var i = 0; i < elem.length; i++) {
      elem[i].style.display = "flex";
    }
    document.getElementById("buttonDeleteAll").style.display = "initial";
    document.getElementById("buttonMarkAll").style.display = "initial";
    document.getElementsByClassName("editor")[0].style.display = "none";
  }

  deleteCompletedTask() {
    var deletedItems = this.state.items.filter(function (item) {
      return (item.status !== "completed");
    });

    this.setState({
      items: deletedItems
    }, function () {
      localStorage.setItem('item', JSON.stringify(this.state.items));
      var url = 'http://localhost:3005/api/items';
      // fetch(url, {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' }
      // }).catch(err => {
      //   alert(err);
      // })
    });
  }

  markAllComplete() {
    var itemCopy = this.state.items;
    itemCopy.map(function (item) {
      item.status = "completed";
    });

    this.setState({
      items: itemCopy
    }, function () {
      localStorage.setItem('item', JSON.stringify(this.state.items));
      // fetch('http://localhost:3005/api', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' }
      // }).catch(err => {
      //   alert(err);
      // })
    });
  }

  render() {
    return (
      <div className="todoListMain">
        <div className="editor" id="editor" >
          <form onSubmit={this.editText}>
            <input ref={(a) => this._inputEditedText = a}
              placeholder="..." id="inputEditor">
            </input>
            <button type="submit">Edit</button>
          </form>
        </div>
        <div className="header">
          <form onSubmit={this.addItem}>
            <input ref={(a) => this._inputElement = a}
              placeholder="enter task">
            </input>
            <button type="submit">add</button>
          </form>
        </div>
        <TodoItems className="todoItem" changeStatus={this.changeStatus} rearrangeTasks={this.rearrangeTasks} editItem={this.editItem} entries={this.state.items} delete={this.deleteItem} />
        <button className="Button" id="buttonDeleteAll" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.deleteCompletedTask() }}>Delete All completed</button>
        <button className="Button" id="buttonMarkAll" onClick={this.markAllComplete}>Mark All Complete</button>
      </div>
    );
  }
}

export default TodoList;