import { DataTypes, Model } from "sequelize";
import sequelize from './sequelize_instance.js';

class Member extends Model {};

Member.init(
{
    memberId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true // checks for email format
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Member",
    tableName: "Members",
    timestamps: false,
    paranoid: true //Allows for soft deletes
});

export default Member;