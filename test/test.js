const TokenArt = artifacts.require('./TokenArt.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TokenArt', ([deployer, owner, buyer]) => {
  let tokenArt

  before(async () => {
    tokenArt = await TokenArt.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await tokenArt.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('images', async () => {
    let result, imageCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      result = await tokenArt.uploadImage(hash, '0x64CE0053CD7B38B120fAB0b35EF87B0Ec527579d', { from: owner })
      imageCount = await tokenArt.imageCount()
    })

    //check event
    it('creates images', async () => {
      // SUCESS
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.owner, owner, 'owner is correct')


      // FAILURE: Image must have hash
      await tokenArt.uploadImage('', '0x64CE0053CD7B38B120fAB0b35EF87B0Ec527579d', { from: owner }).should.be.rejected;

      // FAILURE: Image must have description
      await tokenArt.uploadImage('Image hash', '', { from: owner }).should.be.rejected;
    })

    //check from Struct
    it('lists images', async () => {
      const image = await tokenArt.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(image.hash, hash, 'Hash is correct')
      assert.equal(image.owner, owner, 'owner is correct')
    })

    it('allows users to buy images', async () => {
      // Track the owner balance before purchase
      let oldOwnerBalance
      oldOwnerBalance = await web3.eth.getBalance(owner)
      oldOwnerBalance = new web3.utils.BN(oldOwnerBalance)

      result = await tokenArt.buyFromOwner(imageCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') })

      // SUCCESS
      const event = result.logs[0].args

      // Check that owner received funds
      let newOwnerBalance
      newOwnerBalance = await web3.eth.getBalance(owner)
      newOwnerBalance = new web3.utils.BN(newOwnerBalance)

      let buyImageOwner
      buyImageOwner = web3.utils.toWei('1', 'Ether')
      buyImageOwner = new web3.utils.BN(buyImageOwner)

      const expectedBalance = oldOwnerBalance.add(buyImageOwner)

      assert.equal(newOwnerBalance.toString(), expectedBalance.toString())

      // FAILURE: Tries to buy an image that does not exist
      await tokenArt.buyFromOwner(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    })

  })
})
