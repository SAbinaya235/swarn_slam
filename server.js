const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Web3 = require("web3").default;
const fs = require("fs");
const path = require("path");
const Sentiment = require("sentiment");
const nlp = require("compromise");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

// Load ABI and deployed address
const buildPath = path.resolve(__dirname, "build/SwarmLearning.json");
if (!fs.existsSync(buildPath)) {
  console.error("❌ Contract not deployed yet. Run compile.js first!");
  process.exit(1);
}
const { abi, address } = JSON.parse(fs.readFileSync(buildPath, "utf8"));

// Create contract instance
const contract = new web3.eth.Contract(abi, address);

// Sentiment analyzer
const sentiment = new Sentiment();

// ---------- ROUTES ----------

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Test API: blockchain connection + accounts
app.get("/api/test", async (req, res) => {
  try {
    const accounts = await web3.eth.getAccounts();
    res.json({ message: "Connected to blockchain!", accounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get swarm basic info
app.get("/api/swarm", async (req, res) => {
  try {
    const swarmName = await contract.methods.swarmName().call();
    const leader = await contract.methods.leader().call();
    res.json({ swarmName, leader });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch swarm details", details: err.message });
  }
});

// Join swarm
app.post("/api/join", async (req, res) => {
  try {
    const { account, displayName } = req.body;
    if (!account || !displayName) return res.status(400).json({ error: "Missing account or displayName" });

    const member = await contract.methods.members(account).call();
    if (member.joined) return res.json({ message: "Already a member" });

    await contract.methods.joinSwarm(displayName).send({ from: account });
    res.json({ message: "Joined swarm successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a text entry with NLP extraction
app.post("/api/submit", async (req, res) => {
  try {
    const { account, text } = req.body;
    if (!account || !text) return res.status(400).json({ error: "Missing account or text" });

    // 1️⃣ NLP Feature extraction
    const sentimentResult = sentiment.analyze(text);
    const doc = nlp(text);
    const keywords = doc.nouns().out("array");

    const traitsJson = JSON.stringify({
      sentiment: sentimentResult.score > 0 ? "positive" : sentimentResult.score < 0 ? "negative" : "neutral",
      score: sentimentResult.score,
      keywords,
    });

    // 2️⃣ Hash the text
    const textHash = crypto.createHash("sha256").update(text).digest("hex");

    // 3️⃣ Ensure member joined
    const memberData = await contract.methods.members(account).call();
    if (!memberData.joined) {
      await contract.methods.joinSwarm("Anonymous").send({ from: account });
    }

    // 4️⃣ Submit entry to blockchain
    await contract.methods.submitEntry(textHash, traitsJson).send({ from: account });

    res.json({ message: "Entry submitted!", textHash, traits: traitsJson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all members
app.get("/api/members", async (req, res) => {
  try {
    const addresses = await contract.methods.getAllMembers().call();
    const members = await Promise.all(
      addresses.map(async (addr) => {
        const m = await contract.methods.members(addr).call();
        return { address: addr, displayName: m.displayName };
      })
    );
    res.json({ members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all entries
app.get("/api/entries", async (req, res) => {
  try {
    const count = await contract.methods.getEntryCount().call();
    const entries = [];
    for (let i = 0; i < count; i++) {
      const [member, textHash, traitsJson, timestamp] = await contract.methods.getEntry(i).call();
      entries.push({ member, textHash, traits: JSON.parse(traitsJson), timestamp });
    }
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- START SERVER ----------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
