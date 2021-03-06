'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

//sequelize 객체 생성
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//db에 model 저장
fs
  .readdirSync(__dirname)   //models에 있는 모델 조사 - 배열
  .filter(file => {         //index.js 파일 제외 - 조건이 true인 파일드로만 이뤄진 새로운 배열
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);  //함수 호출
    db[model.name] = model;   //db에 모델 클래스 저장
  });

//관계 설정과 관련
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {    //모델에서 associate 메소드
    db[modelName].associate(db);
  }
});

//편의성을 위해 추가
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
