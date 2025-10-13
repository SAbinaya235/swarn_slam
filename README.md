## Swarm Slam – Blockchain-based Swarm Learning Demo

### Overview

**Swarm Learning (SL)** is an advanced extension of **Federated Learning (FL)**.
While *Federated Learning* allows multiple clients to collaboratively train a shared deep learning model by exchanging only gradients (and not raw data), it still depends on a **central custodian** to coordinate and aggregate updates.

**Swarm Learning** removes this central dependency by introducing a **permissioned blockchain** network to:

* Securely onboard participating members
* Dynamically elect a leader among peers
* Coordinate the learning process in a fully **decentralized** and **trustless** manner

### Implementation Summary

#### Environment Setup

* **Operating System:** Windows
* **Tools Installed:**

  * **Node.js & npm** – for backend and dependency management
  * **Ganache** – local Ethereum blockchain (for testing smart contracts)
  * **Visual Studio Code** – development environment

#### 2Dependencies Installed

```bash
npm init -y
npm install express cors body-parser @tensorflow/tfjs web3 crypto-js chart.js wordcloud framer-motion tailwindcss
```

#### Blockchain Setup

* Installed **Ganache** → [Download Link](https://archive.trufflesuite.com/ganache/)
* Chose **Quickstart** option
* Copied the **RPC URL** (e.g., `http://127.0.0.1:7545`) for connection testing

#### Project Initialization

* Created a **test folder** in VS Code to verify Ganache and Web3 connectivity
* Verified connection with:

  * Connected accounts printed
  * Block number and network ID confirmed
* Created the actual project structure with:

  * `backend/` – Express.js server and blockchain logic
  * `frontend/` – UI (HTML, TailwindCSS, and Chart.js visualizations)

#### Repository

Project hosted on GitHub:
🔗 [Swarm Slam Repository](https://github.com/SAbinaya235/swarn_slam.git)

---

### Next Steps

* Add **smart contracts** for Swarm creation and participation
* Implement **TensorFlow.js** based analysis (sentiment / response trends)
* Develop the **frontend interface** for creating & joining Swarms
* Integrate blockchain event logging and visualization

---

### References

* *Swarm Learning Whitepaper – Hewlett Packard Enterprise (HPE)*
* *Ethereum & Web3.js Documentation*
* *TensorFlow.js API Reference*
* *Ganache – Local Ethereum Blockchain for Development*


