import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";
import FeelingsChart from './Chart';

const localizer = momentLocalizer(moment);


const EditableCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState(new Date());
  const [newEnd, setNewEnd] = useState(new Date());

  useEffect(() => {
    // Load events from local storage
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(storedEvents);
  }, []);

  const handleSelectSlot = ({ start }) => {
    setSelectedEvent(null);
    setNewTitle('');
    setNewStart(start);
    setNewEnd(start);
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewTitle(event.title.split('\n')[0]);
    setNewStart(event.start);
    setNewEnd(event.end);
    setModalOpen(true);
  };

  const handleAddEvent = async () => {
    const genAI = new GoogleGenerativeAI("AIzaSyCt7eqEi2lGqexbx9RwZy67NB2E_d6rHRQ");

    async function analyzeSentiment(text) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Analyze this text and provide a feeling in one word: "${text}". Options: Elated, Happy, Neutral, Bad, Depressed.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    }

    const feeling = await analyzeSentiment(newTitle);

    // Suggestions
    // async function analyzeSentiment1(userInput) {
    //   const modelInstance = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    //   const promptText = `Based on the feeling: "${userInput}", generate a short suggestion to improve the user's experience also don't use any * or **.`;
    //   const generatedContent = await modelInstance.generateContent(promptText);
    //   const resultResponse = await generatedContent.response;
    //   return resultResponse.text().trim();
    // }
    
    // const suggestion = await analyzeSentiment1(feeling);
    // console.log('suggestion - ',suggestion);
    

    
    const emojiMap = {
      Elated: '😊',
      Happy: '😄',
      Neutral: '😐',
      Bad: '😞',
      Depressed: '😢',
    };

    const emoji = emojiMap[feeling] || '😶';
    console.log('newTitle - ',newTitle);

    const newEvent = {
      title: `${newTitle}`,
      start: newStart,
      end: newEnd,
      feeling,
      emoji,
    };

    setEvents([...events, newEvent]);
    localStorage.setItem('events', JSON.stringify([...events, newEvent]));
    handleCloseModal();
  };

  const handleUpdateEvent = async () => {
    const updatedEvents = events.map(async (e) => {
      if (e === selectedEvent) {
        const genAI = new GoogleGenerativeAI("AIzaSyCt7eqEi2lGqexbx9RwZy67NB2E_d6rHRQ");
  
        async function analyzeSentiment(text) {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `Analyze this text and provide a feeling in one word: "${text}". Options: Elated, Happy, Neutral, Bad, Depressed.`;
          const result = await model.generateContent(prompt);
          const response = await result.response;
          return response.text().trim();
        }
  
        const feeling = await analyzeSentiment(newTitle);

        // Suggestions
        // async function analyzeSentiment1(userInput) {
        //   const modelInstance = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        //   const promptText = `Based on the feeling: "${userInput}", generate a short suggestion to improve the user's experience also don't use any * or **.`;
        //   const generatedContent = await modelInstance.generateContent(promptText);
        //   const resultResponse = await generatedContent.response;
        //   return resultResponse.text().trim();
        // }
        
        // const suggestion = await analyzeSentiment1(feeling);
        // console.log('suggestion - ',suggestion);

        const emojiMap = {
          Elated: '😊',
          Happy: '😄',
          Neutral: '😐',
          Bad: '😞',
          Depressed: '😢',
        };
        const emoji = emojiMap[feeling] || '😶';
  
        return { ...e, title: newTitle, start: newStart, end: newEnd, feeling, emoji, suggestion };
      }
      return e;
    });
  
    const resolvedEvents = await Promise.all(updatedEvents);
    setEvents(resolvedEvents);
    localStorage.setItem('events', JSON.stringify(resolvedEvents));
    handleCloseModal();
  };
  
  

  const handleDeleteEvent = () => {
    setEvents(events.filter((e) => e !== selectedEvent));
    localStorage.setItem('events', JSON.stringify(events.filter((e) => e !== selectedEvent)));
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // Custom Event Component
  const CustomEvent = ({ event }) => (
    <div>
      <div>{event.title}</div>
      <div style={{ fontSize: '0.9em' }}>
        Feeling : {event.feeling}
      </div>
      <div>Emoji : {event.emoji}</div>
    </div>
  );

  return (
    <div style={{ height: 700 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 500 }}
        views={['month','agenda']}
        defaultView="month"
        components={{
          event: CustomEvent,
        }}
      />

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="event-modal-title" variant="h6" component="h2">
            {selectedEvent ? 'Edit Event' : 'Add New Event'}
          </Typography>
          <TextField
            fullWidth
            label="Event Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Date & Time"
            value={moment(newStart).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setNewStart(newDate);
              setNewEnd(newDate);
            }}
            sx={{ mb: 3 }}
          />
          <Box display="flex" justifyContent="space-between">
            {selectedEvent ? (
              <>
                <Button variant="contained" color="primary" onClick={handleUpdateEvent}>
                  Update
                </Button>
                <Button variant="outlined" color="error" onClick={handleDeleteEvent}>
                  Delete
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={handleAddEvent}>
                Add
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
      <FeelingsChart events={events}/>
    </div>
  );
};

export default EditableCalendar;
