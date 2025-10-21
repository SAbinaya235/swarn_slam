// contract/compile.js
const path = require("path");
const fs = require("fs");
const solc = require("solc");
const Web3 = require("web3").default;

// Ganache RPC
const web3 = new Web3("http://127.0.0.1:7545");

// Read contract
const contractPath = path.resolve(__dirname, "SwarmLearning.sol");
const source = fs.readFileSync(contractPath, "utf8");

// Compiler input
const input = {
  language: "Solidity",
  sources: {
    "SwarmLearning.sol": { content: source },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    evmVersion: "london",
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

// print compile warnings/errors
if (output.errors) {
  output.errors.forEach((err) => {
    const severity = err.severity || "";
    if (severity === "warning") {
      console.warn("⚠️  " + err.formattedMessage);
    } else {
      console.error("❌  " + err.formattedMessage);
    }
  });
}

// Extract contract
const contractName = "SwarmLearning";
const contractData = output.contracts["SwarmLearning.sol"][contractName];
if (!contractData) {
  console.error("Contract not found in compilation output.");
  process.exit(1);
}
const abi = contractData.abi;
const bytecode = contractData.evm.bytecode.object;

(async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];
    console.log("Deploying from account:", deployer);
    console.log("Bytecode length:", bytecode.length);

    const contractInstance = await new web3.eth.Contract(abi)
      .deploy({ data: "0x" + bytecode, arguments: ["TestSwarm"] })
      .send({ from: deployer, gas: 3000000, gasPrice: await web3.eth.getGasPrice() });

    console.log("\n✅ Contract deployed at:", contractInstance.options.address);

    // Save ABI + address
    const buildPath = path.resolve(__dirname, "../build");
    if (!fs.existsSync(buildPath)) fs.mkdirSync(buildPath);

    fs.writeFileSync(
      path.resolve(buildPath, "SwarmLearning.json"),
      JSON.stringify({ abi, address: contractInstance.options.address }, null, 2)
    );
    console.log("ABI and address saved to build/SwarmLearning.json ✅");
  } catch (err) {
    console.error("\n❌ Deployment failed:", err);
  }
})();
