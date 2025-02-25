# The Event Prophet - Campus Event Management System

A dynamic web application for campus event management so that you are aware of the university events that are happening.

## Features ✨

- User authentication (Login/Signup)
- Create, read, update, and delete events
- RSVP management system
- User-specific event management
- Real-time event updates

## Technologies Used 🛠️

- Node.js
- Express.js
- HTML
- MongoDB
- JavaScript

## Getting Started 🚀

```bash
# Clone the repository
git clone https://github.com/yourusername/the-event-prophet.git

# Install dependencies
cd the-event-prophet
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm start

```

## Usage 📝

1. Register a new account or login with existing credentials
2. Browse through campus events
3. Create your own events with details like:
    - Event title
    - Event highlights
    - Detailed description
    - Location
    - Category
    - Start and end date/time
4. Manage RSVPs for events
5. Edit or delete events you've created

## Sample Event Format 📋

```json
{
  "title": "Mathematical Problem Solving Session",
  "rsvpCount": 1,
  "host": "ABC",
  "highlight": "Strengthen your problem-solving skills with group discussions and expert guidance",
  "details": "A study group focused on tackling complex mathematical problems and preparing for upcoming exams, with the support of peers and instructors",
  "location": "UNC Charlotte, Science Building, Room 101",
  "category": "Study Groups",
  "startDateTime": "2025-01-01T19:30:00",
  "endDateTime": "2025-01-01T20:30:00"
}

```

## Author 

Nishi Mewada
Yash Patil
