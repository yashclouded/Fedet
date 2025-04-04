# Fedet - Student-Company Project Platform

Fedet is a platform that connects students with companies for real-world projects, internships, and opportunities. Students can showcase their skills and earn points by completing projects, while companies can find talented youth for their projects.

## Features

### For Students
- Create a professional profile showcasing skills and achievements
- Find real-world projects to work on (paid and unpaid)
- Earn points by completing projects
- Build a portfolio of completed work
- Connect with companies directly

### For Companies
- Post projects and find talented students
- Access a pool of skilled youth
- Get work done quickly and efficiently
- Choose between paid, unpaid, or internship opportunities
- Manage project applications and communications

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting

## Getting Started

### Prerequisites
- Node.js and npm installed
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yashclouded/Fedet.git
   cd Fedet
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password, Google, GitHub)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase configuration:
     - Go to Project Settings
     - Scroll down to "Your apps" section
     - Click the web app icon (</>)
     - Register your app and copy the configuration object

4. Configure Firebase:
   - Copy `firebase.config.template.js` to `firebase-config.js`
   - Replace the placeholder values with your Firebase configuration
   - **IMPORTANT: Never commit `firebase-config.js` to version control**

5. Start the development server:
   ```
   npm start
   ```

## Project Structure

- `index.html` - Main landing page
- `profile-setup.html` - Student profile setup page
- `company-profile-setup.html` - Company profile setup page
- `dashboard.html` - User dashboard after login
- `firebase.config.template.js` - Template for Firebase configuration
- `script.js` - Main JavaScript functionality
- `styles.css` - Styling for the application

## Security Notes

1. **API Keys**: The Firebase configuration contains API keys. While these keys alone don't grant access to your Firebase resources (they're restricted by Firebase Security Rules), it's still best practice to:
   - Keep them private
   - Use environment variables in production
   - Set up proper Firebase Security Rules

2. **Security Rules**: Make sure to set up proper Firebase Security Rules for:
   - Firestore Database
   - Storage
   - Authentication

## Authentication Flow

1. Users can sign up as either a student or a company
2. Email verification is required before login
3. After signup, users are redirected to complete their profile
4. Once the profile is completed, users are redirected to the dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or suggestions, please contact [your-email@example.com](mailto:your-email@example.com). 