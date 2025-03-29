// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenVault is Ownable, ReentrancyGuard {
    IERC20 public immutable token;
    address public constant TOKEN_ADDRESS = 0x74C9a420363071ba6B73d9C06B60ABFeA1B9D956; //the address of the deployed token

    event TokensWithdrawn(address indexed receiver, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {
        token = IERC20(TOKEN_ADDRESS);
    }

    // Withdraw specific token balance to any address
    function withdrawTokens(address recipient, uint256 amount) external onlyOwner nonReentrant {
        uint256 balance = token.balanceOf(address(this));
        require(balance >= amount, "Insufficient token balance");
        
        token.transfer(recipient, amount);
        emit TokensWithdrawn(recipient, amount);
    }

    // Check current token balance in vault
    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
