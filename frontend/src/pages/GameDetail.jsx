import React, { use, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, Image, Link, Text, VStack, HStack,
  Badge, SimpleGrid, IconButton, CloseButton, Dialog, Portal, Button, Show
} from '@chakra-ui/react';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { useGameStore } from '../store/game';
import { useAuth } from "../context/AuthContext";
import { Toaster, toaster } from "@/components/ui/toaster";
import './GameDetail.css';
import { set } from 'zod';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  

  const {isGameOwner, modified,  isAuthenticated } = useAuth();


  

  const { deleteGame } = useGameStore();
  const navigate = useNavigate();

  const handleDeleteGame = async () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const { success, message } = await deleteGame(game._id , game.companyId);
        if (!success) {
          reject({ title: 'Error deleting game', description: message });
        } else {
          resolve({ title: 'Game deleted successfully', description: message });
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (err) {
        reject({ title: 'Error deleting game', description: err.message });
      }
    });

    toaster.promise(promise, {
      success: { title: "Successfully deleted!", description: "The game was deleted successfully." },
      error: { title: "Delete failed", description: "Something went wrong with the delete operation." },
      loading: { title: "Deleting...", description: "Please wait while we delete the game." },
    });
  };

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`http://localhost:5555/game/${id}`);
        if (!response.ok) throw new Error('Game not found');
        const data = await response.json();
       
        setGame(data);
       
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

 
  useEffect(() => {
    
    if (isAuthenticated && !loading && game?.companyId) {
        isGameOwner(game.companyId);
    }
  }, [isAuthenticated, loading, game?.companyId]);
 

  const goToNextScreenshot = () => {
    if (currentScreenshotIndex < game.screenshots.length - 1) {
      setCurrentScreenshotIndex(currentScreenshotIndex + 1);
    } else {
      setCurrentScreenshotIndex(0); // Loops back to the first screenshot
    }
  };

  const goToPreviousScreenshot = () => {
    if (currentScreenshotIndex > 0) {
      setCurrentScreenshotIndex(currentScreenshotIndex - 1);
    } else {
      setCurrentScreenshotIndex(game.screenshots.length - 1); // Loops back to the last screenshot
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!game) return <Text>Game not found</Text>;

  return (
    <Container maxW="container.xl" p={4} background={'Menu'}>
      <Toaster />



      {/* Background Image with Title */}
      <Box className="game-banner">
        <Heading as="h1" className="game-title">{game.name}</Heading>
        <Image src={game.backgroundImage.url} alt={game.name} className="background-image" />
      </Box>

      <VStack spacing={6} align="start">
        <Box className="trailer-download-grid">
          {/* Capturas de Pantalla en un Box */}
          <Box className="screenshot-slider" position="relative" mb={6}>
            <Heading size="md" mb={2}>🎮 Imagenes del Juego:</Heading>
            <IconButton
              icon={<MdArrowBack />}
              aria-label="Previous Screenshot"
              onClick={goToPreviousScreenshot}
              position="absolute"
              left="10px"
              top="50%"
              transform="translateY(-50%)"
              zIndex="2"
            />
            <Image
              src={game.screenshots[currentScreenshotIndex].url}
              alt={`Screenshot ${currentScreenshotIndex + 1}`}
              className="screenshot"
              boxSize="100%"
              objectFit="cover"
            />
            <IconButton
              icon={<MdArrowForward />}
              aria-label="Next Screenshot"
              onClick={goToNextScreenshot}
              position="absolute"
              right="10px"
              top="50%"
              transform="translateY(-50%)"
              zIndex="2"
            />
          </Box>
          {/* Plataformas disponibles */}
          <Box className="platform-grid">
              <Box className="platform-box">
                <Heading size="md" mb={2}>🎮 Plataformas Disponibles:</Heading>
                <HStack wrap="wrap" spacing={2}>
                  {game.platforms.map((platform, index) => (
                    <Text key={index} colorScheme="blue">{platform}</Text>
                  ))}
                </HStack>
              </Box>
            </Box>
        </Box>

        {/* Trailer + Descargar en */}
        <Box className="trailer-download-grid">
          {/* Trailer */}
          <Box className="trailer-box">
            <Heading size="md">🎬 Tráiler:</Heading>
            <Link href={game.trailer} isExternal color="blue.500" fontSize="lg">Ver Tráiler</Link>
          </Box>

          {/* Descargar en */}
          <Box className="download-box">
            <Heading size="md">📥 Descargar en:</Heading>
            {game.downloadLinks.map((link, index) => (
              <Link key={index} href={link.link} isExternal color="green.500" display="block">
                {link.platform}
              </Link>
            ))}
          </Box>
        </Box>

        {/* Stores and Awards */}
        <Box className="store-award-grid">
          <Box className="award-box">
            <Heading size="md">🏆 Premios Ganados:</Heading>
            {game.awards.map((award, index) => (
              <Text key={index}>🥇 {award.event + " " + award.year + ": " + award.award}</Text>
              
            ))}
          </Box>
        </Box>

        {/* Reviews Section */}
        <Box>
          <Heading size="md">📝 Reviews Externos:</Heading>
          {game.reviews.map((review, index) => (
            <Box key={index} className="review-box">
              <Text fontWeight="bold">⭐ {review.score}/10</Text>
              <Text>{review.reviewText}</Text>
            </Box>
          ))}
        </Box>
      </VStack>

      

      {/* Action Buttons */}
     
      <Show when={modified === true} >
        
        <HStack spacing={2} alignItems={"center"} justifyContent={"center"} mt={6} className="action-buttons">
          <IconButton onClick={() => navigate(`/edit/${game._id}`)} colorScheme='blue' background={'blue.600'}>
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
                        <Dialog.Title>  ¿Desea eliminar el juego actual?  </Dialog.Title>
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
                        <Button colorPalette="red" onClick={handleDeleteGame} >Eliminar</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </HStack>
      </Show>
    </Container>
  );
};

export default GameDetail;
