import React, { useState, useEffect, use } from 'react';
import { Box, Container, Heading, Image, Link, Text, Flex, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/user';
import './GameCatalog.css';

const GameCatalog = () => {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();



  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://150.136.80.132:5555/game/');
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container p={4} justify="center" background= {'Menu'} >
      <Heading as="h1" size="xl" mb={6} >
        Catálogo de Videojuegos
      </Heading>
      <Box mb={6} textAlign="center">
        <Input
          placeholder="Buscar juegos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="lg"
          maxW="500px"
          m="0 auto"
        />
      </Box>
      <Flex wrap="wrap" justify="center" gap={8}>
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <Box 
              key={game._id} 
              className="card"
              width="300px"
              maxW="400px"
              onClick={() => navigate(`/game/${game._id}`)}
              cursor="pointer"
            >
              <Box className="image-container">
                <Image src={game.logo.url} alt={game.name} maxH="200px" objectFit="cover" />
              </Box>
              <Heading size="md" mb={2} textAlign="center">{game.name}</Heading>
              {game.trailer && (
                <Link href={game.trailer} isExternal textAlign="center" display="block">
                  Ver tráiler
                </Link>
              )}
            </Box>
          ))
        ) : (
          <Text color="gray.500">No se encontraron juegos.</Text>
        )}
      </Flex>
    </Container>
  );
};

export default GameCatalog;
