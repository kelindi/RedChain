const { assert } = require('chai')

const Redchain = artifacts.require('./Redchain.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Redchain', ([deployer, author, tipper]) => {
  let redchain

  before(async () => {
    redchain = await Redchain.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await redchain.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await redchain.name()
      assert.equal(name, 'RedChain')
    })
  })
  describe('posts',async () => {
    let result,postCount
    const hash = 'abc123'

    before(async() => {
      result = await redchain.uploadPost(hash, 'Post Description',{from: author})
      postCount = await redchain.postCount()
    })

    it('creates posts', async () => {
      //SUCCESS
      assert.equal(postCount,1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(),'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Post Description','description is correct')
      assert.equal(event.tipAmount, '0','tip amount is correct')
      assert.equal(event.author, author, 'author is correct')
      
      //FAILURE: Post must have description
      await redchain.uploadPost('Image hash','',{from: author}).should.be.rejected;

    })
    //check from Struct
    it('lists posts', async() =>{
      const post = await redchain.posts(postCount)
      assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(post.hash, hash, 'Hash is correct')
      assert.equal(post.description, 'Post Description',"Post is correct")
      assert.equal(post.tipAmount,'0','tip amount is correct')
      assert.equal(post.author,author, 'author is correct')
    })



  })
})
