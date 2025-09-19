# 💻 DATACOM Coding Challenge

This repository contains a **full-stack web application** designed to generate a "past life prophecy" for a user. It includes:

- A React frontend (with Tailwind CSS + shadcn).
- A .NET Core Web API backend that fetches data from Agify.io and Genderize.io and then merges it to a single object for consumption.
- The map-based React project that was included in the challenge. For bug-fixing purposes.

---

## 📦 Project Overview

### 🔮 Life before You Frontend
A React application with **Tailwind CSS** and **shadcn/ui** that feeds off the .Net Core API backend to get the data. It uses Gemini API to process the prophecy based on the User's Name, Age, and Gender. 

### 🧠 Life before You Backend
A **RESTful API** built using **.NET Core**. It fetches data from Agify.io and Genderize.io using a Name parameter, then returns an object that the frontend uses. It provides the backend logic and serves data to the frontend for generating the prophecy.

### 🗺️ Map Project
A separate React project showcasing **map integration** using react-leaflet - which was included in the challenge to check for bugs.

---

## ⚙️ Project Setup

### 🔮 Life before You
#### Frontend
Pre-requisites:
* Node.js
* NPM

Starting the App
1. Navigate to the project directory
  
```cd life-before-you-frontend```

2. Install the required dependencies
  
```npm install```

3. Start the development server
  
```npm run dev```

#### Backend
Pre-requisites:
* .NET SDK 9.0

Starting the App
1. Navigate to the project directory

```cd life-before-you-backend```

2. Start the development server
   
```dotnet run```
