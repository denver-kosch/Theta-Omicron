/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('thetaomicron');

db.getCollection('committees').find().forEach(committee => {
    let members = [];
    db.getCollection('members').find({positions: {$elemMatch: {committeeId: committee._id}}}).forEach(member => {
        members.push(ObjectId(member._id));
    });
    db.getCollection('committees').updateOne({_id: committee._id}, {$set:{members}});
});