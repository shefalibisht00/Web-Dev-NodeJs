'use strict';
var bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    name: DataTypes.STRING,
    company: DataTypes.STRING,
    dob: DataTypes.DATE,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
    Users.hasMany(models.MusicBands, {
      foreignKey: 'id'
    });
  };
  
Users.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
Users.beforeCreate(user => {
  user.password = bcrypt.hashSync(
    user.password,
     bcrypt.genSaltSync(10),
     null
   );
 });
 return Users;
};

/*
module.exports = (sequelize, DataTypes) => {
  class Project extends sequelize.Model { }
  Project.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, { sequelize });
  return Project;
} 


*/