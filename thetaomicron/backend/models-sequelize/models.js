import { DataTypes, Model } from "sequelize";
import sequelize from './sequelize_instance.js';

// Extensions
class Member extends Model {};
class Officer extends Model {};
class Committee extends Model {};
class CommitteeMember extends Model {};
class Role extends Model {};
class MemberRole extends Model {};
class Family extends Model {};
class Event extends Model {};

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
        allowNull: false,
        defaultValue: 'Pledge'
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
        type: DataTypes.STRING,
        allowNull: false,
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
        allowNull: true,
        validate: {
            max: new Date().getFullYear(),
            min: 1900,
        }
    },
    graduationYear:  {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ritualCerts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0, max: 6 }
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "Member",
    tableName: "Members",
    timestamps: false,
});

Officer.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
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
    },
    bio: {
        type: DataTypes.TEXT,
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
        type: DataTypes.STRING,
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
        primaryKey: true,
        references: {
            model: Member,
            key: 'memberId'
        }
    },
    committeeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Committee,
            key: 'committeeId'
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
        type: DataTypes.STRING,
        allowNull: false
    },
    canAssign: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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

Family.init({
    littleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Member,
            key: 'memberId'
        }
    },
    bigId: {
        type: DataTypes.INTEGER,
        references: {
            model: Member,
            key: 'memberId'
        }
    }
}, {
    sequelize,
    modelName: "BigLittle",
    tableName: "Families",
    timestamps: false
});

Event.init({
    eventId: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ""
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    facilitatingCommittee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Committee,
            key: 'committeeId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    visibility: {
        type: DataTypes.ENUM('Public','Members','Initiates','EC','Committee'),
        allowNull: false,
        defaultValue: 'Public',
    }
}, {
    sequelize,
    modelName: "Events",
    tableName: "Events",
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

//BigLittle Relationship
Member.belongsTo(Member, {as: "Big", foreignKey: "bigId"});
Member.hasMany(Member, {as: "Little", foreignKey: "littleId"});

//Event-Committee Relationship
Event.belongsTo(Committee, {foreignKey: 'facilitatingCommittee'});

export { Member, Officer, Committee, CommitteeMember, Role, MemberRole, Family, Event };