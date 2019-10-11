'use strict';
module.exports = (sequelize, DataTypes) => {
  const MusicBands = sequelize.define('MusicBands', {
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    userId: DataTypes.STRING
  }, {});
  MusicBands.associate = function(models) {
    // associations can be defined here
    MusicBands.belongsTo(models.Users, 
      {foreignKey: 'userId'}
      );
    
  };
  return MusicBands;
};