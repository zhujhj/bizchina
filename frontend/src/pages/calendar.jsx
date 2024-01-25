import firebase from "firebase/compat/app";
import { useEffect, useRef, useState } from "react";
import { DAYS } from "../calendar/conts";
import {
  DateControls,
  HeadDays,
  PortalWrapper,
  SeeMore,
  SevenColGrid,
  StyledEvent,
  Wrapper,
} from "../calendar/styled";
import {
  datesAreOnSameDay,
  getDarkColor,
  getDaysInMonth,
  getMonthYear,
  getSortedDays,
  nextMonth,
  prevMonth
} from "../calendar/utils";

import Navbar from '../Navbar.jsx';


import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


import theme from '../dashboard/config/theme.ts';
import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './dashboard.css'


import { getAuth } from "firebase/auth";

const auth = getAuth();
const firestore = firebase.firestore();


const usersCollection = firestore.collection('users');
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
    <>
      <CalendarContent tasks={tasks} events2={events} loading={loading} />
    </>
  );
};

const CalendarContent = ({ tasks, events2, loading }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 12, 1));
  const [events, setEvents] = useState([]);
  const dragDateRef = useRef();
  const dragIndexRef = useRef();
  const [showPortal, setShowPortal] = useState(false);
  const firestore = firebase.firestore();
  const [portalData, setPortalData] = useState({});
  const citiesRef = firestore.collection('tasks');

  const usersCollection = firestore.collection('users');
  const [currentDepartment, setCurrentDepartment] = useState('');

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
          addDashboardEvent(new Date(task.deadline), task.title, task.color, task.dsc);
        }
      });

      events2.forEach(event => {
        // console.log("Retrieved from FB: ", new Date(event.date));
        addDashboardEvent(new Date(event.date), event.title, event.color, "Event Placeholder");
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

  const addEvent = (date, event) => {
    if (!event.target.classList.contains("StyledEvent")) {
      const text = window.prompt("name");
      if (text) {
        date.setHours(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        setEvents((prev) => [
          ...prev,

          { date, title: text, color: getDarkColor() }
        ]);
        
        const formattedDate = new Date(date).toLocaleDateString('en-US'); // changes date to MM/DD/YYYY
        console.log("FORMATTED: ", formattedDate);
        eventsCollection.add({ date: formattedDate, title: text, dsc: ''}) // adds event to firestore
      }
    }
  };

  const addDashboardEvent = (date, description, color, dsc) => {
    // Assuming date is a Date object with the correct date and no time component
    date.setHours(0, 0, 0, 0); // Reset the time component to avoid timezone issues

    setEvents((prev) => {
      // Check if the event already exists in the array to prevent duplicates
      const exists = prev.some(ev => ev.title === description && datesAreOnSameDay(ev.date, date));
      if (!exists) {

        console.log(color);
        return [...prev, {date, title: description, color: getDarkColor(), dsc: dsc}];

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
    // toLocaleDateString can be adjusted with options for different locales and display options
    const dateString = date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

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
        <DateControls>
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
                  key={`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`}
                  onClick={(e) =>
                      addEvent(
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
      </Wrapper>
  );
}

export default Calendar;
