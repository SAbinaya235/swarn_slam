const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Web3 = require("web3").default;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Simple test API
app.get("/api/test", async (req, res) => {
  try {
    const accounts = await web3.eth.getAccounts();
    res.json({
      message: "Connected to blockchain!",
      accounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
