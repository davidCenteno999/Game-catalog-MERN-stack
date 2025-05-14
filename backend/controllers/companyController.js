import { Company } from '../models/Company.js';
import { User } from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';

export const createCompany = async (req, res) => {
    const company = req.body;
    const { userId } = req.params;
    const newCompany = new Company(company);
    try {
        await newCompany.save();
        await User.findByIdAndUpdate(userId, {
            $push: { companies: newCompany._id },
        });
        res.status(201).json({ success: true, data: newCompany });
    }
    catch (error) {
        console.log("Error in create company", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}


export const deleteCompany = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body; // Assuming you send companyId in the request body
    try {
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }
        const logoImgID = company.logo.public_id;
        if (logoImgID) {
            await cloudinary.uploader.destroy(logoImgID);
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.companies = user.companies.filter(companyId => companyId.toString() !== id);
        await user.save();

        await Company.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Company deleted successfully" });
    } catch (error) {
        console.log("Error in delete company", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getUserCompanies = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('companies');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user.companies });
    } catch (error) {
        console.log("Error in getUserCompanies", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getCompany = async (req, res) => {
    const { id } = req.params;

    try {
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: company });
    } catch (error) {
        console.log("Error in getUserCompanies", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};