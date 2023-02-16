module.exports = {
    Unknown :{
        status:500,
        code: 4000,
        message: "something wrong"
    },
    EmailExist:{
        status:500,
        code: 1000,
        message: "Email has been used"
    },
    PasswordTooShort:{
        status:500,
        code: 1001,
        message: "Password Too Short"
    },
    TwoPasswordNotMatch:{
        status:500,
        code: 1002,
        message: "Two Passwords Not Match"
    },
    UserNotFound:{
        status:500,
        code: 1003,
        message: "User Not Found"
    },
    PasswordIncorrect:{
        status:500,
        code: 1004,
        message: "Password Incorrect"
    }
}