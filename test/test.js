const EdCert = artifacts.require('./EdCert.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('EdCert', ([deployer, author, tipper]) => {
  let edCert

  before(async () => {
    edCert = await EdCert.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await edCert.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await edCert.name()
      assert.equal(name, 'EdCert')
    })
  })

  describe('images', async () => {
    let result, imageCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      result = await edCert.uploadImage(hash, '0x64CE0053CD7B38B120fAB0b35EF87B0Ec527579d', { from: author })
      imageCount = await edCert.imageCount()
    })

    //check event
    it('creates images', async () => {
      // SUCESS
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.student, '0x64CE0053CD7B38B120fAB0b35EF87B0Ec527579d', 'student wallet address is correct')
      assert.equal(event.author, author, 'author is correct')


      // FAILURE: Image must have hash
      await edCert.uploadImage('', '0x64CE0053CD7B38B120fAB0b35EF87B0Ec527579d', { from: author }).should.be.rejected;

      // FAILURE: Image must have description
      await edCert.uploadImage('Image hash', '', { from: author }).should.be.rejected;
    })

    //check from Struct
    it('lists images', async () => {
      const image = await edCert.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(image.hash, hash, 'Hash is correct')
      assert.equal(image.student, 'student wallet address', 'description is correct')
      assert.equal(image.author, author, 'author is correct')
    })

  })
})
