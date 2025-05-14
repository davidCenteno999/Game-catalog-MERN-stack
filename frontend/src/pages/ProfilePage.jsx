import React, { use, useState, useEffect } from "react";

import { Container, VStack, Text,Heading, Button, 
    SimpleGrid, Tabs,For, HStack, Box, Show, Field, Input, IconButton,
    CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { useGameStore } from "@/store/game";
import { useCompanyStore } from "@/store/company";
import { set } from "zod";

const ProfilePage = () => {
    const [companies, setCompanies] = useState([]);
    const { deleteGame } = useGameStore();
    const { deleteCompany } = useCompanyStore();

    const { user, updateUser, deleteUser } = useAuth(); // Obtiene el usuario del contexto de autenticación

    


    const [isUpdate , setIsUpdate] = React.useState(false); 
    const [isDelete , setIsDelete] = React.useState(false);

    const [ updateUserData , setUpdateUser]  = useState({
        username: "",
        email: "",
        role: "",
    });

   

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`http://localhost:5555/company/user/${user.id}`);
                const data = await response.json();
                if (data.success) {
                    setCompanies(data.data);
                } else {
                    console.error("Error loading companies:", data.message);
                }
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
        fetchCompanies();
    }, [user]);

    const handleUpdate = async (e) => {
        updateUserData.username = updateUserData.username.trim()
        updateUserData.email = updateUserData.email.trim()
        try {
            const { success , message } = await updateUser(updateUserData, user.id);
            if (success) {
                toaster.create({
                    type: 'success',
                    title: 'User updated',
                    isClosable: true,
                    description: message,
                })
                setUpdateUser({
                    username: "",
                    email: "",
                    role: "",
                });
                setIsUpdate(false)
                
            } else {
                toaster.create({
                    type: 'error',
                    title: 'Error',
                    isClosable: true,
                    description: message,
                })
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toaster.create({
                type: 'error',
                title: 'Error',
                isClosable: true,
                description: "Error updating user",
            })
        }

    };

    const handleClick = (id) => {
        navigate(`/company/${id}`);
    };

    const handleDeleteUser = async () => {
        const promise = new Promise(async (resolve, reject) => {
            console.log(companies)
            try {
                for (const company of companies) {
                    for (const gameId of company.games) {
                        const { success, message } = await deleteGame(gameId, company._id);
                        if (!success) {
                            reject({ title: 'Error deleting game', description: message });
                            return;
                        }
                    }
                    const { success, message } = await deleteCompany(company._id, user.id);
                    if (!success) {
                        reject({ title: 'Error deleting company', description: message });
                        return;
                    }
                   
                }
                const { success, message } = await deleteUser(user.id);
                if (!success) {
                    reject({ title: 'Error deleting user', description: message });
                }
                else { {
                    resolve({ title: 'User deleted successfully', description: message });
                    setTimeout(() => navigate('/'), 2000);
                }
                }
               
            } catch (err) {
                reject({ title: 'Error deleting user', description: err.message });
            }
        });

        toaster.promise(promise, {
            success: { title: "Successfully deleted!", description: "The user was deleted successfully." },
            error: { title: "Delete failed", description: "Something went wrong with the delete operation." },
            loading: { title: "Deleting...", description: "Please wait while we delete the user." },
        });
    };

    const navigate = useNavigate(); // Hook para la navegación

   
    return (
        <Container maxW="800px" background={'Menu'} mt={20}>
            <Toaster />
             <VStack spacing={8}  mb= {8}>
                <Heading as="h1" size="2xl" mb={4} color={"green.600"}>
                    Perfil de Usuario
                </Heading>
                
                <Box
                        w="full"
                        
                        p={6}
                        rounded="lg"
                        shadow="md"
                    >
                     <HStack >
                        <VStack>
                            <Field.Root required color={'green.500'} font={'bold'} >
                                <Field.Label htmlFor='name' >Nombre: </Field.Label>
                            </Field.Root>
                            <div className = 'contenedor-flex' >
                                <Show when={!isUpdate}>
                                    <Input 
                                        id="username"
                                        name="username"
                                        disabled
                                        value={user.username}
                                        color={'gray.500'}
                                    w="500px"
                                    />
                                </Show>
                                <Show when={isUpdate}>
                                    <Input 
                                        id="username"
                                        name="username"
                                        value={updateUserData.username}
                                        onChange={handleInputChange}
                                        color={'gray.500'}
                                    w="500px"
                                    />
                                </Show>
                            </div>
                            <Field.Root required color={'green.500'} font={'bold'} mt ={4}>
                                <Field.Label htmlFor='email' >Email: </Field.Label>
                            </Field.Root>
                            <div className = 'contenedor-flex' >
                                <Show when={!isUpdate}>
                                    <Input 
                                        id="email"
                                        name="email"
                                        disabled
                                        value={user.email}
                                        color={'gray.500'}
                                        w="500px"
                                    />

                                </Show>
                                <Show when={isUpdate}>
                                    <Input 
                                        id="email"
                                        name="email"
                                        value={updateUserData.email}
                                        onChange={handleInputChange}
                                        color={'gray.500'}
                                        w="500px"
                                    />
                                </Show>
                            </div>
                        
                        
                        
                            <Field.Root required color={'green.500'} font={'bold'} mt ={4}>
                                <Field.Label htmlFor='role' >Rol: </Field.Label>
                            </Field.Root>
                            
                            <div className = 'contenedor-flex' >
                                <Show when={!isUpdate}>
                                    <Input
                                        id="role"
                                        name="role"
                                        disabled
                                        value={user.role}
                                        color={'gray.500'}
                                        w="500px"
                                    />
                                </Show>
                                <Show when={isUpdate}>
                                    <Tabs.Root value={updateUser.role} onValueChange={
                                        (value) => setUpdateUser((prevState) => ({ ...prevState, role: value.value }))
                                    }>
                                        <Tabs.List>
                                            <Tabs.Trigger value="admin"><RiAdminLine /> Administrador</Tabs.Trigger>
                                            <Tabs.Trigger value="user"><FaRegUserCircle />Usuario</Tabs.Trigger>
                                        </Tabs.List>

                                        <Tabs.Content value="admin">Administrador</Tabs.Content>
                                        <Tabs.Content value="user">Usuario</Tabs.Content>
                                    </Tabs.Root>
                                

                                </Show>
                            </div>

                            <HStack spacing={2} alignItems={"center"} justifyContent={"center"} mt={6} className="action-buttons">
                                <IconButton onClick={() => {
                                        setIsUpdate(true);
                                        setUpdateUser({
                                        username: user.username,
                                        email: user.email,
                                        role: user.role,
                                        });
                                    }
                                } colorScheme='blue' background={'blue.600'}>
                                    <FaEdit />
                                </IconButton>
                                <Dialog.Root role="alertdialog">
                                    <Dialog.Trigger asChild>
                                        <IconButton  variant={'solid'}
                                            colorPalette={'red'}
                                            color={'white.400'}
                                            >
                                            <MdDelete />
                                        </IconButton>
                                    </Dialog.Trigger>
                                    <Portal>
                                        <Dialog.Backdrop />
                                        <Dialog.Positioner>
                                        <Dialog.Content>
                                            <Dialog.Header>
                                            <Dialog.Title>  ¿Desea eliminar la cuenta actual?  </Dialog.Title>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                            <p>
                                                This action cannot be undone. This will permanently delete your
                                                account and remove your data from our systems.
                                            </p>
                                            </Dialog.Body>
                                            <Dialog.Footer>
                                            <Dialog.ActionTrigger asChild>
                                                <Button variant="outline">Cancelar</Button>
                                            </Dialog.ActionTrigger>
                                            <Button colorPalette="red" onClick={handleDeleteUser} >Eliminar</Button>
                                            </Dialog.Footer>
                                            <Dialog.CloseTrigger asChild>
                                            <CloseButton size="sm" />
                                            </Dialog.CloseTrigger>
                                        </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Portal>
                                </Dialog.Root>
                            </HStack>

                        </VStack>
                        <Show  when ={isUpdate}>
                            <VStack spacing={4} alignItems={"flex-end"} mb={40} ml ={39}>
                                <Button 
                                    onClick={handleUpdate}
                                    colorPalette={'teal'}
                                    variant={'solid'}
                                    color={'white.400'}
                                    background={'blue.500'}
                                
                                    >
                                    Actualizar
                                    </Button>
                                <Button
                                    onClick={() => {
                                        setIsUpdate(false);
                                        setUpdateUser({
                                            username: "",
                                            email: "",
                                            role: "",
                                        });
                                        
                                    }}
                                    variant={'solid'}
                                    colorPalette={'red'}
                                    marginLeft="auto"
                                    color={'white.400'}
                                    
                                    >
                                    Cancelar
                                    </Button>
                            </VStack>
                        </Show>
                    </HStack>

                    <SimpleGrid columns={[1, 2]} spacing={4} mt={6} w="full">
                        {companies.map((company) => (
                            <Box key={company._id} borderWidth="1px" borderRadius="lg" p={4} shadow="md" bg="white">
                                <Heading size="sm" mb={2}>{company.name}</Heading>
                                <Text fontSize="sm" color="gray.600">{company.contactInfo.email}</Text>
                                <Text fontSize="sm" color="gray.600">{company.contactInfo.phone}</Text>
                                <Button
                                    size="xs"
                                    mt={2}
                                    colorScheme="teal"
                                    variant="outline"
                                    onClick={() => handleClick(company._id)}
                                >
                                    Ver detalles
                                </Button>
                            </Box>
                        ))}
                    </SimpleGrid>

                       

                    
                   
                    {/* Action Buttons */}
                    <HStack spacing={2} alignItems={"center"} justifyContent={"center"} mt={6} className="action-buttons">
                        
                        <Button onClick={() => navigate(`/create-company`)} 
                            
                            margin={12}
                            colorPalette={'teal'}
                            size ={'sm'}
                            color={'black'}
                            background={'green.500'}
                        font = {'bold'}
                            >
                            Crear Empresa
                        </Button>
                        

                        
                    </HStack>
                </Box>

            </VStack>
        </Container>
    );
}
export default ProfilePage;