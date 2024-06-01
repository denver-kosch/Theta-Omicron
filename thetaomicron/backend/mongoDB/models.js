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
        required: true
    }
});
const positionSchema = new Schema({
    _id: false,
    committeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Committee',
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
    contactInfo: contactInfoSchema,
    password: {
        type: String,
        required: true,
    },
    address: addressSchema,
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
    positions: [positionSchema]
});
export const Member = model('Member', memberSchema);


const timeSchema = new Schema({
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
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
    locationId: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    committeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Committee',
        required: true,
    },
    visibility: {
        type: String,
        required: true,
        enum: ['Public', 'Members', 'Initiates', 'Committee'],
        default: 'Public'
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    mandatory: {
        type: Boolean,
        required: true,
        default: false
    }
});
export const Event = model('Event', eventSchema);


const locationScheme = new Schema({
    name: {
        type: String,
        required: true,
    },
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
    }
});
export const Location = model('Location', locationScheme);


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
});
export const Committee = model('Committee', commSchema);




