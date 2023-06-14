import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  createTheme,
  ThemeProvider,
  IconButton,
  CssBaseline,
} from "@mui/material";
import { blue, pink } from "@mui/material/colors";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import axios from "axios";
import { URL } from "url";
import Logo from "./components/Logo";
import InputForm from "./components/InputForm";
import OutputControl from "./components/OutputControl";
import DirectoryOutput from "./components/DirectoryOutput";

const IndexPage = () => {
  const [markdown, setMarkdown] = useState("");
  const [rawHtml, setRawHtml] = useState("");
  const [outputFormat, setOutputFormat] = useState("markdown");
  const [preview, setPreview] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "" });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: blue,
          secondary: pink,
          background: {
            paper: darkMode ? "rgb(7, 39, 38)" : "lightgrey",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              outlined: {
                borderColor: darkMode ? blue[500] : "black",
                color: darkMode ? blue[500] : "black",
              },
              containedPrimary: {
                backgroundColor: darkMode ? blue[500] : "black",
                color: darkMode ? "white" : "white",
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const sanitizeRepoUrl = (inputUrl) => {
    try {
      const url = new URL(inputUrl);
      const pathName = url.pathname;
      const repoUrl = pathName.startsWith("/") ? pathName.slice(1) : pathName;
      return repoUrl;
    } catch (err) {
      return inputUrl;
    }
  };

  const fetchRepoData = async (repoUrl, path = "") => {
    setLoading(true);
    const url = `https://api.github.com/repos/${repoUrl}/contents/${path}`;
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        },
      });

      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error("Repository not found or is private");
      } else {
        throw new Error("An error occurred while fetching the repository data");
      }
    }
  };

  const traverseRepo = async (
    repoUrl,
    path = "",
    depth = 0,
    isLast = true,
    prefix = "    "
  ) => {
    let markdown = "";

    try {
      setLoading(true);
      const data = await fetchRepoData(repoUrl, path);

      for (let i = 0; i < data.length; i++) {
        const item = data[i];

        let newPrefix = prefix + (isLast ? "    " : "│   ");

        if (i === data.length - 1) {
          markdown += `${prefix}${isLast ? "└── " : "├── "}${
            item.type === "dir" ? "**" + item.name + "**" : item.name
          }\n`;
          if (item.type === "dir") {
            markdown += await traverseRepo(
              repoUrl,
              `${path}${item.name}/`,
              depth + 1,
              true,
              newPrefix
            );
          }
        } else {
          markdown += `${prefix}${"├── "}${
            item.type === "dir" ? "**" + item.name + "**" : item.name
          }\n`;
          if (item.type === "dir") {
            markdown += await traverseRepo(
              repoUrl,
              `${path}${item.name}/`,
              depth + 1,
              false,
              newPrefix
            );
          }
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }

    return markdown;
  };

  function formatMarkdown(markdown) {
    return markdown.split("\n").join("  \n");
  }

  const beautify = require("js-beautify").html;

  const markdownToHTML = (markdown) => {
    const lines = markdown.split("\n");
    let html = '<div class="tree">\n<ul>\n';

    const generateHTML = (lines, depth = 0) => {
      while (lines.length > 0) {
        const line = lines[0];
        const currentDepth = (line.match(/    /g) || []).length;

        if (currentDepth > depth) {
          html += "<ul>\n";
          generateHTML(lines, currentDepth);
          html += "</ul>\n</li>\n";
        } else if (currentDepth < depth) {
          return;
        } else {
          lines.shift();
          const name = line
            .trim()
            .replace(/\*\*/g, "") // Replace ** (bold in markdown)
            .replace(/(├── |└── )/g, ""); // Remove tree symbols
          html += `<li>${name}`;
          if (
            !lines[0] ||
            (lines[0].match(/    /g) || []).length <= currentDepth
          ) {
            html += "</li>\n";
          }
        }
      }
    };

    generateHTML(lines, 1);

    while (
      (html.match(/<li>/g) || []).length > (html.match(/<\/li>/g) || []).length
    ) {
      html += "</li>\n";
    }

    html += "</ul>\n</div>\n";

    return beautify(html);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && loading) {
        setLoading(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [loading]);

  useEffect(() => {
    if (markdown) {
      setRawHtml(markdownToHTML(markdown));
    }
  }, [markdown]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear any existing markdown and alert.
    setMarkdown("");
    setAlert({ open: false, message: "" });

    const rawRepoUrl = event.target.elements.repoUrl.value.trim();

    if (!rawRepoUrl) {
      setAlert({ open: true, message: "Please enter a GitHub Repository URL" });
      return;
    }

    const repoUrl = sanitizeRepoUrl(rawRepoUrl);
    try {
      const markdown = await traverseRepo(repoUrl);
      setMarkdown(markdown);
    } catch (error) {
      setLoading(false); // Stop the loading when an error occurs
      setAlert({ open: true, message: error.message });
    } finally {
      // Clear the input field
      event.target.elements.repoUrl.value = "";
    }
  };

  const handleClear = () => {
    setMarkdown("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        id="wrapper"
        display="flex"
        height="100vh"
        style={{
          background: darkMode
            ? "radial-gradient(circle, #1a2049 0%, #13162f 100%)"
            : "lightgrey",
        }}
      >
        <Box
          id="inputWrapper"
          width="33.33%"
          padding={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          style={{
            background: darkMode
              ? "radial-gradient(circle, #1a2049 0%, #13162f 100%)"
              : "lightgrey",
          }}
          minHeight="100vh"
        >
          <Logo darkMode={darkMode} />
          <InputForm
            markdown={markdown}
            darkMode={darkMode}
            handleSubmit={handleSubmit}
            handleClear={handleClear}
            alert={alert}
            setAlert={setAlert}
          />
        </Box>
        <Box
          id="outputWrapper"
          width="66.67%"
          style={{
            background: darkMode
              ? "radial-gradient(circle, #1a2049 0%, #13162f 100%)"
              : "lightgrey",
          }}
          padding={2}
          display="flex"
          flexDirection="column"
        >
          <OutputControl
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            handleCopy={handleCopy}
            handlePreview={handlePreview}
            preview={preview}
            darkMode={darkMode}
          />
          <DirectoryOutput
            loading={loading}
            markdown={markdown}
            rawHtml={rawHtml}
            preview={preview}
            outputFormat={outputFormat}
            darkMode={darkMode}
            formatMarkdown={formatMarkdown}
            markdownToHTML={markdownToHTML}
          />
        </Box>
      </Box>
      <IconButton
        id="themeToggle"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: darkMode ? "rgb(56, 56, 56)" : "lightgrey",
          color: "white",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
        }}
        onClick={handleDarkModeToggle}
      >
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </ThemeProvider>
  );
};

export default IndexPage;
