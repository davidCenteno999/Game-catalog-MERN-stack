import React, { use, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
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
import { withMask } from "use-mask-input";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useCompanyStore } from '@/store/company';
import { useGameStore } from '../store/game';
import { useAuth } from "../context/AuthContext";
import { RiAddBoxFill , RiGamepadLine } from "react-icons/ri";
import { CiShop, CiLink } from "react-icons/ci";
import { LuFileImage, LuX } from "react-icons/lu"
import './CompanyCreate.css'
import axios from 'axios';

const CreateCompanyPage = () => {

    const [newCompany, setNewCompany] = useState({
        name: '',
        contactInfo: {
            email: '',
            phone: '',
        },
        websiteLinks: {
            website: '',
            socialMedia: [
               
            ],
        },
        description: '',
        logo: {
            url: '',
            public_id: '',
        }
    });

    const { user } = useAuth();
    

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
    setNewCompany((prevCompany) => ({
      ...prevCompany,
        [name]: value,
    }));
  };

  // =================================================================================================
    // Cambiar el valor de los campos de contacto
    //=================================================================================================
    const handleContactInfoChange = (e) => {
        const { name, value } = e.target;
        setNewCompany((prevCompany) => ({
            ...prevCompany,
            contactInfo: {
                ...prevCompany.contactInfo,
                [name]: value,
            },
        }));
    };

    //=================================================================================================
    // Cambiar de sitio web
    //=================================================================================================
    const handleWebsiteChange = (e) => {
        const { name, value } = e.target;
        setNewCompany((prevCompany) => ({
            ...prevCompany,
            websiteLinks: {
                website: value,
                socialMedia: prevCompany.websiteLinks.socialMedia,
            },
        }));
    };
                

   //=================================================================================================
    // Enlaces de Descarga
    //=================================================================================================
  
  
    const [redSocial, setRedSocial] = useState('');
    const [enlace, setEnlace] = useState('');

    const handleAddRedSocial = () => {
        if (redSocial && enlace) {
          setNewCompany((prevCompany) => ({
            ...prevCompany,
            websiteLinks: {
              ...prevCompany.websiteLinks,
              socialMedia: [
                ...prevCompany.websiteLinks.socialMedia,
                { platform: redSocial, link: enlace },
              ],
            },
          }));
          setRedSocial('');
          setEnlace('');
        }
      };

    //=================================================================================================
    // Descripcion de la empresa
    //=================================================================================================
    const [description, setDescription] = useState('');
    useEffect(() => {
        setNewCompany((prevCompany) => ({
            ...prevCompany,
            description: description,
        }));
    }, [description]);


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
      
          if (newCompany.logo.url === '') {  
            const { url, public_id } = await uploadFile(file);
            setNewCompany((prevCompany) => ({
                ...prevCompany,
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
                setNewCompany((prevCompany) => ({
                    ...prevCompany,
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
    // Enviar la empresa
    //=================================================================================================
    
    const { createCompany } = useCompanyStore();
    const navigate = useNavigate();

    const handleCreateCompany = async () => {
        
        try {
            const { success, message } = await createCompany(newCompany, user.id);
            if (success) {
                toaster.create({
                    type: 'success',
                    title: 'Company created',
                    isClosable: true,
                    description: message,
                });
                setNewCompany({
                    name: '',
                    contactInfo: {
                        email: '',
                        phone: '',
                    },
                    websiteLinks: {
                        website: '',
                        socialMedia: [],
                    },
                    description: '',
                    logo: {
                        url: '',
                        public_id: '',
                    },
            
                });

                setTimeout(() => navigate('/profile'), 1200);
            } else {
                toaster.create({    
                    type: 'error',
                    title: 'Error creating company',
                    isClosable: true,
                    description: message,
                });
            }
        } catch (error) {
            toaster.create({
                type: 'error',
                title: 'Error creating company',
                isClosable: true,
                description: error.message,
            });
        }
    };

    


  return (
     <Container maxW="container.sm" background={'Menu'} >
        <VStack spacing={8}>
             <Heading as="h1" size="2xl" textAlign="center" mb={8} color={'green.400'} >
                Crear Empresa
            </Heading>
    
            <Box w="full"
                p={6}
                rounded="lg"
                shadow="md"
            >
                <VStack spacing={4}>
                    {/*Nombre de la Empresa*/}
                    <Field.Root required color={'green.500'} font={'bold'}>
                        <Field.Label htmlFor='name' >Nombre de la Empresa</Field.Label>
                    </Field.Root>
                    <div className='contenedor-flex'>
                        <Input
                        id="name"
                        placeholder="Nombre de la Empresa"
                        name="name"
                        value={newCompany.name}
                        onChange={handleInputChange}
                        color={'gray.500'}
                        />
                    </div>
                    {/*Informacion de contacto*/}
                    <Heading size="xl" color={'green.500'} margin={5}>Informacion de contacto </Heading>
                    
                    <div className='contenedor-flex'
                        
                    >
                        <Field.Root required color={'green.500'} font={'bold'}>
                            <Field.Label htmlFor='contactInfo'  >Email</Field.Label>
                        </Field.Root>
                        <Input
                        id="contactInfo.email"
                        placeholder="Email"
                        name="email"
                        value={newCompany.contactInfo.email}
                        onChange={handleContactInfoChange}
                        color={'gray.500'}
                        />
                        <Field.Root required color={'green.500'} font={'bold'}>
                            <Field.Label htmlFor='contactInfo' >Telefono</Field.Label>
                        </Field.Root>
                        <Input
                            id="contactInfo.phone"
                            placeholder="(506) 9999-9999"
                            ref={withMask("(506) 9999-9999")}
                            name="phone"
                            value={newCompany.contactInfo.phone}
                            onChange={handleContactInfoChange}
                            color={'gray.500'}
                        />
                    </div>
                    {/*Links de la empresa*/}
                    <Heading size="xl" color={'green.500'} margin={5}> Enlaces de la empresa </Heading>
                    <Field.Root required color={'green.500'} font={'bold'}>
                            <Field.Label htmlFor='websiteLinks' >Pagina Web</Field.Label>
                    </Field.Root>
                    <div  className='contenedor-company'>
                       
                        <Input
                            id="websiteLinks.website"
                            placeholder="Pagina Web"
                            name="websiteLinks.website"
                            value={newCompany.websiteLinks.website}
                            onChange={handleWebsiteChange}
                            color={'gray.500'}
                        />
                    </div>
                    <Heading size="xl" color={'green.500'} margin={5}> Redes Sociales </Heading>
                    <Show when ={newCompany.websiteLinks.socialMedia.length > 0}>
                        <Field.Root required color={'green.500'} font={'bold'}>
                            <Field.Label htmlFor='websiteLinks' >Lista Redes Sociales</Field.Label>
                        </Field.Root>
                    </Show>
                    <div className='contenedor-company'>

                        <Show when={newCompany.websiteLinks.socialMedia.length > 0}>
                            {newCompany.websiteLinks.socialMedia.map((redSocial, index) => (
                                <div key={index} className='listar-company'>
                                    <InputGroup startElement = {<RiGamepadLine />}>
                                        <Input
                                            id={`websiteLinks.socialMedia[${index}].platform`}
                                            placeholder="Plataforma"
                                            name={`websiteLinks.socialMedia[${index}].platform`}
                                            value={redSocial.platform}
                                            onChange={(e) => {
                                                const newSocialMedia = [...newCompany.websiteLinks.socialMedia];
                                                newSocialMedia[index].platform = e.target.value;
                                                setNewCompany((prevCompany) => ({
                                                    ...prevCompany,
                                                    websiteLinks: {
                                                        ...prevCompany.websiteLinks,
                                                        socialMedia: newSocialMedia,
                                                    },
                                                }));
                                            }}
                                            color={'gray.500'}
                                        />
                                    </InputGroup>
                                    <InputGroup startElement = {<CiLink />}>
                                        <Input
                                            id={`websiteLinks.socialMedia[${index}].link`}
                                            placeholder="Enlace"
                                            name={`websiteLinks.socialMedia[${index}].link`}
                                            value={redSocial.link}
                                            onChange={(e) => {
                                                const newSocialMedia = [...newCompany.websiteLinks.socialMedia];
                                                newSocialMedia[index].link = e.target.value;
                                                setNewCompany((prevCompany) => ({
                                                    ...prevCompany,
                                                    websiteLinks: {
                                                        ...prevCompany.websiteLinks,
                                                        socialMedia: newSocialMedia,
                                                    },
                                                }));
                                            }}
                                            color={'gray.500'}
                                        />
                                    </InputGroup>

                                </div>
                            ))}
                        </Show>
                    </div>
                    <Field.Root required color={'green.500'} font={'bold'}>
                        <Field.Label htmlFor='websiteLinks' >Agregar Red Social</Field.Label>
                    </Field.Root>
                    <div className='contenedor-company'>
                        <InputGroup startElement={<RiGamepadLine />}>
                            <Input
                                id="websiteLinks.socialMedia.platform"
                                placeholder="Plataforma"
                                name="websiteLinks.socialMedia.platform"
                                value={redSocial}
                                onChange={(e) => setRedSocial(e.target.value)}
                                color={'gray.500'}
                            />
                        </InputGroup>
                        <InputGroup startElement = {<CiLink />}>
                            <Input
                                id="websiteLinks.socialMedia.link"
                                placeholder="Enlace"
                                name="websiteLinks.socialMedia.link"
                                value={enlace}
                                onChange={(e) => setEnlace(e.target.value)}
                                color={'gray.500'}
                            />
                        </InputGroup>

                        <Button                  
                            onClick={handleAddRedSocial}
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
                    <Field.Root required color={'green.500'} font={'bold'}>
                        <Field.Label htmlFor='websiteLinks' >Descripcion de la empresa</Field.Label>
                    </Field.Root>
                    <div className='contenedor-company'>
                        <Textarea
                            id="description"
                            placeholder="Descripcion de la empresa"
                            name="description"
                            value={newCompany.description}
                            onChange={(e) => setDescription(e.target.value)}
                            color={'gray.500'}
                            autoresize
                            />
                    </div>

                    {/* Logo */}
                    <Field.Root required  color={'green.500'}>
                        <Field.Label htmlFor='logo' >Logo</Field.Label>
                    </Field.Root>
                    <Show when={newCompany.logo.url !== ''}>
                        <Image src={newCompany.logo.url || null}  alt = "logo" height="70px" alignSelf='flex-start' />
                    </Show>
                    <div className='contenedor-flex' mb={6}>
                        <InputGroup startElement={<LuFileImage />} >
                            <Input id="logo" type="file" placeholder="Logo" name='Logo'  onChange={handleLogoChange} />
                        </InputGroup>
                    </div>
                    <Button
                        w={'full'}
                        margin={12}
                        onClick={handleCreateCompany}
                        colorPalette={'teal'}
                        variant={'solid'}
                        color={'black'}
                        background={'green.500'}
                    >
        
                        Crear Empresa
                    </Button>
                </VStack>
            </Box>
            <Toaster />
        </VStack>
     </Container>
     
  )


}

export default CreateCompanyPage;