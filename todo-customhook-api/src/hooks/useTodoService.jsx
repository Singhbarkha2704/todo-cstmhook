import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_TODO_BASE_URL;

const useTodoService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todoList, setTodoList] = useState([]);

  //GET call
  const fetchTodoList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}`);
      console.log(`res`, res);
      setTodoList(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  //POST API CALL
  const addTodo = async (todo) => {
    setLoading(true);
    try {
      const res = await axios.post(BASE_URL, todo);
      // delay();
      console.log(`res`, res);
      if (res.status === 201) {
        console.log(`resp->`, res);
        setTodoList([...todoList, res?.data]);
      }
      console.log(`todoList`, todoList);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // PATCH Call
  const toggleCompleted = async (id, completed) => {
    setLoading(true);
    try {
      const res = await axios.patch(`${BASE_URL}/${id}`, { completed });
      // delay(page);
      const toggledCompletion = todoList.map((todo) =>
        todo.id === id ? { ...todo, ...res?.data } : todo
      );
      setTodoList(toggledCompletion);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  //Delete Todo
  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${BASE_URL}/${id}`);

      if (res.status === 200) {
        setTodoList(todoList.filter((elem) => elem.id != id));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  //Put api call
  const updateTodo = async (id, updatedTodo) => {
    setLoading(true);
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, updatedTodo);
      console.log(`res`, res);
      const editedTodo = todoList.map((todo) =>
        todo.id === id ? { ...todo, ...res?.data } : todo
      );
      setTodoList(editedTodo);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoList();
  }, []);

  return {
    todoList,
    error,
    loading,
    fetchTodoList,
    toggleCompleted,
    addTodo,
    updateTodo,
    deleteTodo,
  };
};

export default useTodoService;
