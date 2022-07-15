//SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "hardhat/console.sol";

contract SmartContract is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 0.000003 ether;
  uint256 public maxSupply = 3333;
  uint256 public maxMintAmount = 3;
  bool public paused = false;
  bool public revealed = false;
  string public notRevealedUri;
  address[] public whitelistedAddressesO;
  address[] public whitelistedAddressesL;
  bool public onlyWhiteListed=true;
  uint256 public nftPerAddressLimitFreeO=3;//whitelist
  uint256 public nftPerAddressLimitFreeL=2;
  uint256 public nftPerAddressLimitO=3;
  uint256 public nftPerAddressLimitL=3;
  uint256 public nftPerAddressLimitFreePublic=1;
  uint256 public nftPerAddressLimitPublic=3;
//   mapping(address => bool) public whitelisted;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI,
    string memory _initNotRevealedUri
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
    setNotRevealedURI(_initNotRevealedUri);
    // mint(msg.sender, 20);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  function mint(uint256 _mintAmount) public payable {
    require(!paused);
    uint256 supply = totalSupply();
    require(_mintAmount > 0);
    require(_mintAmount <= maxMintAmount);
    require(supply + _mintAmount <= maxSupply);
    require(balanceOf(msg.sender)+_mintAmount<=maxMintAmount);
   

    if(onlyWhiteListed==true){

        if(isWhiteListedO(msg.sender)){
            require(isWhiteListedO(msg.sender),"user is not whitelisted in O");
            uint256 ownerTokenCount=balanceOf(msg.sender);
            require(ownerTokenCount<nftPerAddressLimitO);
            uint256 freeMintAvailable=nftPerAddressLimitFreeO-ownerTokenCount;
            if(_mintAmount<=freeMintAvailable){

                  for (uint256 i = 1; i <= _mintAmount; i++) {
                    _safeMint(msg.sender, supply + i);
                }
            }
            else{
                for (uint256 i = 1; i <= freeMintAvailable; i++) {
                    _safeMint(msg.sender, supply + i);
                }
                uint256 ownerTokenCountNewBalance=balanceOf(msg.sender);
                uint256 paidMint=nftPerAddressLimitO-ownerTokenCountNewBalance;
                require(msg.value>=paidMint*cost);
                for (uint256 i = 1; i <= paidMint; i++) {
                    _safeMint(msg.sender, supply + i);
                }  
            }
        }
        else if(isWhiteListedL(msg.sender)){
            
            require(isWhiteListedL(msg.sender),"user is not whitelisted in L");
            uint256 ownerTokenCount=balanceOf(msg.sender);
            require(ownerTokenCount<nftPerAddressLimitL,"limit exceed");
            uint256 freeMintAvailable=nftPerAddressLimitFreeL-ownerTokenCount;
            if(_mintAmount<=freeMintAvailable){

                  for (uint256 i = 1; i <= _mintAmount; i++) {
                    _safeMint(msg.sender, supply + i);
                }
            }
            else{
                uint256 paidMintCheck=_mintAmount-freeMintAvailable;
                require(msg.value>=paidMintCheck*cost,"payment");
                 for (uint256 i = 1; i <= _mintAmount; i++) {
                    _safeMint(msg.sender, supply + i);
                }
                // for (uint256 i = 1; i <= freeMintAvailable; i++) {
                //     _safeMint(msg.sender, supply + i);
                // }
                // console.log("minted completely");
                // uint256 ownerTokenCountNewBalance=balanceOf(msg.sender);
                // uint256 paidMint=nftPerAddressLimitL-ownerTokenCountNewBalance;
                // // require(msg.value>=paidMint*cost,"payment");
                // for (uint256 i = 1; i <= paidMint; i++) {
                //     _safeMint(msg.sender, supply + i);
                // }  
                // console.log("minted completely2");
            }
        }
        else{
            require(false,"why u here");
        }
        // else{
        //     uint256 ownerTokenCount=balanceOf(msg.sender);
        //     require(ownerTokenCount<nftPerAddressLimit);
        //     require(msg.value >= cost * _mintAmount);
        // }
       
        
    }
    else{
            // console.log("in public mint");
            uint256 ownerTokenCount=balanceOf(msg.sender);
            require(ownerTokenCount<nftPerAddressLimitPublic,"limit exceed");
            // console.log("after condition");
            // uint256 freeMintAvailable=nftPerAddressLimitFreePublic-ownerTokenCount;
            uint256 freeMintAvailable=nftPerAddressLimitFreePublic>ownerTokenCount?nftPerAddressLimitFreePublic-ownerTokenCount:0;
            //  console.log("freeMintAvailable",freeMintAvailable);
            // console.log("before free mint");
            if(_mintAmount<=freeMintAvailable){
                  //  console.log("in free mint");
                  for (uint256 i = 1; i <= _mintAmount; i++) {
                    _safeMint(msg.sender, supply + i);
                }
            }
            else{
              //  console.log("before paid mint");
                uint256 paidMintCheck=_mintAmount-freeMintAvailable;
                // console.log("paid mint",paidMintCheck);
                require(msg.value>=paidMintCheck*cost,"payment");
                 for (uint256 i = 1; i <= _mintAmount; i++) {
                    _safeMint(msg.sender, supply + i);
                }
                // console.log("after paid mint");
            }
            // console.log("out");
            // for (uint256 i = 1; i <= _mintAmount; i++) {
            //     _safeMint(msg.sender, supply + i);
            // }
    }
   
    

    
  }

    function isWhiteListedO(address _user)public view returns(bool){
        for(uint256 i=0;i<whitelistedAddressesO.length;i++){
            if(whitelistedAddressesO[i]==_user){
                return true;
            }
        }
        return false;
    }
    function isWhiteListedL(address _user)public view returns(bool){
        for(uint256 i=0;i<whitelistedAddressesL.length;i++){
            if(whitelistedAddressesL[i]==_user){
                return true;
            }
        }
        return false;
    }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );
    
    if(revealed == false) {
        return notRevealedUri;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

  //only owner
  function reveal() public onlyOwner {
      revealed = true;
  }
  
  function setCost(uint256 _newCost) public onlyOwner {
    cost = _newCost;
  }
//     function setNftPerAddressLimit(uint256 _limit) public onlyOwner {
//     nftPerAddressLimit = _limit;
//   }
  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
    maxMintAmount = _newmaxMintAmount;
  }
  
  function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    notRevealedUri = _notRevealedURI;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
    function setOnlyWhiteListed(bool _state) public onlyOwner {
    onlyWhiteListed=_state;
  }
 function whitelistUsersO(address[] calldata _user) public onlyOwner {
    delete whitelistedAddressesO;
    whitelistedAddressesO=_user;
  }
   function whitelistUsersl(address[] calldata _user) public onlyOwner {
    delete whitelistedAddressesL;
    whitelistedAddressesL=_user;
  }
 

  function withdraw() public payable onlyOwner {
    // This will pay HashLips 5% of the initial sale.
    // You can remove this if you want, or keep it in to support HashLips and his channel.
    // =============================================================================
    // (bool hs, ) = payable(0x943590A42C27D08e3744202c4Ae5eD55c2dE240D).call{value: address(this).balance * 5 / 100}("");
    // require(hs);
    // =============================================================================
    
    // This will payout the owner 95% of the contract balance.
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
    // =============================================================================
  }
}

// ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]
