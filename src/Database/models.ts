import bcrypt from "bcrypt";

import sequelize from './sequelize';
import { DataTypes } from 'sequelize';
import { Configuration } from '../Configuration';
import { validatePassword, validateEmail } from '../libs/regexp/regex';

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
});

User.beforeCreate(async (user) => {
    if (!validatePassword(user.dataValues.password) || !validateEmail(user.dataValues.email)) {
        throw new Error('Invalid password or email');
    }
    try {
        user.dataValues.password = await bcrypt.hash(user.dataValues.password, +Configuration.bcrypt.rounds);
    } catch (e) {
        throw new Error("Login and email must be unique");
    }
})

const UserProfile = sequelize.define('userProfile', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    favoriteAnimal: { type: DataTypes.STRING },
    takedBooks: { type: DataTypes.ARRAY(DataTypes.STRING) },
    listEditors: { type: DataTypes.ARRAY(DataTypes.STRING) }
})

UserProfile.beforeCreate(async (user) => {
    const profile = await UserProfile.findOne({
        where: {
            login: user.dataValues.login
        }
    })
    if (profile) {
        throw new Error("Profile with this login already exists");
    }
})

const Book = sequelize.define('book', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    author: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
})

const Editor = sequelize.define('editor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
});

User.hasOne(UserProfile)
UserProfile.belongsTo(User);
UserProfile.hasMany(Book);
Book.belongsTo(UserProfile);
UserProfile.belongsToMany(Editor, { through: 'EditorUser'});
Editor.belongsToMany(UserProfile, { through: 'EditorUser'});
export {
    User,
    UserProfile,
    Book,
    Editor
}