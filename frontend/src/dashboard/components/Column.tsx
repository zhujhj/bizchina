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
import React, { useState } from 'react';
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

const ColumnColorScheme: Record<ColumnType, string> = {
  Todo: 'gray',
  'In Progress': 'blue',
  Blocked: 'red',
  Completed: 'green',
};

function Column({ column }: { column: ColumnType }) {
  //changed
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleAddButtonClick = () => {
    onOpen();
    // You can perform additional logic here if needed
  };
  const [newTaskName, setNewTaskName] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newFrom, setNewFrom] = useState('');
  const [newDate, setNewDate] = useState('');
  // changed
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
      <button className='send-button' onClick={handleAddButtonClick}>Send A Task!</button>
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your modal content here */}
            {/* For example, you can include a form to add a new task */}
            Task Name
            {/* <FormControl isInvalid={newTaskName === ''}> */}
              <Input
                mb={4}
                placeholder="Task Name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
              {/* {!(newTaskName === '') ? ('') : (
                  <FormErrorMessage pt={0} mt={0}>Task name is required.</FormErrorMessage>
                )}
            </FormControl> */}
            Department To:
            <Select
                mb={4}
                placeholder="Select To"
                value={newTo}
                onChange={(e) => setNewTo(e.target.value)}
            >
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Corporate Relations">Corporate Relations</option>
                <option value="English Department">English Department</option>
                <option value="Chinese Department">Chinese Department</option>
                <option value="Finance">Finance</option>
                <option value="Events">Events</option>
                <option value="Prez">Prez</option>

            </Select>
            Department From:
            <Select
                mb={4}
                placeholder="Select From"
                value={newFrom}
                onChange={(e) => setNewFrom(e.target.value)}
            >
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Corporate Relations">Corporate Relations</option>
                <option value="English Department">English Department</option>
                <option value="Chinese Department">Chinese Department</option>
                <option value="Finance">Finance</option>
                <option value="Events">Events</option>
                <option value="Prez">Prez</option>
            </Select>
            Deadline
            <Input
              mb={4}
              type='date'
              placeholder="Deadline"
              onChange={(e) => setNewDate(e.target.value)}
            />
            <Button colorScheme="blue" onClick={() => {
              if (newTaskName.trim() === '' || newTo.trim() === '' || newFrom.trim() === '' || newDate.trim() === '') {
                  alert("Please fill in all fields");
              } else {
                addEmptyTask({
                  id: uuidv4(),
                  column,
                  title: newTaskName,
                  color: pickChakraRandomColor('.300'),
                  to: newTo,
                  from: newFrom,
                  deadline: newDate,
                }); onClose();
              }}}
            >
              Add Task
            </Button>
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
