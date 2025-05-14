import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
    NumberInput,
    
  } from '@chakra-ui/react';
  import { LuFileImage, LuX } from "react-icons/lu"
  import { HiUpload } from "react-icons/hi"
  import { CiShop, CiLink } from "react-icons/ci";
  import { RiAddBoxFill , RiGamepadLine } from "react-icons/ri";
  import { MdDelete } from "react-icons/md";
  import { MdOutlineRateReview } from "react-icons/md";
  import { FaLink } from "react-icons/fa";
  import { LiaAwardSolid } from "react-icons/lia";
  import { MdOutlineEvent } from "react-icons/md";
  
  import { useGameStore } from '../store/game';
  import './GameCreate.css';
  import './GameDetail.css'
import { Toaster, toaster } from "@/components/ui/toaster";
import { set } from "zod";

const EditGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [game, setGame] = useState({
        name: '',
        logo: { url: '', public_id: '' },
        backgroundImage: { url: '', public_id: '' },
        trailer: '',
        screenshots: [ { url: '', public_id: '' } ],
        downloadLinks: [{ platform: '', link: '' }],
        reviews: [{ link: '', score: 0 , reviewText: '' }],
        awards: [{event: '', year: 0, award: ''}],
        platforms: [],
    });

    //=================================================================================================
  // Subir Archivos Cloudinary
  //=================================================================================================
const { deleteImage } = useGameStore()

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



const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGame((prevGame) => ({
        ...prevGame,
        [name]: value,
    }));
    };

const handleLogoChange = async(e) => {

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
    
        if (game.logo.url === '') {  
          const { url, public_id } = await uploadFile(file);
          setGame((prevGame) => ({
            ...prevGame,
            logo: { url, public_id },
          }));
          toaster.create({
            type: 'success',title: 'Logo image created',isClosable: true,description: 'Logo image created successfully',
            duration: 2000,
          });
        } else {
          try {
            const { success, message } = await deleteImage(game.logo.public_id);
            if (success) {
              const { url, public_id } = await uploadFile(file);
              setGame((prevGame) => ({
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
                type: 'error',title: 'Error deleting logo',isClosable: true,
                description: message,
              });
            }
          } catch (error) {
            toaster.create({type: 'error',title: 'Error deleting logo',isClosable: true,
              description: error.message,
            });
          }
        }
      } catch (error) {
        toaster.create({
          type: 'error',title: 'Error uploading logo',isClosable: true,
          description: error.message,
        });
      }
    
}

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
         if (game.backgroundImage.url === '') {  
           // Si no existe, subimos una nueva
           const { url, public_id } = await uploadFile(file);
           setGame((prevGame) => ({
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
             const { success, message } = await deleteImage(game.backgroundImage.public_id);
             if (success) {
               // Luego subimos la nueva imagen de fondo
               const { url, public_id } = await uploadFile(file);
               setGame((prevGame) => ({
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

 
    const handleScreenshotsChange = async (e) => {
      const files = e.target.files;
  
      if (files.length > 0) {
        const fileURLs = [];
    
        // Primero eliminamos las capturas de pantalla existentes
        if (game.screenshots.length > 0) {
          for (let i = 0; i < game.screenshots.length; i++) {
            const screenshot = game.screenshots[i];
            
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
        setGame((prevGame) => ({
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
  
        
      } else {
        toaster.create({
          type: 'error',
          title: 'Error',
          isClosable: true,
          description: 'No files selected',
          duration: 2000,
        });
        if (game.screenshots.length > 0) {
          for (let i = 0; i < game.screenshots.length; i++) {
            const screenshot = game.screenshots[i];
            
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
  const platforms_items = [
    { name: 'PC', value: 'PC' },
    { name: 'PlayStation', value: 'PlayStation' },
    { name: 'Xbox', value: 'Xbox' },
    { name: 'Nintendo', value: 'Nintendo' },
  ];


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
    setGame((prevGame) => ({
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
    setGame((prevGame) => ({
      ...prevGame,
      downloadLinks: descargas,
    }));
  }, [descargas]);

  



  const handleDeleteDownloadLnks = (index) => {
    setDescargas((prevDescargas) => prevDescargas.filter((_, i) => i !== index));
  };


  
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
    setGame((prevGame) => ({
      ...prevGame,
      storesavailable: stores,
    }));
  }, [stores]);

  const handleDeleteStore = (index) => {
    setStores((prevStores) => prevStores.filter((_, i) => i !== index));
  };



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

  const handleDeleterview = (index) => {
    setReviews((prevReviews) => prevReviews.filter((_, i) => i !== index));
  };


  

  useEffect(() => {
    setGame((prevGame) => ({
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
      setGame((prevGame) => ({ ...prevGame, awards: awardsList }));
      
    }, [awardsList]);

    useEffect(() => {
      console.log(game.awards)
    }, [game.awards]);

    const handleDeleteAwards = (index) => {
      setAwards((prevAwards) => prevAwards.filter((_, i) => i !== index));
    };

//=================================================================================================
// GET Gmae
//=================================================================================================

const [datosCargados, setDatosCargados] = useState(false);

useEffect(() => {
  axios.get(`http://localhost:5555/game/${id}`)
    .then(response => {
      setGame(response.data);
      if (!datosCargados) {
        setSeleccionados(response.data.platforms);
        setDescargas(response.data.downloadLinks);
        setStores(response.data.storesavailable);
        setReviews(response.data.reviews);
        setAwards(response.data.awards);
        setDatosCargados(true); // Marca los datos como cargados
      }
    })
    .catch(error => console.error("Error al obtener los datos del juego:", error));
}, [id, datosCargados])

  
//=================================================================================================
// PUT Game
//=================================================================================================s
const { updateGame } = useGameStore()
const handleUpdateGame = async () => {
    
    
    const promise = new Promise(async (resolve, reject) => {
      try {
        const { success, message } = await updateGame(id, game);
        console.log(message)
        if (!success) {
          
          reject({ title: 'Error updating game', description: message });
        } else {
          resolve({ title: 'Game updated successfully', description: message });
          setTimeout(() => navigate(`/game/${id}`), 2000);
        }
      } catch (err) {
        console.log(err)
        reject({ title: 'Error updating game', description: err.message });
      }
    })

    toaster.promise(promise, {
      success: { title: "Successfully updated!", description: "The game was updated successfully." },
      error: { title: "Update failed", description: "Something went wrong with the update operation." },
      loading: { title: "Updating...", description: "Please wait while we update the game." },
    });
  };



    

    

    return (
        <Container maxW="container.sm" background={'Menu'} >
            <Toaster />
            <VStack spacing={8}>
                <Heading as="h1" size="2xl" textAlign="center" mb={8} color={'green.400'} >
                Editar Juego
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
                        <div className='contenedor-flex' margin ={10}>
                            <Input
                                id="name"
                                placeholder="Nombre del Juego"
                                name="name"
                                value={game.name}
                                onChange={handleInputChange}
                                color={'gray.500'}
                            />
                        </div>

                        {/* Logo */}
                        <Field.Root required  color={'green.500'}>
                            <Field.Label htmlFor='logo' >Logo</Field.Label>
                        </Field.Root>
                        <Image src={game.logo.url || null} alt={`${game.name} Logo`} height="70px" alignSelf='flex-start' />
                        <div className='contenedor-flex'>
                            <InputGroup startElement={<LuFileImage />} >
                                <Input id="logo" type="file" placeholder="Logo" name='Logo'  onChange={handleLogoChange} />
                            </InputGroup>
                        </div>

                        {/* Imagen de Fondo */}
                        <Field.Root required color={'green.500'}>
                            <Field.Label htmlFor='fondo'>Imagen de Fondo</Field.Label>
                        </Field.Root>
                        <Image src={game.backgroundImage.url || null} alt={game.name} height="70px" alignSelf='flex-start' />
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
                                value={game.trailer}
                                onChange={handleInputChange}
                                color={'gray.500'}
                                />
                            </InputGroup>
                        </div>


                         {/* Capturas de Pantalla */}
                        <Field.Root required color={'green.500'}>
                            <Field.Label htmlFor="screenshots">Capturas de Pantalla</Field.Label>
                        </Field.Root>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} alignSelf="flex-start" >
                            {game.screenshots.map((screenshot, index) => (
                                <Image key={index} src={screenshot.url || null} alt={`Screenshot ${index + 1}`} height="70px" />
                            ))}
                        </SimpleGrid>


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
                                    
                                    
                                    <Checkbox.Root key={item.value} 
                                        checked = {seleccionados.includes(item.value)}
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





                        {/* Download Links */}
                        <Heading size="xl" color={'green.500'} margin={5}>Links de descargas </Heading>
                        <Field.Root required color={'green.500'}> 
                            <Field.Label htmlFor="platform"  >Editar link de descarga</Field.Label>
                        </Field.Root>
                        <div style={{  
                        
                            display: 'flex',
                            flexDirection: 'column', // Organiza los elementos en una columna
                            alignItems: 'flex-start', // Alinea los elementos al inicio del contenedor (a la izquierda)
                            gap: '0.5rem', // Espacio entre elementos
                            width: '96%',
                            }
                            
                            }
                    
                        >
                            {game.downloadLinks.map((item, index) => (
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
                                        const updatedLinks = [...game.downloadLinks];
                                        updatedLinks[index].platform = e.target.value;
                                        setGame((prevGame) => ({
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
                                        const updatedLinks = [...game.downloadLinks];
                                        updatedLinks[index].link = e.target.value;
                                        setGame((prevGame) => ({
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
                                  <Button
                                  
                                    onClick={() => handleDeleteDownloadLnks(index)}
                                    size={'sm'}
                                    variant={'solid'}
                                    colorPalette={'red'}
                                    marginLeft="auto"
                                    color={'white.400'}
                                  >
                                    <MdDelete />
                                    Eliminar
                                  </Button>
                                
                                </div>

                              ))}
                             
                            
                              
                               
                           

                        </div> 
                        <Field.Root required color={'green.500'}> 
                            <Field.Label htmlFor="platform"  >Agregar link de descarga</Field.Label>
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


                        


                         {/* Reviews Section */}

                         <Heading size="xl" color={'green.500'} paddingY={10}>Reviews </Heading>

                         <Field.Root required color={'green.500'} >
                            <Field.Label htmlFor="review">Editar Reviews Externos</Field.Label>
                        </Field.Root>

                        <div
                          style={{  
                            display: 'flex',
                            flexDirection: 'column', // Organiza los elementos en una columna
                            alignItems: 'flex-start', // Alinea los elementos al inicio del contenedor (a la izquierda)
                            gap: '0.5rem', // Espacio entre elementos
                            width: '96%',
                        }}>
                            
                            {game.reviews.map((item, index) => (
                              <div key={index}
                              style={{  
                                display: 'flex',
                                flexDirection: 'column', // Organiza los elementos en una columna
                                alignItems: 'flex-start', // Alinea los elementos al inicio del contenedor (a la izquierda)
                                gap: '0.5rem', // Espacio entre elementos
                                width: '99%',
                            }}>
                                <Textarea
                                  id="review"
                                  placeholder="Texto de la Review"
                                  name="review"
                                  value={item.reviewText}
                                  onChange={(e) => {
                                    const updatedReviews = [...game.reviews];
                                    updatedReviews[index].reviewText = e.target.value;
                                    setGame((prevGame) => ({
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
                                      const updatedReviews = [...game.reviews];
                                      updatedReviews[index].link = e.target.value;
                                      setGame((prevGame) => ({
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
                                    const updatedReviews = [...game.reviews];
                                    updatedReviews[index].score = value;
                                    setGame((prevGame) => ({
                                      ...prevGame,
                                      reviews: updatedReviews,
                                    }));
                                  }}
                                >
                                  <RatingGroup.HiddenInput />
                                  <RatingGroup.Control />
                                </RatingGroup.Root>
                                <Button
                                  
                                  onClick={() => handleDeleterview(index)}
                                  size={'sm'}
                                  variant={'solid'}
                                  colorPalette={'red'}
                                  marginLeft="auto"
                                  color={'white.400'}
                                >
                                  <MdDelete />
                                  Eliminar
                                </Button>
                                
                              </div>
                            ))}
                               
                                      
                                  
                                
                            
                            </div> 
                            <Field.Root required color={'green.500'} >
                              <Field.Label htmlFor="review">Agregar Reviews Externos</Field.Label>
                            </Field.Root>
                            <div
                            style={{
                              display: 'flex',
                
                              alignItems: 'center', // Alinea los elementos al inicio del contenedor (a la izquierda)
                              width: '96%',
                              gap: '20px', // Espacio entre elementos
                            }}
                            >

                              
                              

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
                              <Field.Root required color={'green.500'}>
                                <Field.Label htmlFor="store">Editar premios</Field.Label>
                              </Field.Root>
                             
                              {game.awards.map((item, index) => (
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
                                        const updatedAwards = [...game.awards];
                                        updatedAwards[index].award = e.target.value;
                                        setGame((prevGame) => ({
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
                                        const updatedAwards = [...game.awards];
                                        updatedAwards[index].year =  parseInt(e.value);
                                        setGame((prevGame) => ({
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
                                        const updatedAwards = [...game.awards];
                                        updatedAwards[index].event = e.target.value;
                                        setGame((prevGame) => ({
                                          ...prevGame,
                                          awards: updatedAwards,
                                        }));
                                      }}
                                      color={'gray.500'}
                                    />
                                  </InputGroup>

                                    <Button
                                    
                                    onClick={() => handleDeleteAwards(index)}
                                    size={'sm'}
                                    variant={'solid'}
                                    colorPalette={'red'}
                                    marginLeft="auto"
                                    color={'white.400'}
                                  >
                                    <MdDelete />
                                    Eliminar
                                  </Button>
                                </div>

                              ))}
                              <Field.Root required color={'green.500'}>
                                <Field.Label htmlFor="store">Agregar premio</Field.Label>
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
                          margin={10}
                            w={'full'}
                            onClick={handleUpdateGame}
                            colorPalette={'teal'}
                            variant={'solid'}
                            color={'black'}
                            background={'blue.500'}
                          >
              
                            Actualizar Juego
                          </Button>



                    </VStack>

                </Box>

            
            
            </VStack>
        </Container>
    );
};

export default EditGame;
