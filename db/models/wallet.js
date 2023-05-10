'use strict';
// const db = require('./models');
// db.sequelize.init();

module.exports = (sequelize, DataTypes) => {
  var Wallet = sequelize.define('Wallet', {
    buyingPower: DataTypes.INTEGER,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accountType: DataTypes.STRING
  }, {});
  Wallet.associate = function(models) {
    Wallet.belongsTo(models.User, { foreignKey: "userId" })
  };

  Wallet.all = async function ({ id }) {
    const wallet = await Wallet.findAll({
      where: {
        userId: id,
      }
    });

    return await wallet
  }

  Wallet.make = async function ({userId, amount: buyingPower, accountType}) {

    const found = await Wallet.findOne({
      where: {
        userId,
        accountType
      }
    });

    if (found) {
      const json = await found.update(
        {'buyingPower': found.buyingPower + parseInt(buyingPower) },
        { where: { "id": found.id } }
      );

      return await Wallet.findByPk(found.id)
    } else {
      const wallet = await Wallet.create({
        buyingPower,
        userId,
        accountType
      });
      return await Wallet.findByPk(wallet.id)
    }
  };

  Wallet.updateWallet = async function({userId, accountType, amount}) {
    
    const wallet = await Wallet.findOne({
      where: {
        userId,
        accountType
      }
    });
    
    const json = await wallet.update(
        {'buyingPower': found.buyingPower - parseInt(amount) },
        { where: { "id": wallet.id } }
      );

    return await Wallet.findByPk(wallet.id)
  };

  return Wallet;
};