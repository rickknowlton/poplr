import * as React from "react";
import { Box, Button } from "@mui/material";

const OutputControl = ({
  outputFormat,
  setOutputFormat,
  handleCopy,
  preview,
  handlePreview,
  darkMode
}) => {
  return (
    <Box
      id="outputTopBar"
      minHeight="68px"
      padding={2}
      fontSize="14px"
      lineHeight="18px"
      overflow="auto"
      fontFamily="'Courier New', monospace"
      bgcolor={darkMode ? "rgb(25, 25, 25)" : "lightgrey"}
      border="1px solid rgb(80, 80, 80)"
      borderRadius="4px"
      color="rgb(13, 180, 117)"
      display="flex"
      justifyContent="flex-end"
    >
      <Box display="flex" alignItems="center" mr="auto">
        <Button
          variant={outputFormat === "markdown" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setOutputFormat("markdown")}
        >
          Markdown
        </Button>
        <Box ml={1}>
          <Button
            variant={outputFormat === "html" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setOutputFormat("html")}
          >
            HTML
          </Button>
        </Box>
      </Box>
      <Box>
        <Button variant="outlined" color="primary" onClick={handleCopy}>
          Copy
        </Button>
      </Box>
      <Box ml={1}>
        <Button variant="outlined" color="primary" onClick={handlePreview}>
          {preview ? "Output" : "Preview"}
        </Button>
      </Box>
    </Box>
  );
};

export default OutputControl;
