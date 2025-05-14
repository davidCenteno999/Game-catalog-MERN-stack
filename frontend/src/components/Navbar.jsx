import React from 'react'
import { Container, Flex, Text, Link, Button, HStack, Show } from '@chakra-ui/react'
import { ColorModeButton } from "@/components/ui/color-mode"

import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonSharp } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { useColorMode } from './ui/color-mode'
import { useAuth } from '../context/AuthContext'
import { IoLogOutOutline } from "react-icons/io5";


function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isAuthenticated, logout } = useAuth() // Obtiene el estado de autenticación del contexto
  return (
    <Container 
    bg={colorMode === 'dark' ? 'gray.800' : 'white'} // Cambia el color de fondo según el modo
      maxW="1140px" 
      px={4} 
      position="fixed"   // Fija el navbar en la parte superior
      top={0}            // Alinea al top de la pantalla
      left={0}           // Alinea al lado izquierdo
      right={0}          // Alinea al lado derecho
      zIndex={10}        // Asegura que el navbar esté encima de otros elementos
      
    >
      <Flex
        h={16}
        align="center"   // Alinea el contenido verticalmente en el centro
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        <Link href="/">
          <Text
            fontSize={{ base: "22px", sm: "28px" }}
            fontWeight="bold"
            textTransform="uppercase"
            textAlign="center"
            color="green.500"
            _hover={{ color: "green.400" }} // Cambia el color al pasar el mouse
            fontFamily= "revert-layer"
            
          >
           Catalogo
          </Text>
        </Link>
        <HStack spacing={2} alignItems={"center"}>
          <Show when = {!isAuthenticated}>
            <Link href="/login">
              <Button title='LogIn'> 
                <CiUser fontSize={20}  />
              </Button>
            </Link>
          </Show>
          <Show when={isAuthenticated}>
            
          
            <Link href="/profile">
              <Button title='Perfil'> 
                <CiUser fontSize={20}  />
              </Button>
            </Link>
            <Link href='/login'>
              <Button title='LogOut'  onClick={logout}>  
                <IoLogOutOutline fontSize={20}  />
              </Button>
            </Link>
          </Show>
          
        </HStack>
      </Flex>
    </Container>
  )
}

export default NavBar
