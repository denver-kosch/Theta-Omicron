import { DataTypes, Model } from "sequelize";
import sequelize from './sequelize_instance.js';

class Member extends Model {};

Member.init({
    memberId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastName:  {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pledge', 'Initiate', 'Alumnus'),
        allowNull: false
    },
    phoneNum: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true // checks for email format
        }
    },
    schoolEmail: {
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
    },
    streetAddress: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    zipCode: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    country: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    initiationYear:  {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    graduationYear:  {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ritualCerts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 6,
        }
    }
}, {
    sequelize,
    modelName: "Member",
    tableName: "Members",
    timestamps: false,
    paranoid: true //Allows for soft deletes
});

class Chair extends Model {};

Chair.init({
    title: {
        type: DataTypes.STRING(255)
    },
    chairId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
}, {
    sequelize,
    modelName: "Chair",
    tableName: "Chairs",
    timestamps: false
});

class Chairman extends Model {};

Chairman.init({
    memberId: {
        type: DataTypes.INTEGER,
        references: {
            model: Member,
            key: 'memberId'
        },
        primaryKey: true,
        allowNull: false
    },
    chairId: {
        type: DataTypes.INTEGER,
        references: {
            model: Chair,
            key: 'chairId'
        },
        primaryKey: true,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Chairman",
    tableName: "Chairmen",
    timestamps: false,
});

Member.belongsToMany(Chair, { through: Chairman, foreignKey: 'memberId', otherKey: 'chairId' });
Chair.belongsToMany(Member, { through: Chairman, foreignKey: 'chairId', otherKey: 'memberId' });

export {Member, Chairman, Chair};