import React from "react";
import { Container, VStack, Heading, Button, Input, InputGroup, Text } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/password-input";

const LogInPage = () => {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });

  const { login } = useAuth(); // Lógica de inicio de sesión desde el store
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    credentials.email = credentials.email.trim();
    credentials.password = credentials.password.trim();

    try {
      const { success, message } = await login(credentials); // Llama a la función login del store
      if (success) {
        toaster.create({
          type: "success",
          title: "Login successful",
          isClosable: true,
          description: message,
        });

        setTimeout(() => navigate("/"), 1500); // Redirige al dashboard o página principal
      } else {
        toaster.create({
          type: "error",
          title: "Error",
          isClosable: true,
          description: message,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toaster.create({
        type: "error",
        title: "Error",
        isClosable: true,
        description: "Error during login",
      });
    }
  };

  return (
    <Container maxW="md" centerContent pb={7} bg={"green.200"} mt="300px" borderRadius="xl">
      <Toaster />
      <VStack spacing={4} align="stretch" w="100%" margin={2}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8} color={"green.600"}>
          Iniciar Sesión
        </Heading>
        <InputGroup startElement={<MdOutlineMail />}>
          <Input
            name="email"
            placeholder="Correo electrónico"
            borderColor={"green.600"}
            value={credentials.email}
            onChange={handleChange}
          />
        </InputGroup>
        <InputGroup startElement={<MdOutlinePassword />}>
          <PasswordInput 
            name="password"
            placeholder="Contraseña"
            borderColor={"green.600"}
            value={credentials.password}
            onChange={handleChange}
            />
        </InputGroup>
        <Button
          colorPalette="teal"
          variant="solid"
          size="lg"
          mt={7}
          color={"green.600"}
          bg={"green.300"}
          _hover={{ bg: "green.400" }}
          onClick={handleSubmit}
        >
          Iniciar Sesión
        </Button>

        <Link
          to="/register" // Navegación interna con react-router-dom
          color={"green.500"} // Color del enlace
          _hover={{ color: "green.700" }} // Color al pasar el cursor
        >
          <Text fontSize="sm" textAlign="center"
            color={"green.600"}
            _hover={{ color: "green.700" }} >
            ¿No tienes una cuenta? Regístrate aquí
          </Text>
        </Link>
      </VStack>
    </Container>
  );
};

export default LogInPage;