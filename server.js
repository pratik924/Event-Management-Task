const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

let events = [
  {
    id: "1",
    name: "Diwali Event",
    date: "2026-11-08",
    location: "Indore",
    attendees: ["Students"],
  },
  {
    id: "2",
    name: "Holi Celebration",
    date: "2026-03-25",
    location: "Indore",
    attendees: ["Students", "Teachers"],
  },
];

app.get("/events", (req, res) => {
  let result = events;

  if (req.query.location) {
    result = result.filter(
      (e) => e.location.toLowerCase() === req.query.location.toLowerCase(),
    );
  }

  if (req.query.date) {
    result = result.filter((e) => e.date === req.query.date);
  }

  res.json({
    status: "success",
    data: result,
  });
});

app.get("/events/:id", (req, res) => {
  const event = events.find((e) => e.id === req.params.id);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  res.json(event);
});

app.post("/events", (req, res) => {
  const { name, date, location } = req.body;

  if (!name || !date || !location) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const newEvent = {
    id: Date.now().toString(),
    name: name,
    date: date,
    location: location,
    attendees: req.body.attendees || ["Students"],
  };

  events.push(newEvent);

  res.status(201).json(newEvent);
});

app.put("/events/:id", (req, res) => {
  const event = events.find((e) => e.id === req.params.id);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  const { name, date, location, attendees } = req.body;

  if (name) event.name = name;
  if (date) event.date = date;
  if (location) event.location = location;
  if (attendees) event.attendees = attendees;

  res.json(event);
});

app.delete("/events/:id", (req, res) => {
  const index = events.findIndex((e) => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  const deletedEvent = events.splice(index, 1);

  res.json({
    message: "Event deleted successfully",
    data: deletedEvent[0],
  });
});

app.post("/events/:id/register", (req, res) => {
  const event = events.find((e) => e.id === req.params.id);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  const { attendeeName } = req.body;

  if (!attendeeName || typeof attendeeName !== "string") {
    return res.status(400).json({
      message: "Attendee name is required",
    });
  }

  if (event.attendees.includes(attendeeName)) {
    return res.status(400).json({
      message: "Already registered",
    });
  }

  event.attendees.push(attendeeName);

  res.json({
    message: "Registration successful",
    data: event,
  });
});

app.get("/events/:id/attendees", (req, res) => {
  const event = events.find((e) => e.id === req.params.id);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  res.json({
    attendees: event.attendees,
    count: event.attendees.length,
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
