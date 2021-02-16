pragma solidity ^0.5.0;

contract Redchain {
  string public name = "RedChain";
  //Store Images
  uint public postCount = 0;
  mapping(uint => Post) public posts;

  struct Post {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }
  event PostCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event PostTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  //Create Post
  function uploadPost(string memory _imgHash, string memory _description) public {
    //Make sure uploader address exists
    require(msg.sender != address(0x0));
    //Make sure description exists

    require(bytes(_description).length > 0);
    //Increase Post count
    postCount ++;

    //Add Post to Contract
    posts[postCount] = Post(postCount, _imgHash, _description, 0, msg.sender);

    //Trigger an event
    emit PostCreated(postCount, _imgHash, _description, 0, msg.sender);
  }


  //Tip Posts

  function tipPostOwner(uint _id) public payable {
    //Make sure the id is valid
    require((_id > 0 && _id <= postCount));

    Post memory _post = posts[_id];
    //Fetch the author
    address payable _author = _post.author;
    //Pay the author by sending them Ether
    address(_author).transfer(msg.value);
    //Increment the tip amount
    _post.tipAmount = _post.tipAmount + msg.value;
    //Update the post 
    posts[_id] = _post;

    //Trigger an event
    emit PostTipped(_id, _post.hash, _post.description, _post.tipAmount, _author);
  }
}

