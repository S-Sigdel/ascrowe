// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenVault is Ownable, ReentrancyGuard {
    // Token Configuration
    IERC20 public immutable token;
    address public constant TOKEN_ADDRESS = 0x74C9a420363071ba6B73d9C06B60ABFeA1B9D956;
    
    // NFT Configuration
    IERC165 public immutable nftContract;
    address public constant NFT_ADDRESS = 0xC338B5b660e8a656fa92e362AcAC49f785cF39F5;

    // Events
    event TokensDeposited(address indexed depositor, uint256 amount);
    event TokensWithdrawn(address indexed receiver, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {
        token = IERC20(TOKEN_ADDRESS);
        nftContract = IERC165(NFT_ADDRESS);
    }

    // ========================
    // Core Vault Functionality
    // ========================

    /// @notice Deposit tokens into the vault (NFT holders only)
    function depositTokens(uint256 amount) external nonReentrant {
        require(hasNFT(msg.sender), "Caller must hold the required NFT");
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        emit TokensDeposited(msg.sender, amount);
    }

    /// @notice Withdraw tokens from the vault (Owner only)
    function withdrawTokens(address recipient, uint256 amount) external onlyOwner nonReentrant {
        uint256 balance = token.balanceOf(address(this));
        require(balance >= amount, "Insufficient vault balance");
        token.transfer(recipient, amount);
        emit TokensWithdrawn(recipient, amount);
    }

    // ========================
    // NFT Verification Logic
    // ========================

    /// @notice Check if an address holds the required NFT
    function hasNFT(address user) public view returns (bool) {
        // First verify the contract supports ERC721
        if (!nftContract.supportsInterface(type(IERC721).interfaceId)) {
            revert("NFT contract is not ERC721 compliant");
        }

        // Then check balance safely
        try IERC721(address(nftContract)).balanceOf(user) returns (uint256 balance) {
            return balance > 0;
        } catch {
            revert("NFT ownership check failed");
        }
    }

    // ========================
    // Utility Functions
    // ========================

    /// @notice Get current token balance in vault
    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /// @notice Emergency function to recover accidentally sent ERC721 tokens
    function recoverERC721(address nftAddress, uint256 tokenId) external onlyOwner {
        IERC721(nftAddress).transferFrom(address(this), owner(), tokenId);
    }
}
