const Sequelize = require('sequelize');

module.exports = class Users_bcrypt extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            user_id: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            password: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Users_bcrypt',
            tableName: 'users_bcrypt',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {}
}

