import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import Navbar from '../Navbar';

const UserProfile = () => {
  const user = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    bio: 'Passionate developer exploring the world of React and Chakra UI.',
    avatarUrl: 'https://placekitten.com/200/200', // Placeholder image
  };

  return (
    <main>
        <div className='navbar-container'>
          <Navbar user={user} />
      </div>
    <Box p={4} maxW="600px" mx="auto">
      <Flex align="center" mb={4}>
        <Avatar size="xl" name={user.name} src={user.avatarUrl} />
        <Spacer />
        <Button color="black" background="grey">Edit Profile</Button>
      </Flex>

      <VStack align="start" spacing={4}>
        <Heading size="lg">{user.name}</Heading>
        <Text fontSize="md" color="grey">@{user.username}</Text>
        <Text fontSize="md" color="grey">{user.email}</Text>

        <Text fontSize="md" color="grey">{user.bio}</Text>

        {/* Add more profile details as needed */}
      </VStack>
    </Box>
    </main>
  );
};

export default UserProfile;
