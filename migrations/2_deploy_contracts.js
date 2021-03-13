const TokenArt = artifacts.require("TokenArt");

module.exports = function(deployer) {
  deployer.deploy(TokenArt);
};
