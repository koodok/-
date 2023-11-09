const Sequelize = require('sequelize');
const Users_bcrypt = require('./users_bcrypt');

module.exports = class Tourlist extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            tour_id: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            town : {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            latitude : {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            longitude : {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            address : {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            time : {
                type: Sequelize.INTEGER(30),
                allowNull: false,
            },
            price : {
                type: Sequelize.INTEGER(30),
                allowNull: false,
            },
            
        },
        
         {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Tourlist',
            tableName: 'tourlist',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
       
    }
    

    static associate(db) {
        Tourlist.belongsTo(Users_bcrypt, {
            foreignKey: 'user_id', // 외래 키 필드
            targetKey: 'user_id', // 참조할 필드
            as: 'users_bcrypt' // 연결된 모델과의 관계 이름
        });
    }
}