const enumTransation ={
    ON_PROGRESS:0,
    SUCCESS:1,
    FAIL:2,
    CONFLICT:3
}
const enumStatusAppointment = {
    OnProgress:0,
    OnWaitAdminAccepted:1,
    Fail:2,
    Success:3,
    OnConFlict:4
}
const enumhistoryOrOnProgress ={
    ON_PROGRESS:1,
    HISTORY:2
}
const enumStatus = {
    Available:0,
    UnAvailable:1,
}
const Approve_Upgrade_Profile = {
    NORMAL:1,
    ON_PROGRESS:2,
    ACTIVE:3,
    DECLINE:5
}
const TransactionType ={
    Upgrade_Profile:1,
    TopUp_Money:2,
    Trade:3,
    Booking_Appointment:4
}
module.exports.Approve_Upgrade_Profile = Approve_Upgrade_Profile;
module.exports.enumStatus = enumStatus;
module.exports.enumhistoryOrOnProgress = enumhistoryOrOnProgress;
module.exports.enumStatusAppointment = enumStatusAppointment;
module.exports.enumTransation = enumTransation;
module.exports.TransactionType = TransactionType;