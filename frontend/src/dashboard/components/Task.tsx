import { DeleteIcon } from '@chakra-ui/icons';
import { EditIcon } from '@chakra-ui/icons';
import { Box, IconButton, ScaleFade, Text, useDisclosure, Modal, ModalBody, ModalHeader, ModalContent, ModalOverlay, ModalCloseButton, Select, FormLabel, Input, Button } from '@chakra-ui/react';
import _ from 'lodash';
import React, { memo, useState } from 'react';
import { useTaskDragAndDrop } from '../hooks/useTaskDragAndDrop.ts';
import useColumnTasks from '../hooks/useColumnTasks.ts';
import { TaskModel } from '../utils/models';
import { AutoResizeTextarea } from './AutoResizeTextArea.tsx';
import { Dropdown } from 'react-chat-engine-advanced';

type TaskProps = {
  index: number;
  task: TaskModel;
  onUpdate: (id: TaskModel['id'], updatedTask: TaskModel) => void;
  onDelete: (id: TaskModel['id']) => void;
  onDropHover: (i: number, j: number) => void;
};

function Task({
  index,
  task,
  onUpdate: handleUpdate,
  onDropHover: handleDropHover,
  onDelete: handleDelete,
}: TaskProps) {
  const { ref, isDragging } = useTaskDragAndDrop<HTMLDivElement>(
    { task, index: index },
    handleDropHover,
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    handleUpdate(task.id, { ...task, title: newTitle });
  };

  const handleEdit = (to: string, from: string, deadline) => {
    console.log("handle edit");
    handleUpdate(task.id, { ...task, to: to, from: from, deadline: deadline });
  };

  const handleDeleteClick = () => {
    handleDelete(task.id);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleUpdateButton = () => {
    onOpen();
  };

  const [newTo, setNewTo] = useState('');
  const [newFrom, setNewFrom] = useState('');
  const [newDate, setNewDate] = useState('');

  console.log(task.dsc);

  return (
    <ScaleFade in={true} unmountOnExit>
      <Box
        ref={ref}
        as="div"
        role="group"
        position="relative"
        rounded="lg"
        w={200}
        pl={3}
        pr={7}
        pt={3}
        pb={1}
        boxShadow="xl"
        cursor="grab"
        fontWeight="bold"
        userSelect="none"
        bgColor={task.color}
        opacity={isDragging ? 0.5 : 1}
      >
        <IconButton
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
          onClick={handleDeleteClick}
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
          onClick={handleUpdateButton}
        />
        <AutoResizeTextarea
          value={task.title}
          fontWeight="semibold"
          cursor="inherit"
          border="none"
          p={0}
          m={0}
          resize="none"
          minH={70}
          maxH={200}
          focusBorderColor="none"
          color="gray.700"
          onChange={handleTitleChange}
        />
        <Text
          fontWeight="semibold"
          fontSize={14}
          cursor="inherit"
          border="none"
          p={0}
          m={0}
          resize="none"
          color="gray.700"
          align='left'>To: {task.to}
        </Text>
        <Text
          fontWeight="semibold"
          fontSize={14}
          cursor="inherit"
          border="none"
          p={0}
          m={0}
          resize="none"
          color="gray.700"
          align='left'>From: {task.from}
        </Text>
        <Text
          fontWeight="semibold"
          fontSize={14}
          cursor="inherit"
          border="none"
          p={0}
          m={0}
          resize="none"
          color="gray.700"
          align='left'>
            {/* Date: {task.deadline.toString()} */}
            Deadline: {task.deadline.toString()}
        </Text>
        <Text
          fontWeight="semibold"
          fontSize={14}
          cursor="inherit"
          border="none"
          p={0}
          m={0}
          resize="none"
          color="gray.700"
          align='left'>Description: {task.dsc}
        </Text>
        {/* Edit modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>
            <ModalContent pb={3.5}>
              <ModalHeader pb={0}>Edit Task</ModalHeader>
              <ModalCloseButton color='black'/>
              <ModalBody>
              <FormLabel>Department To:</FormLabel>
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
                <FormLabel>Department From:</FormLabel>
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
                <FormLabel>Deadline</FormLabel>
                  <Input
                    mb={4}
                    type='date'
                    placeholder="Deadline"
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                <Button colorScheme="blue" onClick={() => {
                  handleEdit(newTo, newFrom, newDate); onClose()}
                }
                >
                  Confirm
                </Button>
              </ModalBody>
            </ModalContent>
        </Modal>
      </Box>
    </ScaleFade>
  );
}
export default memo(Task, (prev, next) => {
  if (
    _.isEqual(prev.task, next.task) &&
    _.isEqual(prev.index, next.index) &&
    prev.onDelete === next.onDelete &&
    prev.onDropHover === next.onDropHover &&
    prev.onUpdate === next.onUpdate
  ) {
    return true;
  }

  return false;
});
