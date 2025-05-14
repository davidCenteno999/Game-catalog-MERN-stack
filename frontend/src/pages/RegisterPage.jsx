import React  from "react";
import { Container, VStack, Heading, Button, Input, InputGroup } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster"
import {
    PasswordInput,
    PasswordStrengthMeter,
  } from "@/components/ui/password-input"
import { LuUser } from "react-icons/lu"
import { MdOutlineMail } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {

    const [user, setUser] = React.useState({
        username: "",
        email: "",
        password: ""
    });

    const { register} = useAuth(); // Lógica de registro desde el store

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    }
   
    const navigate = useNavigate();

    const handleSubmit = async () => {
        user.password = user.password.trim()
        user.username = user.username.trim()
        user.email = user.email.trim()
        try {
            const { success , message } = await register(user)
            
            if (success) {
                toaster.create({
                    type: 'success',
                    title: 'User created',
                    isClosable: true,
                    description: message,
                    })
                setUser({
                    username: "",
                    email: "",
                    password: ""
                });

                setTimeout(() => navigate('/login'), 1500);
            } else {
                toaster.create({
                    type: 'error',
                    title: 'Error',
                    isClosable: true,
                    description: message,
                    })
            }

        


    
    } catch (error) {
            console.error("Error during registration:", error);
            toaster.create({
                type: 'error',
                title: 'Error',
                isClosable: true,
                description: "Error during registration",
                })
        }
    }


    return (
        <Container maxW="md" centerContent  pb={7} bg={'green.200'} mt="300px" borderRadius="xl">
           <Toaster />
            <VStack spacing={4} align="stretch" w="100%" margin={2}>
                <Heading as="h1" size="2xl" textAlign="center" mb={8} color={'green.600'} >
                    Registro
                </Heading>
                <InputGroup startElement={<LuUser />}>
                    <Input  name="username"  value={user.username} placeholder="Username"  borderColor={'green.600'} onChange={handleChange }  />
                </InputGroup>
                <InputGroup startElement={<MdOutlineMail />}>
                    <Input name="email"  value={user.email} placeholder= "me@example.com"  borderColor={'green.600'} onChange={handleChange}  />
                </InputGroup>
                <InputGroup startElement={<MdOutlinePassword />}>
                    <PasswordInput name="password"  value={user.password} placeholder="Password"  borderColor={'green.600'} onChange={handleChange}  />
                </InputGroup>
                <Button colorPalette="teal" variant="solid" size="lg" mt={7} 
                color={'green.600'} bg={'green.300'} _hover={{ bg: 'green.400' }}
                onClick={handleSubmit}>
                    Crear cuenta
                </Button>
               

                
            </VStack>
        </Container>
    );
}

export default RegisterPage;