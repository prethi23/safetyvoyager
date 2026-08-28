# SafeVoyager – AI Travel Safety Assistant

SafeVoyager is a domain-specific Generative AI chatbot designed to provide focused, practical, and concise travel safety assistance. The application helps travelers obtain safety guidance, emergency information, destination-specific precautions, scam prevention advice, transportation safety recommendations, and other travel-related safety information through a conversational web interface.

The system is designed specifically for the travel safety domain. It uses the OpenRouter API to connect the application with the Meta LLaMA 3.1 8B Instruct model and uses prompt engineering to keep responses focused on travel safety and emergency-related queries.

## Project Overview

Travelers may face unfamiliar environments, transportation risks, scams, medical emergencies, natural disasters, and other safety concerns when visiting new destinations. Finding relevant safety information quickly can be difficult, particularly when multiple sources need to be checked.

SafeVoyager addresses this problem by providing a centralized AI-powered travel safety assistant. Users can enter a travel-related question and receive an AI-generated response through a simple conversational interface.

The chatbot is domain-constrained and does not function as a general-purpose chatbot. Queries unrelated to travel safety are politely declined.

## Objectives

The primary objectives of SafeVoyager are:

- To develop a domain-specific Generative AI chatbot for travel safety.
- To provide quick and practical travel safety guidance.
- To provide emergency-related assistance and safety precautions.
- To provide destination-specific safety information.
- To assist users with scam and crime prevention.
- To provide transportation and solo travel safety guidance.
- To implement prompt engineering for domain-specific AI behavior.
- To demonstrate API-based integration of a Large Language Model.
- To develop a responsive and user-friendly web interface.
- To deploy the application as an accessible web application.

## Key Features

### Travel Safety Guidance

Provides practical safety recommendations for travelers based on their destination and situation.

### Destination Safety

Provides information and precautions related to safety conditions, common risks, scams, and traveler concerns associated with destinations.

### Emergency Assistance

Provides guidance for handling travel emergencies and locating appropriate emergency resources.

### Hospital Assistance

Provides nearby hospital suggestions when users request medical assistance or hospital information for a specified location.

### Scam and Crime Prevention

Provides recommendations for avoiding common tourist scams, theft, fraud, and other travel-related risks.

### Transportation Safety

Provides safety guidance related to flights, trains, public transportation, taxis, driving, and other transportation methods.

### Solo and Women Traveler Safety

Provides safety recommendations relevant to solo travelers and women traveling independently.

### Travel Health and Safety

Provides general guidance regarding travel health precautions, food and water safety, vaccination considerations, and related travel risks.

### Cybersecurity While Traveling

Provides recommendations for protecting devices, accounts, personal information, and digital identity while traveling.

### Domain-Constrained Responses

The chatbot is configured to focus exclusively on travel safety and emergency-related queries. Unrelated questions are politely declined.

### Conversational Interface

Users can communicate with SafeVoyager through a modern React-based chat interface.

## Technology Stack

| Category | Technology |
|---|---|
| Programming Language | TypeScript, JavaScript |
| Frontend Framework | React.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| AI API | OpenRouter API |
| AI Model | Meta LLaMA 3.1 8B Instruct |
| API Communication | Fetch API |
| Request Method | HTTP POST |
| Response Format | JSON / streamed API response |
| State Management | React useState |
| Hosting | Vercel |
| Version Control | Git and GitHub |

## AI Model

SafeVoyager uses the following Generative AI model:

**Model:** Meta LLaMA 3.1 8B Instruct

The model is accessed through the OpenRouter API.

The model is responsible for:

- Understanding user travel safety queries.
- Processing the conversation context.
- Following the SafeVoyager system instructions.
- Generating travel safety recommendations.
- Providing emergency-related guidance.
- Producing natural-language conversational responses.

## API Integration

The application communicates with OpenRouter through its chat completions endpoint.

### API Endpoint

```text
https://openrouter.ai/api/v1/chat/completions
