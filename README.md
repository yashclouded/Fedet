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
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Update the Firebase configuration in `firebase-config.js`

4. Start the development server:
   ```
   npm start
   ```

## Project Structure

- `index.html` - Main landing page
- `profile-setup.html` - Student profile setup page
- `company-profile-setup.html` - Company profile setup page
- `dashboard.html` - User dashboard after login
- `firebase-config.js` - Firebase configuration and authentication functions
- `script.js` - Main JavaScript functionality
- `styles.css` - Styling for the application

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