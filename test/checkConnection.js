// checkConnection.js
const Web3 = require("web3").default;

// Use Ganache's local blockchain RPC endpoint
const web3 = new Web3("http://127.0.0.1:7545");

async function main() {
  try {
    // Fetch list of accounts
    const accounts = await web3.eth.getAccounts();
    console.log("✅ Connected to Ganache successfully!");
    console.log("Available Accounts:", accounts);

    // Fetch latest block number
    const blockNumber = await web3.eth.getBlockNumber();
    console.log("Current Block Number:", blockNumber);

    // Fetch network ID
    const networkId = await web3.eth.net.getId();
    console.log("Network ID:", networkId);
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
}

main();
