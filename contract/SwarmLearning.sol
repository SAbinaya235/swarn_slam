// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SwarmLearning {
    string public swarmName;
    address public leader;

    event SwarmCreated(string name, address leader);

    constructor(string memory _name) {
        swarmName = _name;
        leader = msg.sender;
        emit SwarmCreated(_name, msg.sender);
    }

    function getSwarmDetails() public view returns (string memory, address) {
        return (swarmName, leader);
    }
}
