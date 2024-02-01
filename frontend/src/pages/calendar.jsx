import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import { DAYS } from "../calendar/conts";

import {
  DateControls, HeadDays, PortalWrapper, SeeMore, SevenColGrid, StyledEvent, Wrapper,
} from "../calendar/styled";

import {
  datesAreOnSameDay, getDarkColor, getDaysInMonth, getMonthYear, getSortedDays, nextMonth, prevMonth
} from "../calendar/utils";

import {
  Box, Button,
  ChakraProvider,
  FormControl, FormLabel,
  Input,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure
} from '@chakra-ui/react';

import theme from '../dashboard/config/theme.ts';

import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './calendar.css';
import './dashboard.css';


import { getAuth } from "firebase/auth";

const auth = getAuth();
const firestore = firebase.firestore();

const eventsCollection = firestore.collection('events');

export const Calendar = () => {

  const [tasks, setTasks] = useState([]); // Renamed to tasks for clarity
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);


  const collection = firestore.collection("tasks");
  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await collection.get();
        const newTasks = querySnapshot.docs.map(doc => doc.data());
        setTasks(newTasks); // Correctly update tasks state

        const eventsSnapshot = await eventsCollection.get();
        const newEvents = eventsSnapshot.docs.map(doc => doc.data());
        setEvents(newEvents); // Correctly update events state

      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
      setLoading(false);
    };
  
    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  return (
      <CalendarContent tasks={tasks} events2={events} loading={loading} />
  );
};

const CalendarContent = ({ tasks, events2, loading }) => {
  let { user } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date(2023, 12, 1));
  const [events, setEvents] = useState([]);
  const [showPortal, setShowPortal] = useState(false);
  const firestore = firebase.firestore();
  const [portalData, setPortalData] = useState({});

  const usersCollection = firestore.collection('users');
  const [currentDepartment, setCurrentDepartment] = useState('');

  // -=-=- For Modal/Form when adding event upon clicking a date -=-=-
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newEventName, setNewEventName] = useState('');
  const [description, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure(); // for error modal

  const handleAddEventClick = (date, event) => {
    if (!event.target.classList.contains("StyledEvent")) { // if clicking on an event and not an empty spot on calendar, DONT open modal/form
      onOpen(); // open modal/form
      setNewDate(date);
    }
  };
  // -=-=-=-=-=-

  var email = "";
  useEffect(() => {

    // Fetch user's department first
    usersCollection.get().then(snapshot => {

      if (snapshot.empty) {
        console.log('No matching documents.');
      } else {
        snapshot.docs.forEach(doc => {
          if (doc.data().email === email) {
            console.log("3");
            console.log(doc.data().department);
            setCurrentDepartment(doc.data().department);
          }
        });
      }
    }).then(() => {
      // This will run after the above async operation is completed
      tasks.forEach(task => {

        if (task.to === currentDepartment) {
          addDashboardEvent(new Date(task.deadline), task.title, task.dsc);
        }
      });

      events2.forEach(event => {
        addDashboardEvent(new Date(event.date), event.title, event.dsc);
      });
    });
  }, [tasks, events2]);

  
  firebase.auth().onAuthStateChanged((user) => {
    if (user && user.email) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/v8/firebase.User
      email = user.email;
      // console.log("hello " + user.email);
      // console.log("user is signed in")
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const addEvent = () => {
      setEvents((prev) => [
        ...prev,
        
        { date: newDate, title: newEventName, dsc: description, color: getDarkColor() }
      ]);

      const formattedDate = new Date(newDate).toLocaleDateString('en-US'); // changes date to MM/DD/YYYY
      eventsCollection.add({ date: formattedDate, title: newEventName, dsc: description}) // adds event to firestore
  }

  const addDashboardEvent = (date, title, dsc) => {
    // Assuming date is a Date object with the correct date and no time component
    date.setHours(0, 0, 0, 0); // Reset the time component to avoid timezone issues

    setEvents((prev) => {
      // Check if the event already exists in the array to prevent duplicates
      const exists = prev.some(ev => ev.title === title && datesAreOnSameDay(ev.date, date));
      if (!exists) {

        return [...prev, {date, title: title, color: getDarkColor(), dsc: dsc}];

      }
      return prev; // Return the previous state if the event already exists
    });
  };

  const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
  };


  const handleOnClickEvent = (event) => {
    setShowPortal(true);
    setPortalData(event);
  };

  const handlePotalClose = () => setShowPortal(false);


  // const handleDelete = () => {
  //   setEvents((prevEvents) =>
  //       prevEvents.filter((ev) => ev.title !== portalData.title)
  //   );
  //   handlePotalClose();
  // };

  const Portal = ({title, date, handleDelete, handlePotalClose, color, dsc}) => {
    let dummyDate = date;
    dummyDate.setDate(date.getDate() + 1); // to avoid timezone issues
    // toLocaleDateString can be adjusted with options for different locales and display options
    const dateString = dummyDate.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    date.setDate(date.getDate() - 1); // reset date to original value (to avoid timezone issues

    return (
        <PortalWrapper>
          <h2>{dsc}</h2>
          <p>{dateString}</p>
          <ion-icon onClick={handlePotalClose} name="close-outline"></ion-icon>
        </PortalWrapper>
    );
  };
  const EventWrapper = ({children}) => {
    if (children.filter((child) => child).length)
      return (
          <>
            {children}
            {children.filter((child) => child).length > 2 && (
                <SeeMore
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("clicked p");
                    }}
                >
                  see more...
                </SeeMore>
            )}
          </>
      );
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  return (

    
      <Wrapper>
        <div className='navbar-container'>
            <Navbar user={user} />
        </div>
        <div className='calendar-container'>
        <DateControls className="mt-[100px">
          <ion-icon
              onClick={() => prevMonth(currentDate, setCurrentDate)}
              name="arrow-back-circle-outline"
          ></ion-icon>
          {getMonthYear(currentDate)}
          <ion-icon
              onClick={() => nextMonth(currentDate, setCurrentDate)}
              name="arrow-forward-circle-outline"
          ></ion-icon>
        </DateControls>

        <HeadDays>
          {DAYS.map((day) => (
              <HeadDays>{day}</HeadDays>
          ))}
        </HeadDays>

        <SevenColGrid
            $fullheight={true}
            $is28Days={getDaysInMonth(currentDate) === 28}
        >
          {getSortedDays(currentDate).map((day) => (
              <div
                  key={`key placeholder`}
                     onClick={(e) =>
                      handleAddEventClick(
                          new Date(Date.UTC(
                              currentDate.getFullYear(),
                              currentDate.getMonth(),
                              day
                          )),
                          e
                      )
                  }
              >
              
          <span
              className={`nonDRAG ${
                  isToday(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) ? "active" : ""
              }`}
          >

            {day}
          </span>
                <EventWrapper>
                  {events?.map(
                      (ev, index) =>
                          datesAreOnSameDay(
                              ev.date,
                              new Date(Date.UTC(
                                  currentDate.getFullYear(),
                                  currentDate.getMonth(),
                                  day
                              )),
                          ) && (
                              <StyledEvent
                                  key={`${ev.title}-${index}`}
                                  onClick={() => handleOnClickEvent(ev)}
                                  className="StyledEvent"
                                  bgColor={ev.color}
                              >
                                {ev.title}
                              </StyledEvent>
                          )
                  )}
                </EventWrapper>
              </div>
          ))}
        </SevenColGrid>
        {showPortal && (
            <Portal
                {...portalData}
                // handleDelete={handleDelete}
                handlePotalClose={handlePotalClose}
            />
        )}

      {/* Modal/Form for adding event when clicking on a date */}
      <ChakraProvider theme={theme}>
        <Box>
          <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
            <ModalContent pb={3.5}>
              <ModalHeader>Add Event</ModalHeader>
              <ModalCloseButton color='black'/>
              <ModalBody>

                {/* Add your modal content here */}
                {/* For example, you can include a form to add a new task */}
                <FormControl isRequired>
                  <FormLabel>Event Name</FormLabel>
                  <Input
                    mb={4}
                    placeholder="Name"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <textarea className='text' value = {description} onChange={(e) => setNewDescription(e.target.value)}> </textarea>
                </FormControl>

                <Button colorScheme="blue" onClick={() => {
                  if (newEventName.trim() === '' || description.trim() === '') { // open error pop up if an input is empty
                      openModal();
                  } else {
                    addEvent();
                    onClose(); // close modal

                    // resets parameters
                    setNewEventName('');
                    setNewDescription('');
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

        </Box>
      </ChakraProvider>
      </div>
    </Wrapper>
  );
}

export default Calendar;
