# Nimble It

A full-stack application that helps users manage their kitchen inventory, add recipes based on their own preferences, and reduce food waste.

The application consists of a frontend user interface (with React and TypeScript) and a backend API (with C#).

---

## Project Overview

This Nimble It app allows users to:

- Track products in their inventory
- Detect (almost) expired items
- Add new recipes that can be marked as cooked
- Manage a shopping list for missing products

The goal of this project is to make cooking decisions easier while minimizing food waste.

---

## Architecture

This project is split into two main parts:

- **Frontend**  
  User interface that allows users to interact with recipes, inventory and shopping lists.

- **Backend**  
  REST API responsible for data management, business logic and persistence.

---

## Documentation

- [Frontend documentation](Nimble-it.Frontend/README.md)
- [Backend documentation](Nimble-it.Backend/README.md)

- Full Project Instructions

1. MySQL database
2. docker compose with
   - Azurite blob storage
   - quintenst/pw2:backend
   - quintenst/pw2:frontend

---

## Project Structure

```
├─ Nimble-it.Backend/ # Backend API
├─ Nimble-it.Frontend/ # Frontend application
├─ README.md # Project overview (this file)
```
# NT-VoedselVoorraad
