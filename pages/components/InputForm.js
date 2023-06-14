import * as React from "react";
import { Box, Button, TextField, Alert } from "@mui/material";

const InputForm = ({ markdown, darkMode, handleSubmit, handleClear, alert, setAlert }) => {
  return (
    <Box
      id="inputFormWrapper"
      background="rgba( 60, 60, 60, 0.25 )"
      boxShadow={
        darkMode
          ? "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"
          : "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
      }
      borderRadius="10px"
      border="1px solid rgba( 255, 255, 255, 0.18 )"
      padding="55px 95px"
    >
      <form onSubmit={handleSubmit}>
        <Box marginBottom={2}>
          <TextField
            name="repoUrl"
            label="GitHub Repository"
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box
          id="inputTopBar"
          display="flex"
          justifyContent="center"
          marginBottom={2}
        >
          <Box>
            <Button type="submit" variant="outlined" color="primary">
              Submit
            </Button>
          </Box>
          <Box ml={1}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              disabled={!markdown}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </form>
      {alert.open && (
        <Alert
          severity="error"
          variant="outlined"
          onClose={() => setAlert({ open: false, message: "" })}
        >
          {alert.message}
        </Alert>
      )}
    </Box>
  );
};

export default InputForm;
