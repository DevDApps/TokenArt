pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract TokenArt is ERC721Full {
  string public name;
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hash;
    string price;
    address payable owner;
  }

  event ImageCreated(
    uint id,
    string hash,
    string price,
    address payable owner
  );

  event ImageBought(
   uint id,
   string hash,
   string price,
   address payable owner
 );



  constructor() ERC721Full("art", "ART") public {
  }

  function uploadImage(string memory _imgHash, string memory _price) public {
    // Make sure the image hash exists
    require(bytes(_imgHash).length > 0);
    // Make sure owner wallet address exists
    require(bytes(_price).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment image id
    imageCount ++;

    // Add Image to the contract
    images[imageCount] = Image(imageCount, _imgHash, _price, msg.sender);
    // Trigger an event
    emit ImageCreated(imageCount, _imgHash, _price, msg.sender);

    uint _id = imageCount;

    //mint the initial nft to the owner who uploads it
    _mint(msg.sender, _id);
  }

  function buyFromOwner(uint _id) public payable {
   // Make sure the id is valid
   require(_id > 0 && _id <= imageCount);
   // Fetch the image
   Image memory _image = images[_id];
   // Fetch the owner and new owner
   address payable _owner= _image.owner;
   address payable _newowner= msg.sender;
   // Pay the owner by sending them Ether
   address(_owner).transfer(msg.value);
   // Transfer the ERC721 ownership
   _transferFrom(_owner, _newowner, _id);

    // Update the owner in struct
   _image.owner = _newowner;
   // Update the image
   images[_id] = _image;
   // Trigger an event
   emit ImageBought(_id, _image.hash, _image.price, _image.owner);
 }

}
