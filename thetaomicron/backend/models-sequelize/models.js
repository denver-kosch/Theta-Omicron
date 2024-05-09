import { DataTypes, Model } from "sequelize";
import sequelize from './sequelize_instance.js';


// Extensions
class Member extends Model {};
class Officer extends Model {};
class Committee extends Model {};
class CommitteeMember extends Model {};
class Role extends Model {};
class MemberRole extends Model {};

//Initializations
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

Officer.init({
    title: {
        type: DataTypes.STRING(255)
    },
    officeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    memberId: {
        type: DataTypes.INTEGER,
        references: {
            model: Member,
            key: "memberId"
        },
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Officer",
    tableName: "Officers",
    timestamps: false
});

Committee.init({
    committeeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    //supervising officer Id
    soId: {
        type: DataTypes.INTEGER,
        references: {
            model: Officer,
            key: "officeId"
        },
        allowNull: false
    }
},{
    sequelize,
    modelName: "Committee",
    tableName: "Committees",
    timestamps: false
});

CommitteeMember.init({
    memberId: {
        type: DataTypes.INTEGER,
        references: {
            model: Member,
            key: "memberId"
        },
    },
    committeeId: {
        type: DataTypes.INTEGER,
        references: {
            model: Committee,
            key: "committeeId"
        }
    },
    isChairman: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    sequelize,
    modelName: "CommitteeMember",
    tableName: "CommitteeMembers",
    timestamps: false
});

Role.init({
    roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    canAssign: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: "Role",
    tableName: "Roles",
    timestamps: false
});

MemberRole.init({
    memberId: {
        type: DataTypes.INTEGER,
        references: {
            model: Member,
            key: 'memberId'
        }
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'roleId'
        }
    },
    dateAdded: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    sequelize,
    modelName: "MemberRole",
    tableName: "MembersRoles",
    timestamps: false
});



/* Establish Relationships */

//Officer relationships
Member.hasOne(Officer, {foreignKey: 'memberId'});
Officer.belongsTo(Member, {foreignKey: 'memberId'});

//Committee Relationships
Member.belongsToMany(Committee, {
    through: CommitteeMember,
    foreignKey: 'memberId',
    otherKey: 'committeeId',
});
Committee.belongsToMany(Member, {
through: CommitteeMember,
foreignKey: 'committeeId',
otherKey: 'memberId',
});

//Officer-Committee Relationship
Officer.hasMany(Committee, { foreignKey: 'soId', as: 'supervisedCommittees' });
Committee.belongsTo(Officer, { foreignKey: 'soId', as: 'supervisingOfficer' });

//Member-Role Relationships
Member.belongsToMany(Role, { through: MemberRole });
Role.belongsToMany(Member, { through: MemberRole });

export { Member, Officer, Committee, CommitteeMember, Role, MemberRole };