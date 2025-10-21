# Swarm Slam – Blockchain-based Swarm Learning Demo

## 🚀 Overview

**Swarm Learning (SL)** builds on **Federated Learning (FL)** by removing the central aggregator. It uses a **permissioned blockchain** to:

- Onboard members securely  
- Elect leaders dynamically  
- Coordinate learning in a **decentralized** and **trustless** way  

**Swarm Slam** showcases this via a classroom-friendly demo:  
Users submit short texts (opinions/reviews), which are locally processed to extract traits (e.g., sentiment). A hashed version of the text and traits is stored on-chain. Traits are aggregated off-chain and visualized in a dashboard.

---

## 📁 Project Structure

```
swarm-slam/
├── contract/           # Smart contract + deploy script
├── server.js           # Backend (Express + Blockchain + NLP)
├── public/             # Frontend (HTML/CSS/JS)
├── build/              # Compiled contract ABI + address
└── package.json
```

---

## ⚙️ Prerequisites

- Node.js ≥ 20.x  
- npm
- Download [Ganache](https://archive.trufflesuite.com/ganache/)
- Open Ganache and it runs at `http://127.0.0.1:7545`

---

## 🛠️ Setup

```bash
git clone <repo-url>
cd swarm-slam
npm install
cd contract && node compile.js
cd .. && node server.js
```

Visit [http://localhost:5000](http://localhost:5000)

---

## 🔌 API Endpoints

- `/api/test` – Check blockchain connection  
- `/api/swarm` – Get swarm name + leader  
- `/api/submit` – Submit entry with traits

Example:
```json
{
  "displayName": "Alice",
  "text": "I think the swarm owner is very collaborative!"
}
```

---

## 🧠 Notes

- Ensure Ganache is running before deploying or starting the server  
- NLP trait extraction happens in the backend  
- Ganache deployments are temporary—redeploy if restarted

---

## 👩‍💻 Contribution Guide

- Frontend: `public/`  
- Backend: `server.js`  
- Smart Contract: `contract/SwarmLearning.sol` + `compile.js`

---

## 📚 References

- [Swarm Learning – HPE](https://www.hpe.com/us/en/solutions/swarm-learning.html)  
- [Web3.js Docs](https://web3js.readthedocs.io/)  
- [TensorFlow.js](https://www.tensorflow.org/js)  
- [Ganache](https://www.trufflesuite.com/ganache)


Let me know if you'd like a version tailored for GitHub Pages or a project website!
