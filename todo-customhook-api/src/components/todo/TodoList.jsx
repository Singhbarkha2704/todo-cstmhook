import { IconButton, TextField, Tooltip } from "@mui/material";
import useTodoService from "../../hooks/useTodoService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { Fragment, useCallback, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddInputRow from "./AddInputRow";
import CancelIcon from "@mui/icons-material/Cancel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const columns = [
  // { id: "id", label: "id", minWidth: 300 },
  { id: "title", label: "Task", minWidth: 900 },
  { id: "actions", label: "Actions", minWidth: 200 },
];

export default function TodoList() {
  const {
    todoList,
    deleteTodo,
    addTodo,
    updateTodo,
    toggleCompleted,
    loading,
  } = useTodoService();
  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [addMode, setAddMode] = useState(false);
  const rows = todoList;

  const handleAddTodo = useCallback(
    (event) => {
      if (event.key === "Enter" && newTodo.trim() !== "") {
        addTodo({
          // id: 789, // Generate a unique id
          title: newTodo,
          completed: false,
        });
        toast.success("Todo Added Successfully!");
        setNewTodo(""); // Clear the input field
        setAddMode(false);
      }
    },
    [addTodo, newTodo]
  );

  const editStartHandler = (id, title) => {
    setEditId(id);
    setEditTitle(title);
  };

  const editSaveHandler = (event) => {
    if (event.key === "Enter" && editTitle.length) {
      updateTodo(editId, { title: editTitle, completed: false });
      setEditId(null);
      setEditTitle("");
      toast.success("🙉 Todo Updated Successfully!!");
    }
  };

  const editCancelHandler = () => {
    setEditId(null);
    setEditTitle("");
  };

  const toggleHandler = (id, completed) => {
    toggleCompleted(id, !completed);
    completed ? toast.info("Todo Mark Undone!") : toast.info("Todo Completed!");
  };

  const deleteHandler = (id) => {
    deleteTodo(id);
    toast.info("Todo Deleted Successfully!");
  };

  return (
    <Fragment>
      {loading && <div>Loading..</div>}
      {/* Add Button */}

      <Tooltip title={"Click to Add Todo"} placement="bottom">
        <IconButton
          variant="contained"
          color="primary"
          onClick={() => setAddMode(true)}
          className="add-icon"
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      {/* ----------Table-------------- */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow style={{ height: "1em" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {addMode && (
              <AddInputRow
                newTodo={newTodo}
                setNewTodo={setNewTodo}
                handleAddTodo={handleAddTodo}
              />
            )}
            {rows
              ?.slice()
              .reverse()
              .map((row) => {
                const isCompleted = row.completed;
                const rowStyle = isCompleted
                  ? {
                      backgroundColor: "#e0ffe0", // Light green background
                      textDecoration: "line-through", // Strike-through text
                      height: "1em",
                    }
                  : { height: "1em" };
                return (
                  <>
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      style={rowStyle}
                    >
                      {columns.map((column) => {
                        if (column.id === "actions" && editId !== row.id) {
                          return (
                            <TableCell key={column.id}>
                              <Tooltip title="Click to Edit" placement="bottom">
                                <IconButton
                                  color="primary"
                                  onClick={() => {
                                    editStartHandler(row.id, row.title);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip
                                title="Click to Delete"
                                placement="bottom"
                              >
                                <IconButton
                                  aria-label="delete"
                                  sx={{ color: "#e92447" }}
                                  onClick={() => {
                                    deleteHandler(row.id);
                                  }}
                                >
                                  <GridDeleteIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip
                                title={
                                  row.completed
                                    ? "Click to Mark Undone"
                                    : "Click to Mark Completed"
                                }
                                placement="bottom"
                              >
                                <IconButton
                                  color="success"
                                  variant="standard"
                                  onClick={() =>
                                    toggleHandler(row.id, row.completed)
                                  }
                                >
                                  <DoneIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          );
                        } else if (
                          column.id === "actions" &&
                          editId === row.id
                        ) {
                          return (
                            <TableCell key={column.id}>
                              <Tooltip
                                title="Click to Update"
                                placement="bottom"
                              >
                                <IconButton
                                  color="primary"
                                  variant="standard"
                                  onClick={editCancelHandler}
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          );
                        }
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id}>
                            {editId === row.id ? (
                              <TextField
                                id="standard-basic"
                                variant="standard"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={editSaveHandler}
                              />
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <ToastContainer autoClose={1200} transition:Bounce />
    </Fragment>
  );
}
