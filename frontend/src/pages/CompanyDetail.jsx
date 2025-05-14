import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, Image, Link, Text, VStack, HStack,
  IconButton, Spinner, CloseButton, Dialog, Portal, Button
} from '@chakra-ui/react';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaGamepad } from "react-icons/fa";
import { useGameStore } from '../store/game';
import { useCompanyStore } from '@/store/company';
import { Toaster, toaster } from "@/components/ui/toaster";
import { useAuth } from "../context/AuthContext";

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`http://localhost:5555/company/${id}`);
        if (!response.ok) throw new Error('Empresa no encontrada');
        const data = await response.json();
        //console.log(data.data);
        setCompany(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  const { deleteGame } = useGameStore()
  const { deleteCompany } = useCompanyStore();

  const handleDelete = async () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
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
        } else {
          resolve({ title: 'Company deleted successfully', description: message });
          setTimeout(() => navigate('/profile'), 2000);
        }
      } catch (err) {
        reject({ title: 'Error deleting company', description: err.message });
      }
    }
    );
    toaster.promise(promise, {
      success: { title: "Successfully deleted!", description: "The company was deleted successfully." },
      error: { title: "Delete failed", description: "Something went wrong with the delete operation." },
      loading: { title: "Deleting...", description: "Please wait while we delete the company." },
    });
  
  };

 
  if (loading) return <Spinner size="xl" mt={10} />;

  if (error) return (
    <Box bg="red.100" border="1px" borderColor="red.300" p={4} borderRadius="md" mt={6}>
      <Text color="red.800" fontWeight="bold">
        ⚠️ Error: {error}
      </Text>
    </Box>
  );

  if (!company) return <Text>Empresa no encontrada</Text>;

  return (
    <Container maxW="container.md" p={4} background="gray.50" borderRadius="md" boxShadow="md">
      <Toaster />

      <VStack spacing={6} align="start">
        <Heading>{company.name}</Heading>

        <Image
          src={company.logo.url}
          alt={`${company.name} logo`}
          maxW="200px"
          borderRadius="md"
        />

        

        <Box>
          <Heading size="md">📧 Contacto:</Heading>
          <Text>Email: {company.contactInfo.email}</Text>
          <Text>Teléfono: {company.contactInfo.phone}</Text>
        </Box>

        <Box>
          <Heading size="md">🔗 Sitio Web:</Heading>
          <Link href={company.websiteLinks.website} isExternal color="blue.500">
            {company.websiteLinks.website}
          </Link>
        </Box>

        <Box>
          <Heading size="md">📱 Redes Sociales:</Heading>
          <VStack align="start" spacing={1}>
            {company.websiteLinks.socialMedia.map((media, index) => (
              <Link key={index} href={media.link} isExternal color="blue.400">
                {media.platform}
              </Link>
            ))}
          </VStack>
        </Box>

        <Box>
          <Heading size="md">📄 Descripción:</Heading>
          <VStack align="start" spacing={3}>
            {company.description.split('\n\n').map((para, idx) => (
              <Text key={idx}>{para}</Text>
            ))}
          </VStack>
        </Box>

        <Box>
          <Heading size="md">🎮 Juegos Asociados:</Heading>
          {company.games.length > 0 ? (
            <VStack align="start" spacing={1}>
              {company.games.map((gameId, idx) => (
                <Text key={idx}>ID de juego: {gameId}</Text>
              ))}
            </VStack>
          ) : (
            <Text>No hay juegos asociados.</Text>
          )}
        </Box>
      </VStack>

      <HStack spacing={4} justifyContent="center" mt={6}>
        <Link href={`/create-game/${company._id}`}>
          <Button title="Crear Juego" background={"green.600"}>
            <FaGamepad />
          </Button>
        </Link>
        <IconButton
          onClick={() => navigate(`/company/edit/${company._id}`)}
          colorScheme='blue'
          background={'blue.600'}
        >
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
                  <Dialog.Title>  ¿Desea eliminar la empresa actual?  </Dialog.Title>
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
                  <Button colorPalette="red" onClick={handleDelete} >Eliminar</Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
              </Dialog.Content>
              </Dialog.Positioner>
          </Portal>
      </Dialog.Root>
      
      </HStack>
    </Container>
  );
};

export default CompanyDetail;
