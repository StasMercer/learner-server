module.exports.validateRegisterInput = (
    firstName,
    lastName,
    role,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (firstName.trim() === "") {
        errors.firstName = "Enter your name";
    }
    if (lastName.trim() === "") {
        errors.lastName = "Enter your surname";
    }

    if (email.trim() === "") {
        errors.email = "Enter email";
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = "Email is not valid";
        }
    }

    if (password === "") {
        errors.password = "Enter the password";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords are not match";
    }

    return {
        errors,
        valid: Object.keys(errors) < 1,
    };
};

module.exports.validateLoginInput = (email, password) => {
    const errors = {};
    if (email.trim() === "") {
        errors.email = "Ener email";
    }

    if (password === "") {
        errors.password = "Enter password";
    }

    return {
        errors,
        valid: Object.keys(errors) < 1,
    };
};

module.exports.validateChapterContent = (user, text, type) => {
    const errors = {};
    if (user.role !== "admin" && user.role !== "teacher") {
        errors.role = "Not allowed";
    }

    if (text.trim() === "") {
        errors.text = "Enter text";
    }

    if (type !== "test" && type !== "lecture" && type !== "control") {
        errors.type = "Choose type";
    }


    const valid = Object.keys(errors) < 1;

    return {
        errors,
        valid,
    };
};

module.exports.validateCourse = (courseName, description) =>{
    const errors = {};
    if(courseName.trim() === '') errors.courseName = 'Enter course name';

    if(courseName.length > 100){
        errors.courseName = 'Course name cannot be larger than 100 symbols.'
    }
    if(description.trim() === '') errors.description = 'Enter description';

    if(description.length > 300){
        errors.description = 'Description cannot be larger than 300 symbols.'
    }

    return {
        errors,
        valid: Object.keys(errors) < 1,
    };
};

module.exports.validateTestInput = (test) => {
    const errors = {};
    if (test.question.trim() === "") {
        errors.question = "Enter question";
    }

    if (!test.variants.length) {
        errors.variants = "No variants added.";
    }

    if (!test.answer.length) {
        errors.answer = "Choose answer";
    }
    //console.log(errors);
    
    return {
        errors,
        valid: Object.keys(errors) < 1,
    };
};
