# CVstomize: AI-Powered Resume Tailoring. ATS pwnage

## 1. Project Purpose

CVstomize is a web application designed to help users automatically tailor their resumes for specific job applications. The primary goal is to streamline the job application process by dynamically generating a customized CV based on a user's existing resume, personal stories, and the target job description.

## 2. Core Features & Scope

The scope of this project is defined by the following core features:

-   **File Ingestion:** Users can upload one or more documents containing their existing resume information (`.pdf`, `.docx`).
-   **Text Inputs:** The interface provides dedicated text areas for users to input relevant personal stories, key achievements, and the full text of the target job description.
-   **Section Selection:** Users can select which specific sections (e.g., Summary, Experience, Education, Skills) they want included in the final output, with a set of "recommended" sections pre-selected.
-   **AI Generation:** The application will send the aggregated user data to the Google Gemini Pro model, which will synthesize the information and generate a new, tailored resume text.
-   **Output & Download:** The generated resume text will be displayed in the browser and will be available for download as a `.pdf` file.

## 3. Technology Stack

-   **Front-end:** React.js
-   **Back-end:** Node.js-based Serverless Functions
-   **Deployment & Hosting:** Vercel
-   **AI Engine:** Google Gemini API