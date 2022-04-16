const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
    validateRegisterInput,
    validateLoginInput,
} = require("../../utils/validators");
const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const checkAuth = require("../../utils/check-auth");

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
        SECRET_KEY,
        { expiresIn: "1d" }
    );
}

module.exports = {

    Query:{
        async getUser(_,__, context){
            let user = checkAuth(context);
            user = await User.findById(user.id);
            return user;
        }
    },

    Mutation: {
        async login(_, { email, password }) {
            const { errors, valid } = validateLoginInput(email, password);

            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            const user = await User.findOne({ email });
            if (!user) {
                errors.general = "User is not found";
                throw new UserInputError("User not found", { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Invalid password";
                throw new UserInputError("Password is incorrect", { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token,
            };
        },

        async register(
            _,
            {
                registerInput: {
                    firstName,
                    lastName,
                    role,
                    email,
                    password,
                    confirmPassword,
                },
            },
            context,
            info
        ) {
            const { valid, errors } = validateRegisterInput(
                firstName,
                lastName,
                role,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }
            const user = await User.findOne({ email });
            if (user) {
                throw new UserInputError("email", {
                    errors: {
                        email: "User with this email already exists",
                    },
                });
            }
            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                firstName,
                lastName,
                role,
                password,
                createdAt: new Date().toISOString(),
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token,
            };
        },

        
    },
};
