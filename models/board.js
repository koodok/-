const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            subject: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            author: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            content: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            watch: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: "Board",
            tableName: "boards",
            paranoid: true,
            charset: "utf8",
            collate: "utf8_general_ci",
        });
    }

    static associate(db) {}
};