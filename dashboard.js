import { Auth } from './firebase-config.js';

// Check authentication state
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const user = Auth.getCurrentUser();
        if (!user) {
            window.location.href = '/index.html';
            return;
        }

        // Get user profile
        const profile = await Auth.getUserProfile();
        if (!profile) {
            window.location.href = '/profile-setup.html';
            return;
        }

        // Update welcome message
        document.querySelector('.user-name').textContent = profile.name || profile.username;

        // Update stats
        document.querySelector('.points-value').textContent = profile.points || 0;
        document.querySelector('.applications-value').textContent = profile.activeApplications?.length || 0;
        document.querySelector('.completed-value').textContent = profile.completedProjects?.length || 0;

        // Load jobs
        loadJobs();

        // Set up filters
        setupFilters();
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showNotification('Error loading dashboard', 'error');
    }
});

// Load jobs
async function loadJobs() {
    try {
        const jobsGrid = document.getElementById('jobsGrid');
        jobsGrid.innerHTML = ''; // Clear loading state

        // Get jobs from Firestore
        const jobs = await Auth.getAvailableJobs();
        
        if (jobs.length === 0) {
            jobsGrid.innerHTML = `
                <div class="no-jobs">
                    <i class="fas fa-search"></i>
                    <h3>No opportunities found</h3>
                    <p>Check back later or adjust your filters</p>
                </div>
            `;
            return;
        }

        // Render each job
        jobs.forEach(job => {
            const jobCard = createJobCard(job);
            jobsGrid.appendChild(jobCard);
        });
    } catch (error) {
        console.error('Error loading jobs:', error);
        showNotification('Error loading opportunities', 'error');
    }
}

// Create job card
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <div class="job-header">
            <h3>${job.title}</h3>
            <span class="job-type ${job.type.toLowerCase()}">${job.type}</span>
        </div>
        <div class="job-company">
            <img src="${job.companyLogo}" alt="${job.companyName}" class="company-logo">
            <div class="company-info">
                <h4>${job.companyName}</h4>
                <p>${job.location}</p>
            </div>
        </div>
        <div class="job-description">
            <p>${job.description}</p>
        </div>
        <div class="job-skills">
            ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
        <div class="job-footer">
            <div class="compensation">
                ${job.compensation ? `<span class="paid">Paid</span>` : '<span class="unpaid">Unpaid</span>'}
                ${job.compensation ? `<span class="amount">$${job.compensation}</span>` : ''}
            </div>
            <button class="btn-primary apply-btn" data-job-id="${job.id}">Apply Now</button>
        </div>
    `;

    // Add click handler for apply button
    card.querySelector('.apply-btn').addEventListener('click', () => applyForJob(job.id));
    return card;
}

// Handle job application
async function applyForJob(jobId) {
    try {
        await Auth.applyForJob(jobId);
        showNotification('Application submitted successfully!');
        loadJobs(); // Refresh the jobs list
    } catch (error) {
        console.error('Error applying for job:', error);
        showNotification(error.message, 'error');
    }
}

// Set up filters
function setupFilters() {
    const skillsInput = document.getElementById('skills');
    const selectedSkills = document.querySelector('.selected-skills');
    const skills = new Set();

    // Handle skills input
    skillsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const skill = skillsInput.value.trim();
            if (skill && !skills.has(skill)) {
                skills.add(skill);
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.innerHTML = `${skill}<i class="fas fa-times"></i>`;
                skillTag.querySelector('i').addEventListener('click', () => {
                    skills.delete(skill);
                    skillTag.remove();
                    applyFilters();
                });
                selectedSkills.appendChild(skillTag);
                skillsInput.value = '';
                applyFilters();
            }
        }
    });

    // Handle filter changes
    document.getElementById('jobType').addEventListener('change', applyFilters);
    document.getElementById('compensation').addEventListener('change', applyFilters);
    document.querySelector('.apply-filters').addEventListener('click', applyFilters);
}

// Apply filters
async function applyFilters() {
    const jobType = document.getElementById('jobType').value;
    const compensation = document.getElementById('compensation').value;
    const skills = Array.from(document.querySelectorAll('.skill-tag')).map(tag => tag.textContent);

    try {
        const jobs = await Auth.getFilteredJobs({ jobType, compensation, skills });
        const jobsGrid = document.getElementById('jobsGrid');
        jobsGrid.innerHTML = '';
        
        if (jobs.length === 0) {
            jobsGrid.innerHTML = `
                <div class="no-jobs">
                    <i class="fas fa-filter"></i>
                    <h3>No matches found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }

        jobs.forEach(job => {
            const jobCard = createJobCard(job);
            jobsGrid.appendChild(jobCard);
        });
    } catch (error) {
        console.error('Error applying filters:', error);
        showNotification('Error filtering jobs', 'error');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
} 