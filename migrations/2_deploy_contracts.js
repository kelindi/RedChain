const Redchain = artifacts.require("Redchain");

module.exports = function(deployer) {
  deployer.deploy(Redchain)
};