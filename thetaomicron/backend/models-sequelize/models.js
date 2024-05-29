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
class Location extends Model {};
class EventType extends Model {};

//Initializations
Member.init({
    memberId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
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
        validate: {
          isEmail: true // checks for email format
        }
    },
    schoolEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: "Officer",
    tableName: "Officers",
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
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
},{
    sequelize,
    modelName: "Committee",
    tableName: "Committees",
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
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
},{
    sequelize,
    modelName: "CommitteeMember",
    tableName: "CommitteeMembers",
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
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: "Role",
    tableName: "Roles",
});

MemberRole.init({
    memberId: {
        type: DataTypes.INTEGER,
        references: {
            model: Member,
            key: 'memberId'
        },
        primaryKey: true
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'roleId'
        },
        primaryKey: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: "MemberRole",
    tableName: "MemberRoles"
});

Family.init({
    littleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Member,
            key: 'memberId'
        }
    },
    bigId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Member,
            key: 'memberId'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: "BigLittle",
    tableName: "Families"
});

Location.init({
    locationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Location",
    tableName: "Locations",
    timestamps: true
});

EventType.init({
    typeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    committee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Committee,
            key: "committeeId"
        },
        onUpdate: "CASCADE"
    }
}, {
    sequelize,
    modelName: "EventType",
    tableName: "EventTypes"
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
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EventType,
            key: "typeId"
        }
    },
    visibility: {
        type: DataTypes.ENUM('Public','Members','Initiates','EC','Committee'),
        allowNull: false,
        defaultValue: 'Public',
    },
    status: {
        type: DataTypes.ENUM("Pending", "Approved", "Denied"),
        allowNull: false,
        defaultValue: "Pending"
    },
    mandatory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    location: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Location,
            key: 'locationId'
        },
    },
    lastUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Member,
            key: 'memberId'
        },
        onDelete: 'SET NULL',
    },
}, {
    sequelize,
    modelName: "Event",
    tableName: "Events",
    timestamps: true,
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
Member.hasMany(Family, { as: 'Littles', foreignKey: 'bigId' });
Member.hasOne(Family, { as: 'Big', foreignKey: 'littleId' });

//Event-Committee Relationship
Event.belongsTo(EventType, {foreignKey: 'type'});
EventType.hasMany(Event, {foreignKey: 'type'});
EventType.belongsTo(Committee, { foreignKey: 'committee' });
Committee.hasMany(EventType, { foreignKey: 'committee' });

// Event-Location Relationship
Event.belongsTo(Location, { foreignKey: 'location'});
Location.hasMany(Event, { foreignKey: 'location', as: 'events' });

export { Member, Officer, Committee, CommitteeMember, Role, MemberRole, Family, Event, Location, EventType};