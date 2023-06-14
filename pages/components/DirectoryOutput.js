import React from "react";
import { Box, TextareaAutosize, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";
import ReactHtmlParser from "react-html-parser";

const DirectoryOutput = ({
  loading,
  markdown,
  rawHtml,
  preview,
  outputFormat,
  darkMode,
  formatMarkdown,
  markdownToHTML,
}) => {
  return (
    <Box
      id="directoryOutput"
      display="flex"
      flexGrow="1"
      overflow="auto"
      border="1px solid #ddd"
      borderRadius="4px"
      bgcolor={darkMode ? "rgb(20, 20, 20)" : "rgb(198, 198, 198)"}
      color={darkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"}
    >
      {loading ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setLoading(false)}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size="5rem" color="primary" />
          </Box>
        </Box>
      ) : (
        markdown &&
        (preview ? (
          outputFormat === "markdown" ? (
            <ReactMarkdown>{formatMarkdown(markdown)}</ReactMarkdown>
          ) : (
            ReactHtmlParser(markdownToHTML(markdown))
          )
        ) : (
          <TextareaAutosize
            value={outputFormat === "markdown" ? markdown : rawHtml}
            aria-label="Markdown Directory Tree"
            rowsMin={10}
            placeholder="Markdown Directory Tree"
            readOnly
            style={{
              width: "100%",
              maxHeight: "100%",
              overflow: "auto",
              padding: "12px",
              fontSize: "18px",
              lineHeight: "18px",
              fontFamily: "'Courier New', monospace",
              backgroundColor: darkMode
                ? "rgb(20, 20, 20)"
                : "rgb(198, 198, 198)",
              color: darkMode ? "white" : "black",
            }}
          />
        ))
      )}
    </Box>
  );
};

export default DirectoryOutput;
