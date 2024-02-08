import { AddIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../../pages/dashboard.css';
import useColumnDrop from '../hooks/useColumnDrop.ts';
import useColumnTasks from '../hooks/useColumnTasks.ts';
import { ColumnType } from '../utils/enums.ts';
import { pickChakraRandomColor } from '../utils/helpers.ts';
import Task from './Task.tsx';
import { Select } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import axios from "axios/index";
import firebase from 'firebase/compat/app';

const ColumnColorScheme: Record<ColumnType, string> = {
  Todo: 'gray',
  'In Progress': 'blue',
  Blocked: 'red',
  Completed: 'green',
};

function Column({ column,chatUser }: { column: ColumnType, chatUser:any }) {
  // for add modal
  const { isOpen: isAddTaskModalOpen, onOpen: openAddTaskModal, onClose: closeAddTaskModal } = useDisclosure();

  // For "Send Task" modal
  const { isOpen: isSendTaskModalOpen, onOpen: openSendTaskModal, onClose: closeSendTaskModal } = useDisclosure();
  const handleAddButtonClick = () => {
    openAddTaskModal();
  };

  const handleSendButtonClick = () => {
    openSendTaskModal();
  };
  const [newTaskName, setNewTaskName] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newFrom, setNewFrom] = useState('');
  const [newDate, setNewDate] = useState('');
  const [description, setNewDescription] = useState('');

  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const firestore = firebase.firestore();
  const tasksCollection = firestore.collection('tasks');
  const {
    tasks,
    addEmptyTask,
    deleteTask,
    dropTaskFrom,
    swapTasks,
    updateTask,
  } = useColumnTasks(column);

  const { dropRef, isOver } = useColumnDrop(column, dropTaskFrom);

  const ColumnTasks = tasks.map((task, index) => (
      <Task
          key={task.id}
          task={task}
          index={index}
          onDropHover={swapTasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
      />
  ));

  return (
      <Box>
        <Heading fontSize="md" mb={4} letterSpacing="wide">
          <Badge
              px={2}
              py={1}
              rounded="lg"
              colorScheme={ColumnColorScheme[column]}
          >
            {column}
          </Badge>
        </Heading>
        <IconButton
            size="xs"
            w="full"
            color={useColorModeValue('gray.500', 'gray.400')}
            bgColor={useColorModeValue('gray.100', 'gray.700')}
            _hover={{ bgColor: useColorModeValue('gray.200', 'gray.600') }}
            py={2}
            variant="solid"
            // onClick={addEmptyTask} // changed
            onClick={handleAddButtonClick} // changed
            colorScheme="black"
            aria-label="add-task"
            icon={<AddIcon />}
        />
        <button className='send-button' onClick={handleSendButtonClick}>Send A Task!</button>
        <Modal isOpen={isAddTaskModalOpen} onClose={closeAddTaskModal} size="md">
          <ModalOverlay />
          <ModalContent pb={3.5}>
            <ModalHeader>Add Task</ModalHeader>
            <ModalCloseButton color='black'/>
            <ModalBody>
              {/* Add your modal content here */}
              {/* For example, you can include a form to add a new task */}
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    mb={4}
                    placeholder="Task Name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <textarea className='text' value = {description} onChange={(e) => setNewDescription(e.target.value)}> </textarea>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Deadline</FormLabel>
                <Input
                    mb={4}
                    type='date'
                    placeholder="Deadline"
                    onChange={(e) => setNewDate(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="blue" onClick={() => {
                if (newTaskName.trim() === '' || description.trim() === ''|| newDate.trim() === '') {
                  openModal();
                } else {
                  addEmptyTask({
                    id: uuidv4(),
                    column,
                    title: newTaskName,
                    dsc: description,
                    color: pickChakraRandomColor('.300'),
                    to: chatUser.department,
                    from: chatUser.department,
                    deadline: newDate,
                  }); closeAddTaskModal();
                  // resets parameters
                  setNewTaskName('');
                  setNewDescription('');
                  setNewTo('');
                  setNewFrom('');
                  setNewDate('');
                }}}
              >
                Add Task
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal isOpen={isSendTaskModalOpen} onClose={closeSendTaskModal} size="md">
          <ModalOverlay />
          <ModalContent pb={3.5}>
            <ModalHeader>Send Task</ModalHeader>
            <ModalCloseButton color='black' />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    mb={4}
                    placeholder="Task Name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <textarea className='text' value = {description} onChange={(e) => setNewDescription(e.target.value)}> </textarea>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Department To:</FormLabel>
                <Select
                    mb={4}
                    value={newTo}
                    placeholder="Select To"
                    onChange={(e) => setNewTo(e.target.value)}
                >
                  {["IT", "HR", "Corporate Relations", "English Marketing", "Chinese Marketing", "Finance", "Events", "Prez"]
                      .filter((option) => option!= chatUser.department)
                      .map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                      ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Deadline</FormLabel>
                <Input
                    mb={4}
                    type='date'
                    placeholder="Deadline"
                    onChange={(e) => setNewDate(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="blue" onClick={() => {
                if (newTaskName.trim() === '' || description.trim() === ''|| newDate.trim() === '') {
                  openModal();
                } else {
                  tasksCollection.add({
                    id: uuidv4(),
                    column:'Todo',
                    title: newTaskName,
                    dsc: description,
                    color: pickChakraRandomColor('.300'),
                    to: newTo,
                    from: chatUser.department,
                    deadline: newDate,
                  }); closeSendTaskModal();
                  // resets parameters
                  setNewTaskName('');
                  setNewDescription('');
                  setNewTo('');
                  setNewFrom('');
                  setNewDate('');
                }}}
              >
                Add Task
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
        {/* error modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay/>
          <ModalContent pb={4}>
            <ModalHeader pb={0}>Error</ModalHeader>
            <ModalCloseButton color='black'/>
            <ModalBody>
              Please fill in all fields.
            </ModalBody>
          </ModalContent>
        </Modal>

        <Stack
            ref={dropRef}
            direction={{ base: 'row', md: 'column' }}
            h={{ base: 300, md: 600 }}
            p={4}
            mt={2}
            spacing={4}
            bgColor={useColorModeValue('gray.50', 'gray.900')}
            rounded="lg"
            boxShadow="md"
            overflow="auto"
            opacity={isOver ? 0.85 : 1}
        >
          {ColumnTasks}
        </Stack>
      </Box>
  );
}

export default Column;