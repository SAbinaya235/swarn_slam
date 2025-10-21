// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title SwarmLearning (extended for Swarm SLAM demo)
/// @notice Allows creating a swarm, joining as a member, and submitting privacy-preserving entries (hash + traits).
contract SwarmLearning {
    struct Member {
        string displayName;
        bool joined;
    }

    struct Entry {
        address member;
        string textHash;    // hashed original text (e.g., SHA256 or IPFS CID)
        string traitsJson;  // small JSON string with extracted features e.g. {"sentiment":"positive","energy":0.8}
        uint256 timestamp;
    }

    string public swarmName;
    address public leader;

    // membership
    mapping(address => Member) public members;
    address[] public memberList;

    // submitted entries
    Entry[] public entries;

    // events
    event SwarmCreated(string name, address indexed leader);
    event MemberJoined(address indexed member, string displayName);
    event EntrySubmitted(address indexed member, string textHash, string traitsJson, uint256 timestamp);

    constructor(string memory _name) {
        swarmName = _name;
        leader = msg.sender;
        emit SwarmCreated(_name, msg.sender);
    }

    /// @notice Join the swarm with a display name
    function joinSwarm(string memory _displayName) public {
        require(!members[msg.sender].joined, "Already joined");
        members[msg.sender] = Member({ displayName: _displayName, joined: true });
        memberList.push(msg.sender);
        emit MemberJoined(msg.sender, _displayName);
    }

    /// @notice Submit a privacy-preserving entry: hashed text + traits JSON
    /// @param _textHash hash of the original text (e.g., SHA256 hex or IPFS CID)
    /// @param _traitsJson JSON string of features (small, e.g. {"sentiment":"pos","score":0.8})
    function submitEntry(string memory _textHash, string memory _traitsJson) public {
        require(members[msg.sender].joined, "Not a member");
        entries.push(Entry({ member: msg.sender, textHash: _textHash, traitsJson: _traitsJson, timestamp: block.timestamp }));
        emit EntrySubmitted(msg.sender, _textHash, _traitsJson, block.timestamp);
    }

    /// @notice Return number of members
    function getMemberCount() public view returns (uint256) {
        return memberList.length;
    }

    /// @notice Return number of entries
    function getEntryCount() public view returns (uint256) {
        return entries.length;
    }

    /// @notice Helper to get entry details by index
    function getEntry(uint256 index) public view returns (address member, string memory textHash, string memory traitsJson, uint256 timestamp) {
        require(index < entries.length, "Index out of bounds");
        Entry storage e = entries[index];
        return (e.member, e.textHash, e.traitsJson, e.timestamp);
    }

    /// @notice Get all current members (addresses)
    function getAllMembers() public view returns (address[] memory) {
        return memberList;
    }
}
