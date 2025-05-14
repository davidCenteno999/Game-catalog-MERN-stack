import { create } from "zustand";
import { validateUser, validateUserLogin } from "@/schemas/user_schema";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance"; // Importa la instancia de axios

export const useUserStore = create((set) => ({
  user: null, // Estado inicial del usuario
  token: null, // Token inicial

  setUser: (user) => set({ user }),
  startCookieLogger: () => {
    setInterval(() => {
      console.log("Cookies:", Cookies.get()); // Imprime las cookies repetidamente
    }, 5000); // Ejecuta cada 5 segundos
  },
  login: async (credentials) => {
    const validationResult = validateUserLogin(credentials);
    if (!validationResult.success) {
      return { success: false, message: validationResult.error.errors[0].message };
    }

    try {
      const response = await axiosInstance.post("/auth/login", credentials); // Usa axios para la solicitud
      const { success, message, user, token } = response.data;

      if (!success) {
        return { success: false, message };
      }

      // Guarda los datos del usuario y el token en las cookies
     
      console.log(Cookies.get())
      

      return { success: false, message: "Login successful" };
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, message: "Error during login" };
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout"); // Usa axios para la solicitud
      Cookies.remove("token"); // Elimina el token de las cookies
      Cookies.remove("user"); // Elimina el usuario de las cookies
      set({ user: null, token: null }); // Limpia el estado
      return { success: true, message: "Logout successful" };
    } catch (error) {
      console.error("Error during logout:", error);
      return { success: false, message: "Error during logout" };
    }
  },

  register: async (newUser) => {
    const validationResult = validateUser(newUser);
    if (!validationResult.success) {
      return { success: false, message: validationResult.error.errors[0].message };
    }

    try {
      const response = await axiosInstance.post("/auth/register", newUser); // Usa axios para la solicitud
      const { success, message, user, token } = response.data;

      if (!success) {
        return { success: false, message };
      }

      // Guarda los datos del usuario y el token en las cookies
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      // Guarda los datos en el estado
      set({ user, token });

      return { success: true, message: "Registration successful" };
    } catch (error) {
      console.error("Error during registration:", error);
      return { success: false, message: "Error during registration" };
    }
  },
}));