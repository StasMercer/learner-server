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
        errors.firstName = "Введіть ім'я";
    }
    if (lastName.trim() === "") {
        errors.lastName = "Введіть фамілію";
    }

    if (email.trim() === "") {
        errors.email = "Введіть email";
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = "Email має невірний формат";
        }
    }

    if (password === "") {
        errors.password = "Введіть пароль";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Паролі не співпадають";
    }

    return {
        errors,
        valid: Object.keys(errors) < 1,
    };
};

module.exports.validateLoginInput = (email, password) => {
    const errors = {};
    if (email.trim() === "") {
        errors.email = "Введіть email";
    }

    if (password === "") {
        errors.password = "Введіть пароль";
    }

    return {
        errors,
        valid: Object.keys(errors) < 1,
    };
};

module.exports.validateChapterContent = (user, text, type) => {
    const errors = {};
    if (user.role !== "admin" && user.role !== "teacher") {
        errors.role = "Не дозволено";
    }

    if (text.trim() === "") {
        errors.text = "Введіть текст";
    }

    if (type !== "test" && type !== "lecture" && type !== "control") {
        errors.type = "Оберіть тип";
    }


    const valid = Object.keys(errors) < 1;

    return {
        errors,
        valid,
    };
};

module.exports.validateCourse = (courseName, description) =>{
    const errors = {};
    if(courseName.trim() === '') errors.courseName = 'Введіть назву курсу';

    if(courseName.length > 100){
        errors.courseName = 'Назва курсу не може бути більше ніж 100 символів'
    }
    if(description.trim() === '') errors.description = 'Введіть опис';

    if(description.length > 300){
        errors.description = 'Опис не може бути більше ніж 300 символів'
    }

    return {
        errors,
        valid: Object.keys(errors) < 1,
    };
};

module.exports.validateTestInput = (test) => {
    const errors = {};
    if (test.question.trim() === "") {
        errors.question = "Задайте питання";
    }

    if (!test.variants.length) {
        errors.variants = "Не задано жодного питання";
    }

    if (!test.answer.length) {
        errors.answer = "Оберіть відповідь";
    }
    //console.log(errors);
    
    return {
        errors,
        valid: Object.keys(errors) < 1,
    };
};
