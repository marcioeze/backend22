const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UserSchema = new Schema({
    userName: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    emailConfirmed: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    }
},
{
    timestamps: true,
});

UserSchema.pre('save', async function (next) {
    try {
        // Solo hashear la contraseña si es una nueva o fue modificada
        if (this.isModified('password') || this.isNew) {
            const hash = await bcrypt.hash(this.password, 10);
            this.password = hash;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Método para validar la contraseña
UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

const User = mongoose.model('Users', UserSchema, 'users');

module.exports = User;
