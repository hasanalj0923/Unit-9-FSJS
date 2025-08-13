// load modules
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    class User extends Model { }

    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'A first name is required' },
                notEmpty: { msg: 'Please provide your first name' }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'A last name is required' },
                notEmpty: { msg: 'Please provide your last name' }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: 'The email address entered already exists' },
            validate: {
                isEmail: { msg: 'Please provide a valid email address' },
                notNull: { msg: 'An email address is required' },
                notEmpty: { msg: 'Please provide an email address' }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'A password is required' },
                notEmpty: { msg: 'Please provide a password' }
            }
        }
    }, {
        sequelize,
        modelName: 'User',
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const hashed = await bcrypt.hash(user.password, 10);
                    user.password = hashed;
                }
            }
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: { fieldName: 'userId', allowNull: false }
        });
    };

    return User;
};
