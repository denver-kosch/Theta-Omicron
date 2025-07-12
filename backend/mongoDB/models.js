import { Schema, model } from "mongoose";

const contactInfoSchema = new Schema({
    _id: false,
    phoneNum: {
        type: String,
        required: true,
        validate: {
            validator: v => /\d{3}-\d{3}-\d{4}/.test(v),
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: v => /\S+@\S+\.\S+/.test(v),
            message: props => `${props.value} is not a valid email!`
        }
    },
    schoolEmail: {
        type: String,
        required: true,
        validate: {
            validator: v => /\S+@muskingum\.edu/.test(v),
            message: props => `${props.value} is not a valid email!`
        }
    }
});
const addressSchema = new Schema({
    _id: false,
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        validate: {
            validator: v => v.length === 2, // Assuming US state codes
            message: props => `${props.value} is not a valid state code!`
        }
    },
    zip: {
        type: String,
        required: true,
        validate: {
            validator: v => /\d{5}/.test(v), // Assuming US ZIP code format
            message: props => `${props.value} is not a valid ZIP code!`
        }
    },
    country: {
        type: String,
        default: 'USA'
    }
});
const positionSchema = new Schema({
    _id: false,
    committeeId: {
        type: Schema.Types.ObjectId,
        ref: 'committee',
        required: true
    },
    committeeName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: ""
    },
    ecOrder: {
        type: Number,
        validate: {
            validator: v => v >= 0 && v <= 5,
            message: props => `${props.value} is not a valid EC order.`
        }
    },
    bio: {
        type: String,
        default: ""
    }
});
const memberSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Pledge', 'Initiate', 'Alumnus'],
        default: 'Pledge'
    },
    contactInfo: {
        type: contactInfoSchema,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: addressSchema,
        required: true,
    },
    initiationYear: {
        type: Number,
        required: true,
        validate: {
            validator: v => v >= 1960 && v <= new Date().getFullYear(),
            message: props => `${props.value} is not a valid initiation year.`
        }
    },
    graduationYear: {
        type: Number,
        required: true,
        validate: {
            validator: v => v >= 1960 && v <= (new Date().getFullYear())+5,
            message: props => `${props.value} is not a valid graduation year.`
        }
    },
    ritualCerts: {
        type: Number,
        required: true,
        validate: {
            validator: v => v >= 0 && v <= 6,
            message: props => `${props.value} is not a valid number of ritual certifications.`
        }
    },
    privileges: {
        type: String,
        required: true,
        enum: ['SuperAdmin', 'Admin', 'User'],
        default: 'User'
    },
    positions: [positionSchema],
    notepad: {
        type: String,
        default: ""
    },
    unexcusedCount: {
        type: Number,
        default: 0
    },
}, {versionKey: false});
export const Member = model('Member', memberSchema);

const timeSchema = new Schema({
    _id: false,
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    }
}, {versionKey: false});

const eventComSchema = new Schema({
    _id: false,
    id: {
        type: Schema.Types.ObjectId,
        ref: 'committee',
        required: true,
    },
    name: {
        type: String,
        required: true
    }
});
const eventLocSchema = new Schema({
    _id: false,
    id: {
        type: Schema.Types.ObjectId,
        ref: 'location',
        required: true,
    },
    name: {
        type: String,
        required: true
    }
});
const eventRejSchema = new Schema({
    _id: false,
    date: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
});
const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    time: {
        type: timeSchema,
        required: true,
    },
    location: {
        type: eventLocSchema,
        required: true,
    },
    committee: {
        type: eventComSchema,
        required: true,
    },
    visibility: {
        type: String,
        required: true,
        enum: ['Public', 'Members', 'Initiates', 'committee'],
        default: 'Public'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    mandatory: {
        type: Boolean,
        default: false
    },
    rejectionDetails: {
        type: eventRejSchema,
        required: false
    }
}, {versionKey: false});
export const Event = model('Event', eventSchema);

const locationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        validate: {
            validator: v => v.length === 2, // Assuming US state codes
            message: props => `${props.value} is not a valid state code!`
        }
    },
    zip: {
        type: String,
        required: true,
        validate: {
            validator: v => /\d{5}/.test(v), // Assuming US ZIP code format
            message: props => `${props.value} is not a valid ZIP code!`
        }
    }
}, {versionKey: false});
export const Location = model('location', locationSchema);

const commSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: false
    },
    supervisingOfficer: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    members: {
        type: [Schema.Types.ObjectId],
        ref: 'Member',
    }
}, {versionKey: false});
export const Committee = model('committee', commSchema);

const messageSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: { 
        type: Date, 
        default: new Date()
    },
});
export const Message = model('message', messageSchema);

const minutesSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
        unique: true
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    }
}, {versionKey: false});
export const Minutes = model('minutes', minutesSchema); 