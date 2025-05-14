
import React, { use, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  VStack,
  Heading,
  Box,
  Input,
  Button,
  Checkbox,
  InputGroup,
  Field,
  For,
  RatingGroup,
  Textarea,
  Image,
  SimpleGrid,
  Show,
  NumberInput
  
} from '@chakra-ui/react';
import { HiUpload } from "react-icons/hi"
import { LuFileImage, LuX } from "react-icons/lu"
import { MdOutlineRateReview } from "react-icons/md";
import { RiAddBoxFill , RiGamepadLine } from "react-icons/ri";
import { CiShop, CiLink } from "react-icons/ci";
import { LiaAwardSolid } from "react-icons/lia";
import { FaLink } from "react-icons/fa";
import { MdOutlineEvent } from "react-icons/md";
import { useState } from "react";
import axios from 'axios';
import { useGameStore } from '../store/game';
import { Toaster, toaster } from "@/components/ui/toaster"
import './GameCreate.css';
import { set } from 'zod';


const platforms_items = [
  { name: 'PC', value: 'PC' },
  { name: 'PlayStation', value: 'PlayStation' },
  { name: 'Xbox', value: 'Xbox' },
  { name: 'Nintendo', value: 'Nintendo' },
];




const CreatePage = () => {

  const { id } = useParams();

  const [newGame, setNewGame] = useState({
    name: '',
    logo: { url: '', public_id: '' },
    backgroundImage: { url: '', public_id: '' },
    trailer: '',
    screenshots: [ { url: '', public_id: '' } ],
    downloadLinks: [{ platform: '', link: '' }],
    reviews: [{ link: '', score: 0 , reviewText: '' }],
    awards: [{event: '', year: 0, award: ''}],
    platforms: [],
    companyId :  id || '',
  });

  //=================================================================================================
  // Subir Archivos Cloudinary
  //=================================================================================================


  const uploadFile = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'images');

    try {
      let cloudName =  import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME 
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const res = await axios.post(api, data);
      const { secure_url, public_id } = res.data;
      
      return { url: secure_url, public_id: public_id };

    } catch (error) {
      console.error(error);
    }
    
   }


  //=================================================================================================
  // Cambiar el valor de los campos
  //=================================================================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGame((prevGame) => ({
      ...prevGame,
      [name]: value,
    }));
  };

 //=================================================================================================
  // Logo
  //=================================================================================================
  
  const { deleteImage } = useGameStore();

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
  
    try {
      if (!file) {
        toaster.create({
          type: 'error',
          title: 'Error',
          isClosable: true,
          description: 'No file selected',
          duration: 2000,
        });
        return;
      }
  
      if (newGame.logo.url === '') {  
        const { url, public_id } = await uploadFile(file);
        setNewGame((prevGame) => ({
          ...prevGame,
          logo: { url, public_id },
        }));
        toaster.create({
          type: 'success',
          title: 'Logo image created',
          isClosable: true,
          description: 'Logo image created successfully',
          duration: 2000,
        });
      } else {
        try {
          const { success, message } = await deleteImage(newGame.logo.public_id);
          if (success) {
            const { url, public_id } = await uploadFile(file);
            setNewGame((prevGame) => ({
              ...prevGame,
              logo: { url, public_id },
            }));
  
            toaster.create({
              type: 'success',
              title: 'Logo updated',
              isClosable: true,
              description: 'Logo updated successfully',
            });
          } else {
            toaster.create({
              type: 'error',
              title: 'Error deleting logo',
              isClosable: true,
              description: message,
            });
          }
        } catch (error) {
          toaster.create({
            type: 'error',
            title: 'Error deleting logo',
            isClosable: true,
            description: error.message,
          });
        }
      }
    } catch (error) {
      toaster.create({
        type: 'error',
        title: 'Error uploading logo',
        isClosable: true,
        description: error.message,
      });
    }
  };
  

  //=================================================================================================
  // Imagen de Fondo
  //=================================================================================================

  const handleBackgroundChange = async(e) => {
    
    const file = e.target.files[0];

    try {
      if (!file) {
        toaster.create({
          type: 'error',
          title: 'Error',
          isClosable: true,
          description: 'No file selected',
          duration: 2000,
        });
        return;
      }
  
      // Verificamos si ya existe una imagen de fondo
      if (newGame.backgroundImage.url === '') {  
        // Si no existe, subimos una nueva
        const { url, public_id } = await uploadFile(file);
        setNewGame((prevGame) => ({
          ...prevGame,
          backgroundImage: { url, public_id },
        }));
        toaster.create({
          type: 'success',
          title: 'Background image created',
          isClosable: true,
          description: 'Background image created successfully',
          duration: 2000,
        });
      } else {
        try {
          // Si ya hay una imagen de fondo, la eliminamos
          const { success, message } = await deleteImage(newGame.backgroundImage.public_id);
          if (success) {
            // Luego subimos la nueva imagen de fondo
            const { url, public_id } = await uploadFile(file);
            setNewGame((prevGame) => ({
              ...prevGame,
              backgroundImage: { url, public_id },
            }));
  
            toaster.create({
              type: 'success',
              title: 'Background image updated',
              isClosable: true,
              description: 'Background image updated successfully',
              duration: 2000,
            });
          } else {
            console.log(message);
          }
        } catch (error) {
          toaster.create({
            type: 'error',
            title: 'Error deleting background image',
            isClosable: true,
            description: error.message,
          });
        }
      }
    } catch (error) {
      console.error(error);
      toaster.create({
        type: 'error',
        title: 'Error uploading background image',
        isClosable: true,
        description: error.message,
      });
    }
    
  }

  //=================================================================================================
  // Capturas de Pantalla
  //=================================================================================================
  const [  haveScreenshots, setHaveScreenshots ] = useState(false);
  const handleScreenshotsChange = async (e) => {
    const files = e.target.files;

    if (files.length > 0) {
      const fileURLs = [];
  
      // Primero eliminamos las capturas de pantalla existentes
      if (newGame.screenshots.length > 0 && haveScreenshots) {
        for (let i = 0; i < newGame.screenshots.length; i++) {
          const screenshot = newGame.screenshots[i];
          
          try {
            const { success, message } = await deleteImage(screenshot.public_id);
            if (success) {
              console.log(`Screenshot ${screenshot.public_id} deleted successfully`);
            } else {
              console.log(message);
            }
          } catch (error) {
           console.error(`Error deleting screenshot ${screenshot.public_id}:`, error);
          }
        }
      }
  
      // Luego subimos las nuevas capturas de pantalla
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
  
        try {
          const { url, public_id } = await uploadFile(file);
          fileURLs.push({ url, public_id });
        } catch (error) {
          console.error(error);
          toaster.create({
            type: 'error',
            title: 'Error uploading screenshot',
            isClosable: true,
            description: error.message,
          });
        }

      }
  
      // Actualiza el estado con las URLs de las capturas
      setNewGame((prevGame) => ({
        ...prevGame,
        screenshots: [...fileURLs], // Actualiza las capturas de pantalla
      }));

      
  
      toaster.create({
        type: 'success',
        title: 'Screenshots uploaded successfully',
        isClosable: true,
        description: 'Screenshots uploaded and old ones deleted successfully',
        duration: 2000,
      });

      setHaveScreenshots(true);
    } else {
      toaster.create({
        type: 'error',
        title: 'Error',
        isClosable: true,
        description: 'No files selected',
        duration: 2000,
      });
      if (newGame.screenshots.length > 0) {
        for (let i = 0; i < newGame.screenshots.length; i++) {
          const screenshot = newGame.screenshots[i];
          
          try {
            const { success, message } = await deleteImage(screenshot.public_id);
            if (success) {
              console.log(`Screenshot ${screenshot.public_id} deleted successfully`);
            } else {
              console.log(message);
            }
          } catch (error) {
           console.error(`Error deleting screenshot ${screenshot.public_id}:`, error);
          }
        }
      }

    }
  };

  //=================================================================================================
  // Plataformas
  //=================================================================================================


  const [seleccionados, setSeleccionados] = useState([]);
  
  const manejarCambio = (valor, estado) => {
    setSeleccionados((prevSeleccionados) => {
      if (estado && !prevSeleccionados.includes(valor)) {
        // Si el checkbox fue marcado, agregar su valor al arreglo
        return [...prevSeleccionados, valor];
      } else {
        // Si el checkbox fue desmarcado, eliminar su valor del arreglo
        return prevSeleccionados.filter((item) => item !== valor);
      }
    });
  };

  
  useEffect(() => {
    setNewGame((prevGame) => ({
      ...prevGame,
      platforms: [...seleccionados], // Crea una copia para evitar referencias compartidas
    }));
  }, [seleccionados]);
    
  //=================================================================================================
  // Enlaces de Descarga
  //=================================================================================================

  const [descargas, setDescargas] = useState([]);
  const [platform_d, setPlatformD] = useState('');
  const [download_link, setDownloadLink] = useState('');

  const handleDescarga = () => {
    if (platform_d && download_link) {
      setDescargas((prevDescargas) => [
        ...prevDescargas,
        { platform: platform_d, link: download_link }
      ]);
      
      // Limpiar los inputs después de agregar
      setPlatformD('');
      setDownloadLink('');
    }
  };

  useEffect(() => {
    setNewGame((prevGame) => ({
      ...prevGame,
      downloadLinks: descargas,
    }));
  }, [descargas]);

  //=================================================================================================
  // Tiendas Disponibles
  //=================================================================================================
  const [stores, setStores] = useState([]);
  const [store, setStore] = useState('');

  const handleStore = () => {
    if (store) {
      setStores((prevStores) => [...prevStores, store]);
      setStore('');
    }

  };

  useEffect(() => {
    setNewGame((prevGame) => ({
      ...prevGame,
      storesavailable: stores,
    }));
  }, [stores]);

  //=================================================================================================
  // Reviews
  //=================================================================================================
  const [ url, setUrl ] = useState('');
  const [ review, setReview ] = useState('');
  const [ rating, setRating ] = useState(0);
  const [ reviews, setReviews ] = useState([]);

  const handleReviewChange = () => {
    if (url && review && rating) {
      setReviews((prevReviews) => [
        ...prevReviews,
        { link: url, score: rating, reviewText: review }
      ]);
      setUrl('');
      setReview('');
      setRating(0);
    }
  }
  useEffect(() => {
    setNewGame((prevGame) => ({
      ...prevGame,
      reviews: reviews,
    }));
  }, [reviews]);


  //=================================================================================================
  // Premios
  //=================================================================================================
  const [award, setAward] = useState('');
  const [year, setYear] = useState("1990");
  const [event, setEvent] = useState('');

  const [awardsList, setAwards] = useState([]);
   const handleAwardsChange = () => {
      setAwards((prevAwards) => [
        ...prevAwards,
        { event: event, year: parseInt(year), award: award }
      ]);
  
      setAward('');
      setYear('1990');
      setEvent('');
    }

  useEffect(() => {
    setNewGame((prevGame) => ({ ...prevGame, awards: awardsList }));
  }, [awardsList]);


  //=================================================================================================
  // Crear Juego
  //=================================================================================================
  const { createGame } = useGameStore();
  const navigate = useNavigate();
  

  
  const handleCreateGame = async () => {
    
    
    try {
      
      
      const { success, message } = await createGame(newGame);
    
      if (success) {
        toaster.create({
          type: 'success',
          title: 'Game created',
          isClosable: true,
          description: message,
        })
        setNewGame({
          name: '',
          logo: '',
          backgroundImage: '',
          trailer: '',
          screenshots: [],
          downloadLinks: [{ platform: '', link: '' }],
          storesavailable: [],
          reviews: [{ link: '', score: 0 , reviewText: '' }],
          awards: [],
          platforms: [],
        });

        
        setTimeout(() => navigate(`/company/${id}`), 1500);
        
      } else {
        toaster.create({
          type: 'error',
          title: 'Error creating game',
          isClosable: true,
          description: message,
        })
      }
    
    } catch (error) {
      toaster.create({
        type: 'error',
        title: 'Error creating exercise',
        message: error.message, 
      })
    }


  }

  
  

  //=================================================================================================

  

  return (
    <Container maxW="container.sm" background={'Menu'} >
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8} color={'green.400'} >
          Crear Nuevo Juego
        </Heading>

        <Box
          w="full"
          
          p={6}
          rounded="lg"
          shadow="md"
        >
          <VStack spacing={4}>


            {/* Nombre */}
            <Field.Root required color={'green.500'} font={'bold'}>
              <Field.Label htmlFor='name' >Nombre del Juego</Field.Label>
            </Field.Root>
            <div className='contenedor-flex'>
              <Input
                id="name"
                placeholder="Nombre del Juego"
                name="name"
                value={newGame.name}
                onChange={handleInputChange}
                color={'gray.500'}
              />
            </div>
            
            {/* Logo */}
            <Field.Root required  color={'green.500'}>
            <Field.Label htmlFor='logo' >Logo</Field.Label>
            </Field.Root>
            <Show when={newGame.logo.url !== ''}>
              <Image src={newGame.logo.url || null}  alt = "logo" height="70px" alignSelf='flex-start' />
            </Show>
            <div className='contenedor-flex'>
              <InputGroup startElement={<LuFileImage />} >
                <Input id="logo" type="file" placeholder="Logo" name='Logo'  onChange={handleLogoChange} />
              </InputGroup>
            </div>

            {/* Imagen de Fondo */}
            <Field.Root required color={'green.500'}>
              <Field.Label htmlFor='fondo'>Imagen de Fondo</Field.Label>
            </Field.Root>
            <Show when={newGame.backgroundImage.url !== ''}>
              <Image src={newGame.backgroundImage.url || null} alt="background" height="70px" alignSelf='flex-start' />
            </Show>
            <div className='contenedor-flex'>
              <InputGroup startElement={<LuFileImage />}>
                <Input id="fondo" type="file" placeholder="Imagen de Fondo" name='backgroundImage'  onChange={handleBackgroundChange} />
              </InputGroup>
           </div>


            {/* Trailer */}
            <Field.Root required color={'green.500'}>
              <Field.Label htmlFor="trailer" >Trailer</Field.Label>
              </Field.Root>
            <div className='contenedor-flex'>
              <InputGroup startElement={<CiLink />}>
                <Input
                  id ="trailer"
                  placeholder="URL del Trailer"
                  name="trailer"
                  value={newGame.trailer}
                  onChange={handleInputChange}
                  color={'gray.500'}
                />
              </InputGroup>
            </div>
            
            {/* Capturas de Pantalla */}
            <Field.Root required color={'green.500'}>
              <Field.Label htmlFor="screenshots">Capturas de Pantalla</Field.Label>
              </Field.Root>
              <Show when={newGame.screenshots.length > 0}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} alignSelf="flex-start" >
                    {newGame.screenshots.map((screenshot, index) => (
                      <Show when={screenshot.url !== ''} key={index}>
                        <Image key={index} src={screenshot.url || null} alt={`Screenshot ${index + 1}`} height="70px" />
                      </Show>
                    ))}
                </SimpleGrid>
              </Show>
            <div className='contenedor-flex'>
              <InputGroup startElement={<HiUpload />}>
                
                <Input 
                  id="screenshots"
                  type="file" 
                  placeholder="Capturas de Pantalla" 
                  multiple 
                  onChange={handleScreenshotsChange} // Manejador de cambio
                />
              </InputGroup>
            </div>
            
            {/* Plataformas */}
            <Field.Root required color={'green.500'}>
              <Field.Label htmlFor="platforms">Plataformas</Field.Label>
            </Field.Root>

            <div style={{  
              
               display: 'flex',
               flexDirection: 'column', // Organiza los elementos en una columna
               alignItems: 'flex-start', // Alinea los elementos al inicio del contenedor (a la izquierda)
              gap: '0.5rem', // Espacio entre elementos
              width: '90%',
             }
             
             }
           
             >

              <For each={platforms_items} >
                
                {(item) => (
                  
                  //console.log(seleccionados),
                  <Checkbox.Root key={item.value} 
                  
                  value={item.value} 
                  onCheckedChange={(estado) => manejarCambio(item.value, estado) } 
                  colorPalette={'teal'}
                  color={'gray.500'}
                  
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control  />
                    <Checkbox.Label 
                     >{item.name}</Checkbox.Label>
                  </Checkbox.Root>
                )
                
                }
              
              </For>
            </div>

            {/* Enlaces de Descarga */}
            <Heading size="xl" color={'green.500'} margin={5}>Links de descargas </Heading>
            <Show when={newGame.downloadLinks.length > 0}>
                <Field.Root required color={'green.500'}> 
                    <Field.Label htmlFor="platform"  >Lista de links de descarga</Field.Label>
                </Field.Root>
            </Show>
            <div style={{  
            
                display: 'flex',
                flexDirection: 'column', // Organiza los elementos en una columna
                alignItems: 'flex-start', // Alinea los elementos al inicio del contenedor (a la izquierda)
                gap: '0.5rem', // Espacio entre elementos
                width: '96%',
                }
                
                }
        
            >
                <Show when={newGame.downloadLinks.length > 0}>
                {newGame.downloadLinks.map((item, index) => (
                    <div key={index}
                    style={{  
                        display: 'flex',
                        flexDirection: 'column', // Organiza los elementos en una columna
                        alignItems: 'flex-start', // Alinea los elementos al inicio del contenedor (a la izquierda)
                        gap: '0.5rem', // Espacio entre elementos
                        width: '99%',
                    }}>
                      
                        <InputGroup startElement={<RiGamepadLine />}>
                          <Input
                            id ="platform" 
                            placeholder="Plataforma"
                            name="platform"
                            value={item.platform}
                            onChange={(e) => {
                              const updatedLinks = [...newGame.downloadLinks];
                              updatedLinks[index].platform = e.target.value;
                              setNewGame((prevGame) => ({
                                ...prevGame,
                                downloadLinks: updatedLinks,
                              }));
                            }}
                            color={'gray.500'}
                          />
                        </InputGroup>
                        <InputGroup startElement={<CiLink />}>
                          <Input
                            placeholder="URL de Descarga"
                            name="download_link"
                            value={item.link}
                            onChange={(e) => {
                              const updatedLinks = [...newGame.downloadLinks];
                              updatedLinks[index].link = e.target.value;
                              setNewGame((prevGame) => ({
                                ...prevGame,
                                downloadLinks: updatedLinks,
                              }));
                            }}
                            color={'gray.500'}
                          />
                        </InputGroup>
                        <a href= {item.link} target="_blank" >
                          <FaLink  color="green" />
                        </a>
                      
                     
                    
                    </div>

                  ))}
                </Show>
                  
                
                  
                    
                

            </div> 


            <Field.Root required color={'green.500'}> 
              <Field.Label htmlFor="platform" >Agregar de Descarga</Field.Label>
            </Field.Root>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column', // Organiza los elementos en una columna
                alignItems: 'flex-start', // Alinea los elementos al inicio del contenedor (a la izquierda)
                gap: '0.5rem', // Espacio entre elementos
                width: '96%',
              }}>
              

              <InputGroup startElement={<RiGamepadLine />}>
                <Input
                  id ="platform" 
                  placeholder="Plataforma"
                  name="platform"
                  value={platform_d}
                  onChange={(e) => setPlatformD(e.target.value)}
                  color={'gray.500'}
                />
              </InputGroup>
              <InputGroup startElement={<CiLink />}>
                <Input
                  placeholder="URL de Descarga"
                  name="download_link"
                  value={download_link}
                  onChange={(e) => setDownloadLink(e.target.value)}
                  color={'gray.500'}
                />
              </InputGroup>

              <Button
                  
                onClick={handleDescarga}
                size={'sm'}
                variant={'solid'}
                colorPalette={'teal'}
                marginLeft="auto"
                color={'green.400'}
              >
                <RiAddBoxFill />
                Agregar 
              </Button>
              
               
            
           </div>

            
                

            {/* Reviews */}
             <Heading size="xl" color={'green.500'} paddingY={10}>Reviews </Heading>
            <Show when={newGame.reviews.length > 0}>
              <Field.Root required color={'green.500'} >
                  <Field.Label htmlFor="review">Lista de reviews externos</Field.Label>
              </Field.Root>
            </Show>
            <div
                style={{  
                  display: 'flex',
                  flexDirection: 'column', // Organiza los elementos en una columna
                  alignItems: 'flex-start', // Alinea los elementos al inicio del contenedor (a la izquierda)
                  gap: '0.5rem', // Espacio entre elementos
                  width: '96%',
              }}>
                  <Show when={newGame.reviews.length > 0}>
                    
                  
                    {newGame.reviews.map((item, index) => (
                      <div key={index}
                      style={{  
                        display: 'flex',
                
                        alignItems: 'center', // Alinea los elementos al inicio del contenedor (a la izquierda)
                        width: '96%',
                        gap: '20px', // Espacio entre elementos
                    }}>
                        <Textarea
                          id="review"
                          placeholder="Texto de la Review"
                          name="review"
                          value={item.reviewText}
                          onChange={(e) => {
                            const updatedReviews = [...newGame.reviews];
                            updatedReviews[index].reviewText = e.target.value;
                            setNewGame((prevGame) => ({
                              ...prevGame,
                              reviews: updatedReviews,
                            }));
                          }}
                          color="gray.500"
                        />
                        <InputGroup startElement={<MdOutlineRateReview />}>
                          <Input
                            placeholder="URL de la Review"
                            name="reviews"
                            value={item.link}
                            onChange={(e) => {
                              const updatedReviews = [...newGame.reviews];
                              updatedReviews[index].link = e.target.value;
                              setNewGame((prevGame) => ({
                                ...prevGame,
                                reviews: updatedReviews,
                              }));
                            }}
                            color={'gray.500'}
                          />
                        </InputGroup>
                        <RatingGroup.Root
                          count={5}
                          value={item.score}
                          defaultValue={0}
                          onValueChange={(value) => {
                            const updatedReviews = [...newGame.reviews];
                            updatedReviews[index].score = value;
                            setNewGame((prevGame) => ({
                              ...prevGame,
                              reviews: updatedReviews,
                            }));
                          }}
                        >
                          <RatingGroup.HiddenInput />
                          <RatingGroup.Control />
                        </RatingGroup.Root>
                        
                        
                      </div>
                    ))}
                  </Show>
                      
                            
                        
                      
                  
                  </div> 

            
              <Field.Root required color={'green.500'}>
                <Field.Label htmlFor= "review">Agregar Reviews</Field.Label>
              </Field.Root>
              <div
              style={{
                display: 'flex',
                
                alignItems: 'center', // Alinea los elementos al inicio del contenedor (a la izquierda)
                width: '96%',
                gap: '20px', // Espacio entre elementos
              }}>

                <Textarea 
                  id = "review"
                  placeholder='Texto de la Review'
                  name="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  color={'gray.500'}
                />
                <InputGroup startElement={<MdOutlineRateReview />}>
                <Input
                  placeholder="URL de la Review"
                  name="reviews"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  color={'gray.500'}
                />
                </InputGroup>
                <RatingGroup.Root
                  count={5}
                  value={rating}
                  defaultValue={0}
                  
                  onValueChange={(e) => {
                    setRating(e.value)}}
                >
                  <RatingGroup.HiddenInput />
                  <RatingGroup.Control />
                </RatingGroup.Root>
                <Button
                  size={'sm'}
                  onClick={handleReviewChange}
                  colorPalette={'teal'}
                  variant={'solid'}
                  color={'green.400'}
                >
                  <RiAddBoxFill /> Agregar
                </Button>
              
            </div>
            
            {/* Premios */}
            <Heading size="xl" color={'green.500'} margin={5}>Premios </Heading>
            <Show when={newGame.awards.length > 0}>
                <Field.Root required color={'green.500'}>
                  <Field.Label htmlFor="store">Lista de premios </Field.Label>
                </Field.Root>
              
                {newGame.awards.map((item, index) => (
                  <div key={index}
                  style={{  
                    display: 'flex',
              
                    alignItems: 'center', // Alinea los elementos al inicio del contenedor (a la izquierda)
                    width: '96%',
                    gap: '20px', // Espacio entre elementos
                }}>
                    <InputGroup startElement={<LiaAwardSolid />}>
                      <Input
                        id = {`awards-${index}`}
                        name="awards"
                        value={item.award}
                        onChange={(e) => {
                          const updatedAwards = [...newGame.awards];
                          updatedAwards[index].award = e.target.value;
                          setNewGame((prevGame) => ({
                            ...prevGame,
                            awards: updatedAwards,
                          }));
                        }}
                        color={'gray.500'}
                      />
                      


                    </InputGroup>
                    <NumberInput.Root
                        maxW="200px"
                        max={2026}
                        value={item.year || year}
                        onValueChange={(e) => {
                          const updatedAwards = [...newGame.awards];
                          updatedAwards[index].year =  parseInt(e.value);
                          setNewGame((prevGame) => ({
                            ...prevGame,
                            awards: updatedAwards,
                          }));
                          
                        }
                        
                      }
                      >
                        <NumberInput.Control />
                        <NumberInput.Input />
                      </NumberInput.Root>
                      
                    <InputGroup startElement={<MdOutlineEvent />}>
                      <Input
                        id = {`event-${index}`}
                        name="event"
                        value={item.event}
                        onChange={(e) => {
                          const updatedAwards = [...newGame.awards];
                          updatedAwards[index].event = e.target.value;
                          setNewGame((prevGame) => ({
                            ...prevGame,
                            awards: updatedAwards,
                          }));
                        }}
                        color={'gray.500'}
                      />
                    </InputGroup>
                      
                  </div>

                ))}
              </Show>
            <Field.Root required color={'green.500'}>
                <Field.Label htmlFor="awards">Agregar Premios</Field.Label>
              </Field.Root>

            <div
              style={{
                display: 'flex',
                
                alignItems: 'center', // Alinea los elementos al inicio del contenedor (a la izquierda)
                width: '96%',
                gap: '20px', // Espacio entre elementos
              }}>
              
                <InputGroup startElement={<LiaAwardSolid />}>
                <Input
                  id = "awards"
                  placeholder="Premios"
                  name="awards"
                  value={award}
                
                  onChange={(e) => setAward(e.target.value)}
                  color={'gray.500'}
                />
                </InputGroup>
                <NumberInput.Root
                  maxW="200px"
                  max={2026}
                  value={year}
                  onValueChange={(e) => {
                    setYear(e.value);
                  }}
                >
                  <NumberInput.Control />
                  <NumberInput.Input />
                </NumberInput.Root>
                <InputGroup startElement={<MdOutlineEvent />}>
                  <Input
                    id = "event"
                    placeholder="Evento"
                    name="event"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    color={'gray.500'}
                  />
                </InputGroup>
              
              <Button
                size={'sm'}
                onClick={handleAwardsChange}
                colorPalette={'teal'}
                variant={'solid'}
                color={'green.400'}
              >

                <RiAddBoxFill /> Agregar 
              </Button>
              
            </div>

            <Button
              w={'full'}
              margin={12}
              onClick={handleCreateGame}
              colorPalette={'teal'}
              variant={'solid'}
              color={'black'}
              background={'green.500'}
            >

              Crear Juego
            </Button>
            

           
            
            
          
          </VStack>
        </Box>
        <Toaster />
      </VStack>
      
    </Container>
    
  )
}

export default CreatePage

/**
 * <Text textAlign={'left'} > Subir capturas de pantalla </Text>
const handleFileChange = (files) => {
    if (files.length > 0) {
      // Convertir archivos en URLs o Blobs para almacenarlos
      const fileURLs = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      setNewGame((prevGame) => ({
        ...prevGame,
        screenshots: [...prevGame.screenshots, ...fileURLs],
      }));
    }
  };
            
 * 

 * 
 * 
 */