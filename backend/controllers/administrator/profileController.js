import { User } from '../../models/userModel.js';
import argon2 from 'argon2';

/**
 * Handle password change request
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, userId } = req.body;

        // Validate request
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        // Make sure the user can only change their own password unless they're an admin
        if (req.userId !== userId && req.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to change this password"
            });
        }

        // Find the user
        const user = await User.findOne({
            where: {
                user_id: userId
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const validPassword = await argon2.verify(user.password, currentPassword);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Update the password
        // Note: Sequelize hooks will automatically hash the new password
        await user.update({
            password: newPassword
        });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while changing the password"
        });
    }
};

/**
 * Get user profile information
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                user_id: req.userId
            },
            attributes: ['user_id', 'fullname', 'email', 'role', 'gender', 'status', 'verified', 'created_at', 'updated_at']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching profile data"
        });
    }
};