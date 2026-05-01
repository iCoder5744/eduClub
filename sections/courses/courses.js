// Course Functions

// Show all courses when button is clicked
function showAllCourses() {
    document.getElementById('filterButtons').style.display = 'flex';
    renderCourses('all');
}

// Render courses based on filter
function renderCourses(filter = 'all') {
    const container = document.getElementById('coursesGrid');
    if (!container) return;

    const filteredCourses = filter === 'all' ?
        coursesData :
        coursesData.filter(course => course.category === filter);

    container.innerHTML = filteredCourses.map(course => `
        <div class="course-card" data-category="${course.category}" onclick="showCourseDetail(${course.id})">
            <div class="course-image">
                ${course.icon}
            </div>
            <div class="course-content">
                <span class="course-category">${course.category}</span>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-footer">
                    <span class="course-price">${course.price}</span>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); showCourseDetail(${course.id})">Details</button>
                </div>
            </div>
        </div>
    `).join('');
}



// Show course detail in modal
function showCourseDetail(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    const modal = document.getElementById('courseDetailModal');
    const detailBody = document.getElementById('courseDetailBody');

    detailBody.innerHTML = `
        <div class="course-detail">
            <div class="course-detail-header">
                <div class="detail-icon" style="font-size: 4rem;">${course.icon}</div>
                <h2>${course.title}</h2>
                <p class="detail-category">${course.category.toUpperCase()}</p>
            </div>

            <div class="course-detail-info">
                <div class="info-row">
                    <span class="info-label">Level:</span>
                    <span class="info-value">${course.level}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Price:</span>
                    <span class="info-value" style="font-size: 1.5rem; color: var(--accent-green); font-weight: bold;">${course.price}</span>
                </div>
            </div>

            <div class="course-detail-description">
                <h3>Course Description</h3>
                <p>${course.description}</p>
                <p>This comprehensive course covers all essential topics and practical applications. Learn from industry experts and gain hands-on experience with real-world projects.</p>
            </div>

            <div class="course-detail-content">
                <h3>What You'll Learn</h3>
                <ul>
                    <li>Master fundamental concepts and theories</li>
                    <li>Build practical projects from scratch</li>
                    <li>Understand real-world applications</li>
                    <li>Get certified upon completion</li>
                    <li>Access lifetime resources and community support</li>
                </ul>
            </div>

            <div class="course-detail-actions">
                <button class="btn btn-primary" onclick="enrollCourse(${course.id})" style="padding: 15px 40px; font-size: 1.1rem;">
                    Enroll Now - ${course.price}
                </button>
                <button class="btn btn-secondary" onclick="closeCourseDetail()" style="padding: 15px 40px; font-size: 1.1rem; background: #666; color: white; border: none;">
                    Back to Courses
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close course detail modal
function closeCourseDetail() {
    const modal = document.getElementById('courseDetailModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('courseDetailModal');
    if (modal && event.target === modal) {
        closeCourseDetail();
    }
});

// Filter courses by category
function filterCourses(category, e) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (e) e.target.classList.add('active');

    renderCourses(category);
}

// Enroll in course
function enrollCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (course) {
        showNotification(`✓ Enrolled in ${course.title}!`, 'success');

        userProgress.coursesCompleted++;
        userProgress.overallProgress = Math.min(100, userProgress.overallProgress + 5);
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        updateProgressDisplay();
        
        closeCourseDetail();
    }
}

// Search courses
function searchCourses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

    if (!searchTerm) {
        renderCourses();
        return;
    }

    const filteredCourses = coursesData.filter(course =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm)
    );

    const container = document.getElementById('coursesGrid');

    if (filteredCourses.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <h3>No courses found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
    } else {
        container.innerHTML = filteredCourses.map(course => `
            <div class="course-card" data-category="${course.category}" onclick="showCourseDetail(${course.id})">
                <div class="course-image">
                    ${course.icon}
                </div>
                <div class="course-content">
                    <span class="course-category">${course.category.charAt(0).toUpperCase() + course.category.slice(1)}</span>
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    <div class="course-footer">
                        <span class="course-price">${course.price}</span>
                        <button class="btn btn-primary" onclick="event.stopPropagation(); showCourseDetail(${course.id})">Details</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}
