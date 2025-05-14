import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest, loginRequest, verifyTokenRequest,
     logoutRequest, updateUserRequest, deleteUserRequest } from "@/api/auth";
import { validateUser , validateUserLogin,  validateUserUpdate} from "@/schemas/user_schema";

import Cookies from "js-cookie";
import { set } from "zod";

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}




export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [modified , setModified] = useState(false)
    
    
    
    
    const register = async (newUser) => {
        const validationResult = validateUser(newUser)
        if (!validationResult.success) {
            return { success: false, message: validationResult.error.errors[0].message }
        }

        const res = await registerRequest(newUser)
        if (res.success) {
            console.log(res.data)
            setUser(res.data)
            setIsAuthenticated(true)
            return { success: true, message: "Registration successful" }
        } else {
            return { success: false, message: res.message }
        }
        
    }

    const login = async (credentials) => {
        const validationResult = validateUserLogin(credentials)
        if (!validationResult.success) {
            return { success: false, message: validationResult.error.errors[0].message }
        }

        try {
            const response = await loginRequest(credentials)
            if (response.success) {
                setUser(response.data)
                setIsAuthenticated(true)
                console.log(isAuthenticated)
                
                return { success: true, message: "Login successful" }
            } else {
                return { success: false, message: response.message }
            }
        } catch (error) {
            console.error("Error during login:", error)
            return { success: false, message: "Error during login" }
        }
    }

    const logout = async () => {
        try {
            const response = await logoutRequest()
            if (response.success) {
                setUser(null)
                setIsAuthenticated(false)
                setModified(false)
                Cookies.remove("token")
                return { success: true, message: "Logout successful" }
            } else {
                return { success: false, message: response.message }
            }
        } catch (error) {
            console.error("Error during logout:", error)
            return { success: false, message: "Error during logout" }
        }
    }

    const updateUser = async (updatedUser, id) => {
        const validationResult = validateUserUpdate(updatedUser)
        if (!validationResult.success) {
            return { success: false, message: validationResult.error.errors[0].message }
        }

        try {
            const response = await updateUserRequest(updatedUser,id)
            if (response.success) {
                setUser(response.data)
                return { success: true, message: "User updated successfully" }
            } else {
                return { success: false, message: response.message }
            }
        } catch (error) {
            console.error("Error during user update:", error)
            return { success: false, message: "Error during user update" }
        }
    }

    const deleteUser = async () => {
        try {
           

            const response = await deleteUserRequest(user.id)
            if (response.success) {
                setUser(null)
                setIsAuthenticated(false)
                setLoading(true)
                Cookies.remove("token") 
                return { success: true, message: "User deleted successfully" }
            } else {
                return { success: false, message: response.message }
            }
        } catch (error) {
            console.error("Error during user deletion:", error)
            return { success: false, message: "Error during user deletion" }
        }
    }

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();
            if (!cookies.token) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const res = await verifyTokenRequest(cookies.token);
                if (res.success && res.data) {
                    setUser(res.data);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);

                }
            } catch (error) {
                console.error("Error verifying token:", error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }

        checkLogin();
    }, []);

    const isGameOwner = (companyId) => {
        if (!user || !user.companies) {
            setModified(false); // Si no hay usuario o compañías, no es propietario
            return;
        }
    
        const isOwner = user.companies.some((company) => company === companyId);
        setModified(isOwner); // Cambia a true si encuentra una coincidencia
    };

    return (
        <AuthContext.Provider value={{
            register,
            login,
            logout,
            updateUser,
            deleteUser,
            user,
            isAuthenticated,
            loading,
            modified,
            isGameOwner,
        }}>
            {children}
        </AuthContext.Provider>
    )
}