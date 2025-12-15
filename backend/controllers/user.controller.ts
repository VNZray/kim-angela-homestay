import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Create a new user (Stored Procedure)
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;

        const newUser = await prisma.user.create({
            data: { name, email },
        });

        res.status(201).json(newUser);
    } catch (error: any) {
        console.error("Create User Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Get all users (Stored Procedure)
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error: any) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};


// Get user by ID (Stored Procedure)
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: String(id) },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error: any) {
        console.error("Get User By ID Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Update user (Stored Procedure)
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: String(id) },
            data: { name, email },
        });

        res.json(updatedUser);
    } catch (error: any) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};


// Delete user (Stored Procedure)
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: String(id) },
        });

        res.json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
