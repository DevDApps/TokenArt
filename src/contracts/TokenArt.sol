pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract TokenArt is ERC721Full {
  string public name;
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hash;
    string student;
    address payable author;
  }

  event ImageCreated(
    uint id,
    string hash,
    string student,
    address payable author
  );


  constructor() ERC721Full("art", "ART") public {
  }

  function uploadImage(string memory _imgHash, string memory _student) public {
    // Make sure the image hash exists
    require(bytes(_imgHash).length > 0);
    // Make sure student wallet address exists
    require(bytes(_student).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment image id
    imageCount ++;

    // Add Image to the contract
    images[imageCount] = Image(imageCount, _imgHash, _student, msg.sender);
    // Trigger an event
    emit ImageCreated(imageCount, _imgHash, _student, msg.sender);

    uint _id = imageCount;

    //mint the initial nft to the owner who uploads it
    _mint(msg.sender, _id);
  }


}
