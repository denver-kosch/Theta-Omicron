// The current database to use.
use('thetaomicron');

db.committees.find().forEach(committee => {
    let members = [];
    db.members.find({positions: {$elemMatch: {committeeId: committee._id}}}).forEach(member => {
        members.push(ObjectId(member._id));
    });
    db.committees.updateOne({_id: committee._id}, {$set:{members}});
});