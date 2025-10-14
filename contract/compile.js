const path = require("path");
const fs = require("fs");
const solc = require("solc");
const Web3 = require("web3").default;

// ✅ Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

// ✅ Path to Solidity file
const contractPath = path.resolve(__dirname, "SwarmLearning.sol");
const source = fs.readFileSync(contractPath, "utf8");

// ✅ Solidity compiler input with EVM compatibility for Ganache
const input = {
  language: "Solidity",
  sources: {
    "SwarmLearning.sol": {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    evmVersion: "london",
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

// ✅ Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Handle compiler errors clearly
if (output.errors) {
  for (const err of output.errors) {
    console.log(
      err.formattedMessage.includes("warning")
        ? "⚠️  " + err.formattedMessage
        : "❌  " + err.formattedMessage
    );
  }
}

// ✅ Extract ABI and Bytecode
const contract = output.contracts["SwarmLearning.sol"]["SwarmLearning"];
const bytecode = contract.evm.bytecode.object;
const abi = contract.abi;

console.log("Bytecode length:", bytecode.length);

// ✅ Async deployment process
(async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];

    console.log("Deploying from account:", deployer);

    const swarmName = "TestSwarm";

    const contractInstance = await new web3.eth.Contract(abi)
      .deploy({ data: "0x" + bytecode, arguments: [swarmName] })
      .send({ from: deployer, gas: 3000000 });

    console.log("\n✅ Contract successfully deployed!");
    console.log("📜 Contract Address:", contractInstance.options.address);

    // ✅ Check a sample function
    const details = await contractInstance.methods.getSwarmDetails().call();
    console.log("\nSwarm Details:");
    console.log("Name:", details[0]);
    console.log("Leader:", details[1]);

    // ✅ Save ABI and address for future use
    const buildPath = path.resolve(__dirname, "../build");
    if (!fs.existsSync(buildPath)) fs.mkdirSync(buildPath);

    fs.writeFileSync(
      path.resolve(buildPath, "SwarmLearning.json"),
      JSON.stringify(
        { abi, address: contractInstance.options.address },
        null,
        2
      )
    );

    console.log("\nABI and address saved to build/SwarmLearning.json ✅");
  } catch (error) {
    console.error("\n❌ Deployment failed!");
    console.error(error);
  }
})();
