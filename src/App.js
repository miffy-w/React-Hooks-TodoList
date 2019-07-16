import React,{ useState, useRef ,useEffect,useContext , useCallback, createContext} from 'react';
import './App.css';

const TodoContext = createContext();

function TodoBox(props){

  const ipt = useRef(null);

  function handleAddItem(e){
    e.preventDefault();
    if(!ipt.current.value){
      return;
    }
    props.addItem({
      item: ipt.current.value,
      haveDone: false,
      id: +new Date()
    });
    ipt.current.value = '';
  }

  return (
    <form className="todo-form">
      <input ref={ipt} type="text" placeholder="请输入代办事务" />
      <button onClick={handleAddItem} type="submit">submit</button>
    </form>
  );
}

function List(){
  const context = useContext(TodoContext);
  return (
    <ul className="listWrapper">
      {
        context.itemInfo.length === 0 ? '' :
        context.itemInfo.map(item => {
          return (
            <Item key={item.id} info={item} />
          );
        })
      }
    </ul>
  );
}

function Item(props){

  const info = props.info;
  const context = useContext(TodoContext);

  function handleRemove(){
    context.removeItem(info.id);
  }

  function handleChange(){
    context.toggle(info.id);
  }

  return (
    <li className="todo-item">
      <input onChange={handleChange} type="checkbox" checked={info.haveDone} />
      <label className={info.haveDone ? "routine" : ""}>{info.item}</label>
      <span onClick={handleRemove} className="remove">&#215;</span>
    </li>
  );
}

function TodoList(){

  const NOTES = 'notes';
  const [itemInfo,setItemInfo] = useState([]);

  const addItem = useCallback((info) => {
    if(itemInfo.find((elem) => elem.item === info.item)){
      return;
    }
    setItemInfo([...itemInfo, info]);
  },[itemInfo]);

  const removeItem = useCallback((id) => {
    setItemInfo(itemInfo.filter(value => value.id !== id));
  },[itemInfo]);

  const toggle = useCallback((id) => {
    setItemInfo([].concat(itemInfo).map(item => {
      if (item.id === id) {
        item.haveDone = !item.haveDone;
      }
      return item;
    }));
  },[itemInfo]);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem(NOTES));
    setItemInfo(data ? data : []);
  },[]);

  useEffect(() => {
    localStorage.setItem(NOTES, JSON.stringify(itemInfo));
  }, [itemInfo]);

  return (
    <div className="wrapper">
      <h1 className="title">todoList</h1>
      <TodoBox addItem={addItem}  />
      <TodoContext.Provider value={{itemInfo,removeItem,toggle}}>
        <List />
      </TodoContext.Provider>
    </div>
  );
}

//  infoList={itemInfo} remove={removeItem} toggle={toggle}

export default TodoList;