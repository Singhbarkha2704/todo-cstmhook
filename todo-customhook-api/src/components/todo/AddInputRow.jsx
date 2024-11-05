import { TableCell, TableRow, TextField } from "@mui/material";

// eslint-disable-next-line react/prop-types
const AddInputRow = ({ newTodo, setNewTodo, handleAddTodo }) => {
  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      style={{
        height: "1em",
      }}
    >
      <TableCell>
        <TextField
          id="standard-basic"
          label="What's your task?"
          variant="standard"
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
          onKeyDown={handleAddTodo}
        />
      </TableCell>

      <TableCell></TableCell>
    </TableRow>
  );
};

export default AddInputRow;
