import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Stack, IconButton, useColorModeValue, AbsoluteCenter, useDisclosure, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Image, LinkOverlay, LinkBox, Spacer} from '@chakra-ui/react';
import firebase from 'firebase/compat/app';
import React from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BookmarkModel } from '../utils/models';

const firestore = firebase.firestore();
const bookmarksRef = firestore.collection('bookmarks');
const bms = await bookmarksRef.get();

function Bookmarks() {
    //modal open close
    const { isOpen, onOpen, onClose } = useDisclosure()

    //close modal and reset form after adding bookmark 
    const closeEverything = () => { 
        onClose();
        setLinkInput('');
        setTitleInput('');
    }

    //get bookmark title
    const [titleInput, setTitleInput] = useState('')

    //get bookmark link
    const [linkInput, setLinkInput] = useState('')
  
    const handleTitleInputChange = (e) => setTitleInput(e.target.value)
  
    const handleLinkInputChange = (e) => setLinkInput(e.target.value)
  
    const isTitleError = titleInput === ''
    const isLinkError = linkInput === ''

    const [bookmarks, setBookmarks] = useState<{ id: string; titleInput: string; linkInput: string; icon: string;}[]>([]);

    const bookmarkQueryById = (id) => bookmarksRef.where('id', '==', id);

    const bookmarkModels: BookmarkModel[] = [];

    bms.forEach(doc => {
        console.log(doc.id, '=>', doc.data().column);
        bookmarkModels.push({
          id: doc.data().id,
          titleInput: doc.data().titleInput,
          linkInput: doc.data().linkInput,
          icon: doc.data().icon,
        });
      });

    const saveBookmark = (bookmark: BookmarkModel) => {
        bookmarksRef.add(bookmark)
            .then(_ => console.log(`task added: ${bookmark.id}`));
    }

    const deleteBookmark = (bookmarkId: BookmarkModel['id']) => {
        bookmarkQueryById(bookmarkId)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => doc.ref.delete());
              console.log(`task deleted: ${bookmarkId}`);
            });
    }

    const addBookmarks = (e) => {
       e.preventDefault();
       saveBookmark({
            id: uuidv4(),
            titleInput: titleInput,
            linkInput: linkInput,
            icon: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://" + linkInput + "&size=24",
       });
       setBookmarks(prevBookmarks => [
        ...prevBookmarks,
        {
            id: uuidv4(),
            titleInput: titleInput,
            linkInput: linkInput,
            icon: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://" + linkInput + "&size=24",
        }
       ]);
       console.log(bookmarks)
    }

    const bookmarkElements = bookmarkModels.map((bookmark, index) => (
        <LinkBox>
            <Box key={bookmark.id} w="auto" pt="2" ml="1" my="2" pl={index === 0 ? '2' : '0'}>
                <LinkOverlay href={'https://' + bookmark.linkInput} target='_blank'>
                    <Button padding={5} leftIcon={<Image src={bookmark.icon}/>}>
                        {bookmark.titleInput}
                    </Button>
                </LinkOverlay>
                <IconButton
                    onClick={() => {deleteBookmark(bookmark.id)}}
                    position="absolute"
                    top={0}
                    right={0}
                    zIndex={100}
                    aria-label="delete-task"
                    size="md"
                    colorScheme="solid"
                    color={'gray.700'}
                    icon={<DeleteIcon />}
                    opacity={0}
                    _groupHover={{
                        opacity: 1,
                    }}
                    />
                <IconButton
                    position="absolute"
                    bottom={0}
                    right={0}
                    zIndex={100}
                    aria-label="delete-task"
                    size="md"
                    colorScheme="solid"
                    color={'gray.700'}
                    icon={<EditIcon />}
                    opacity={0}
                    _groupHover={{
                        opacity: 1,
                    }}
                    />
            </Box>
        </LinkBox>
    ));

    return (
        <>
            <Box position='relative' h='100px' margin='auto' w='1000px'>
                <AbsoluteCenter p='4' color='black' axis='both'>
                    <Stack direction={['column', 'row']} spacing='24px'>
                        <IconButton
                            size="xs"
                            w="50px"
                            h="70px"
                            color={useColorModeValue('gray.500', 'gray.400')}
                            bgColor={useColorModeValue('gray.100', 'gray.700')}
                            _hover={{ bgColor: useColorModeValue('gray.200', 'gray.600') }}
                            py={2}
                            onClick={onOpen}
                            variant="solid"
                            colorScheme="black"
                            aria-label="add-task"
                            icon={<AddIcon />}
                        />
                        <Stack
                            direction={{ base: 'column', md: 'row' }}
                            w={{ base: 300, md: 600 }}
                            h="70px"
                            bgColor={useColorModeValue('gray.50', 'gray.900')}
                            rounded="lg"
                            boxShadow="md"
                            overflow="auto"
                        >
                            {bookmarkElements}
                        </Stack>
                    </Stack>
                </AbsoluteCenter>
            </Box>
            
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Bookmarks</ModalHeader>
                    <ModalCloseButton color='black'/>
                    <ModalBody>
                        <FormControl isInvalid={isTitleError} isRequired>
                            <FormLabel>Title:</FormLabel>
                            <Input type='string' value={titleInput} onChange={handleTitleInputChange} />
                            {!isTitleError ? (
                                <FormHelperText>
                                    Enter a name for the bookmark.
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>Title is required.</FormErrorMessage>
                            )}
                            </FormControl>
                            <FormControl isInvalid={isLinkError} isRequired>
                                <FormLabel>Link (no https):</FormLabel>
                                <Input type='url' value={linkInput} onChange={handleLinkInputChange} />
                                {!isLinkError ? (
                                    <FormHelperText>
                                    Enter a link for the bookmark, do not include https
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>Link is required.</FormErrorMessage>
                                )}
                        </FormControl>
                    </ModalBody>
        
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={(e) => { addBookmarks(e); closeEverything(); }} isDisabled={isLinkError || isTitleError}>
                            Add bookmark
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Bookmarks