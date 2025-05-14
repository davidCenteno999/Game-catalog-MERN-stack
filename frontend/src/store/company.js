import { create } from "zustand";

import { validateCompany } from "@/schemas/company_schema";





export const useCompanyStore = create((set) => ({
    companies: [],
    setCompanies: (companies) => set({ companies }),
    

    createCompany: async (newCompany,id) => {
        const validationResult = validateCompany(newCompany);
        
        if (validationResult.error) {
            return { success: false, message:validationResult.error.errors[0].message };
        }
        const response = await fetch(`http://localhost:5555/company/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCompany),
        });
        const data = await response.json();
        set((state) => ({ companies: [...state.companies, data.data] }));
        return { success: true, message: "Company created successfully" };
    },
    deleteCompany: async (id, userId) => {
        try {
            
            const response = await fetch(`http://localhost:5555/company/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userId}`,
                },
                body: JSON.stringify({ userId }),
            });
            const data = await response.json();
            if (!data.success) return { success: false, message: "Error deleting company" };
    
            set((state) => ({
                companies: state.companies.filter((company) => company._id !== id),
            }));
            return { success: true, message: "Company deleted successfully" };
        } catch (error) {
            console.error("Error in deleteCompany:", error);
            return { success: false, message: "An unexpected error occurred" };
        }
    },



}));