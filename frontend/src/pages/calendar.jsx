import firebase from "firebase/compat/app";
import { useEffect, useRef, useState } from "react";
import { DAYS, MOCKAPPS } from "../calendar/conts";
import {
  DateControls,
  HeadDays,
  PortalWrapper,
  SeeMore,
  SevenColGrid,
  StyledEvent,
  Wrapper
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


import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { getAuth } from "firebase/auth";

const auth = getAuth();
const firestore = firebase.firestore();

const usersRef = firestore.collection('users');

export const Calendar = () => {

  const [tasks, setTasks] = useState([]); // Renamed to tasks for clarity
  const [loading, setLoading] = useState(true);


  const collection = firestore.collection("tasks");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await collection.get();
        const newTasks = querySnapshot.docs.map(doc => doc.data());
        setTasks(newTasks); // Correctly update tasks state
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
      setLoading(false);
    };
  
    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <CalendarContent tasks={tasks} loading={loading} />
  );
};

const CalendarContent = ({ tasks, loading }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 12, 1));
  const [events, setEvents] = useState(MOCKAPPS);
  const dragDateRef = useRef();
  const dragIndexRef = useRef();
  const [showPortal, setShowPortal] = useState(false);
  const firestore = firebase.firestore();
  const [portalData, setPortalData] = useState({});
  const citiesRef = firestore.collection('tasks');
  const usersRef = firestore.collection('users');
  const [currentDepartment, setCurrentDepartment] = useState('');

  var email = "";
  

  


  useEffect(() => {
    // Fetch user's department first
    usersRef.get().then(snapshot => {
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
        console.log(task.to); 
        console.log("4");
        console.log(currentDepartment);
        if (task.to === currentDepartment) {
          addDashboardEvent(new Date(task.deadline), task.title, task.color);
        }
      });
    });
  }, [tasks]);

  
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


  

  

  const addDashboardEvent = (date, description, color) => {
    
      // console.log(color);
        setEvents((prev) => [
          ...prev,
          { date, title: description, color: "green"}
        ]);
      
  };

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
      }
    }
  };

  const drag = (index, e) => {
    dragIndexRef.current = { index, target: e.target };
  };

  const onDragEnter = (date, e) => {
    e.preventDefault();
    dragDateRef.current = { date, target: e.target.id };
  };

  const drop = (ev) => {
    ev.preventDefault();

    setEvents((prev) =>
      prev.map((ev, index) => {
        if (index === dragIndexRef.current.index) {
          ev.date = dragDateRef.current.date;
        }
        return ev;
      })
    );
  };

  const handleOnClickEvent = (event) => {
    setShowPortal(true);
    setPortalData(event);
  };

  const handlePotalClose = () => setShowPortal(false);

  const handleDelete = () => {
    setEvents((prevEvents) =>
      prevEvents.filter((ev) => ev.title !== portalData.title)
    );
    handlePotalClose();
  };

  const Portal = ({ title, date, handleDelete, handlePotalClose }) => {
    return (
      <PortalWrapper>
        <h2>{title}</h2>
        <p>{date.toDateString()}</p>
        <ion-icon onClick={handleDelete} name="trash-outline"></ion-icon>
        <ion-icon onClick={handlePotalClose} name="close-outline"></ion-icon>
      </PortalWrapper>
    );
  };

  const EventWrapper = ({ children }) => {
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
    <SevenColGrid>
      {DAYS.map((day) => (
        <HeadDays className="nonDRAG">{day}</HeadDays>
      ))}
    </SevenColGrid>

    <SevenColGrid
      $fullheight={true}
      $is28Days={getDaysInMonth(currentDate) === 28}
    >
      {getSortedDays(currentDate).map((day) => (
        <div
          id={`${currentDate.getFullYear()}/${currentDate.getMonth()}/${day}`}
          onDragEnter={(e) =>
            onDragEnter(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              ),
              e
            )
          }
          onDragOver={(e) => e.preventDefault()}
          onDragEnd={drop}
          onClick={(e) =>
            addEvent(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              ),
              e
            )
          }
        >
          <span
            className={`nonDRAG ${
              datesAreOnSameDay(
                new Date(),
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                )
              )
                ? "active"
                : ""
            }`}
          >
            {day}
          </span>
          <EventWrapper>
            {events?.map(
              (ev, index) =>
                datesAreOnSameDay(
                  ev.date,
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  )
                ) && (
                  <StyledEvent key={`${ev.title}-${index}`} //
                    onDragStart={(e) => drag(index, e)}
                    onClick={() => handleOnClickEvent(ev)}
                    draggable
                    className="StyledEvent"
                    id={`${ev.color} ${ev.title}`}
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
        handleDelete={handleDelete}
        handlePotalClose={handlePotalClose}
      />
    )}
    
  </Wrapper>
  


)}
export default Calendar;