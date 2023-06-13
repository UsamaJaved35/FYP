// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HashStorage {
    struct HashEntry {
        string hash;
        bool exists;
    }
    mapping(string => HashEntry) private hashMap;

    function saveHash(string memory id, string memory hash) public {
        require(!hashMap[id].exists, "ID already exists");
        hashMap[id] = HashEntry(hash, true);
    }

    function getHash(string memory id) public view returns (string memory) {
        require(hashMap[id].exists==true , "ID does not exist");
        return hashMap[id].hash;
    }
   function compareHash(string memory id, string memory hash) public view returns (bool) {
    return (keccak256(bytes(hash)) == keccak256(bytes(hashMap[id].hash)));
    }
    function IdExists(string memory id) public view returns (bool) {
        return hashMap[id].exists;
    }
}