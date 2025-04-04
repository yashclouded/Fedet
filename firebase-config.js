// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBk79wEuO4-kzN2KMT9_M3WpFkjnHOOTa0",
    authDomain: "fedet-114ee.firebaseapp.com",
    projectId: "fedet-114ee",
    storageBucket: "fedet-114ee.appspot.com",
    messagingSenderId: "661181725557",
    appId: "1:661181725557:web:76b5ca367b42110445b13c",
    measurementId: "G-J990XYFEQV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Show notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Auth functions
const Auth = {
    // Email/Password Login
    async login(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            if (!result.user.emailVerified) {
                showNotification('Please verify your email before logging in', 'warning');
                await Auth.signOut();
                throw new Error('Email not verified');
            }
            showNotification('Successfully logged in!');
            window.location.href = '/dashboard.html';
            return result.user;
        } catch (error) {
            console.error('Login error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Student Signup
    async studentSignup(email, password, name, university, major) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;
            
            // Send verification email
            await sendEmailVerification(user);
            
            // Save additional user data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email,
                name,
                university,
                major,
                role: 'student',
                createdAt: new Date().toISOString(),
                profileCompleted: false,
                emailVerified: false
            });

            showNotification('Account created! Please check your email for verification link.');
            // Redirect to profile setup
            window.location.href = '/profile-setup.html';
            return user;
        } catch (error) {
            console.error('Student signup error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Company Signup
    async companySignup(email, password, companyName, industry, description) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;
            
            // Send verification email
            await sendEmailVerification(user);
            
            // Save additional company data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email,
                companyName,
                industry,
                description,
                role: 'company',
                createdAt: new Date().toISOString(),
                profileCompleted: false,
                emailVerified: false
            });

            showNotification('Account created! Please check your email for verification link.');
            // Redirect to profile setup
            window.location.href = '/profile-setup.html';
            return user;
        } catch (error) {
            console.error('Company signup error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Resend verification email
    async resendVerificationEmail() {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No user logged in');
            }
            await sendEmailVerification(user);
            showNotification('Verification email sent! Please check your inbox.');
        } catch (error) {
            console.error('Resend verification error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Forgot password
    async forgotPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            showNotification('Password reset email sent! Please check your inbox.');
        } catch (error) {
            console.error('Forgot password error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Google Sign In
    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Get user's profile information
            const displayName = user.displayName;
            const photoURL = user.photoURL;
            
            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            
            if (!userDoc.exists()) {
                // Create new user document with Google profile info
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    name: displayName,
                    photoURL: photoURL,
                    role: 'student', // Default role
                    createdAt: new Date().toISOString(),
                    profileCompleted: false,
                    emailVerified: user.emailVerified
                });
            } else {
                // Update existing user's profile info
                await setDoc(doc(db, 'users', user.uid), {
                    name: displayName,
                    photoURL: photoURL,
                    emailVerified: user.emailVerified
                }, { merge: true });
            }

            showNotification('Successfully signed in with Google!');
            
            // Check if profile is completed
            const updatedUserDoc = await getDoc(doc(db, 'users', user.uid));
            if (!updatedUserDoc.exists() || !updatedUserDoc.data().profileCompleted) {
                window.location.href = '/profile-setup.html';
            } else {
                window.location.href = '/dashboard.html';
            }
            return user;
        } catch (error) {
            console.error('Google sign in error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // GitHub Sign In
    async signInWithGithub() {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            showNotification('Successfully signed in with GitHub!');
            // Check if profile is completed
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists() || !userDoc.data().profileCompleted) {
                window.location.href = '/profile-setup.html';
            } else {
                window.location.href = '/dashboard.html';
            }
            return result.user;
        } catch (error) {
            console.error('GitHub sign in error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Sign Out
    async signOut() {
        try {
            await signOut(auth);
            showNotification('Successfully signed out!');
            window.location.href = '/';
        } catch (error) {
            console.error('Sign out error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Upload profile picture
    async uploadProfilePicture(file) {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No user logged in');
            }

            // Create a reference to the profile picture in Firebase Storage
            const storageRef = ref(storage, `profile-pictures/${user.uid}`);
            
            // Upload the file
            await uploadBytes(storageRef, file);
            
            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);
            
            // Update user document with new photo URL
            await setDoc(doc(db, 'users', user.uid), {
                photoURL: downloadURL
            }, { merge: true });

            showNotification('Profile picture updated successfully!');
            return downloadURL;
        } catch (error) {
            console.error('Profile picture upload error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Delete profile picture
    async deleteProfilePicture() {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No user logged in');
            }

            const storageRef = ref(storage, `profile-pictures/${user.uid}`);
            
            // Delete the file from storage
            await deleteObject(storageRef);
            
            // Update user document to remove photo URL
            await setDoc(doc(db, 'users', user.uid), {
                photoURL: null
            }, { merge: true });

            showNotification('Profile picture removed successfully!');
        } catch (error) {
            console.error('Profile picture deletion error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    },

    // Get user profile
    async getUserProfile() {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No user logged in');
            }
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                throw new Error('User profile not found');
            }
            return userDoc.data();
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    // Update student profile
    async updateStudentProfile(profileData) {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No user logged in');
            }

            await setDoc(doc(db, 'users', user.uid), {
                ...profileData,
                role: 'student',
                updatedAt: new Date().toISOString()
            }, { merge: true });

            showNotification('Profile updated successfully!');
        } catch (error) {
            console.error('Update profile error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Update company profile
    async updateCompanyProfile(profileData) {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No user logged in');
            }

            await setDoc(doc(db, 'users', user.uid), {
                ...profileData,
                role: 'company',
                updatedAt: new Date().toISOString()
            }, { merge: true });

            showNotification('Profile updated successfully!');
        } catch (error) {
            console.error('Update profile error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Add project points to student
    async addProjectPoints(studentId, points) {
        try {
            const userDoc = await getDoc(doc(db, 'users', studentId));
            if (!userDoc.exists()) {
                throw new Error('Student not found');
            }

            const currentPoints = userDoc.data().points || 0;
            await setDoc(doc(db, 'users', studentId), {
                points: currentPoints + points,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            showNotification('Points added successfully!');
        } catch (error) {
            console.error('Add points error:', error);
            showNotification(error.message, 'error');
            throw error;
        }
    }
};

// Export auth functions to window object
window.Auth = Auth;