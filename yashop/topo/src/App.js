
import './App.css';
import React from 'react';

class App extends React.Component {
constructor(props){
super(props);
this.state={
todoList:[],
activeItem:{
id:null,
title:"",
completed:false,
},
editing:false,

}
this.fetchtasks=this.fetchtasks.bind(this)
this.handleChange=this.handleChange.bind(this)
this.handleSubmit=this.handleSubmit.bind(this)
this.handleDelete=this.handleDelete.bind(this)
this.startEdit=this.startEdit.bind(this)
};
 getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
componentWillMount(){
  this.fetchtasks()
}
fetchtasks(){
console.log("Fetching....")
fetch('http://127.0.0.1:8000/app/todo-list/')
.then(res=>res.json())
.then(data=>
this.setState({
todoList:data
})
)
}
handleChange(e){
var name=e.target.name
var value=e.target.value
this.setState({
activeItem:{
...this.state.activeItem,title:value
}
})
}
handleSubmit(e){
e.preventDefault()
var csrftoken=this.getCookie('csrftoken')
var url='http://127.0.0.1:8000/app/todo-create'
if(this.state.editing==true){
url=`http://127.0.0.1:8000/app/todo-update/${this.state.activeItem.id}/`
this.setState({
editing:false
})
}
fetch(url,{
method:'POST',
headers:{
'Content-type':'application/json',
'X-CSRFToken':csrftoken
},
body:JSON.stringify(this.state.activeItem)
}).then((res)=>{
this.fetchtasks()
this.setState({
activeItem:{
id:null,
title:"",
completed:false,
}

})
}

)
}
handleDelete(task){
var csrftoken=this.getCookie('csrftoken')
fetch(`http://127.0.0.1:8000/app/todo-delete/${task.id}/`,{
method:'DELETE',
headers:{
'Content-type':'application/json',
'X-CSRFToken':csrftoken,
},


}).then((res)=>{
this.fetchtasks()
})}



startEdit(task){
this.setState({
activeItem:task,
editing:true
})

}


render(){
var tasks=this.state.todoList
  return (
    <div className="App">
    <h1 className="top text-danger">TODO`S</h1>
    <div className="col con">
    <form onSubmit={this.handleSubmit}>
    <input onChange={this.handleChange} value={this.state.activeItem.title} name="title" className="bg-danger" type="text" />
    <button className="btn btn-info" type="submit">Task</button>
    </form>
    </div>

    {tasks.map(task=>(
    <div className="container">
    <div className="row">
    <div  className=" d-flex justify-content-center ok">
    <h1 className="text-warning bg-dark">{task.title}</h1>
    <button onClick={()=>this.startEdit(task)} className="btn btn-primary">Edit</button>
    <button onClick={()=>this.handleDelete(task)} className="btn btn-success">-</button>
    </div>
    </div>
    </div>
    ))}


    </div>
  );
}}

export default App;
