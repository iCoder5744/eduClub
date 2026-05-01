// Progress Functions
function updateProgressDisplay() {
    // Update overall progress circle
    const overallCircle = document.getElementById('overallProgress');
    const overallText = overallCircle.querySelector('.progress-text');
    const overallPercentage = userProgress.overallProgress;

    overallText.textContent = `${overallPercentage}%`;
    overallCircle.style.background = `conic-gradient(var(--accent-green) ${overallPercentage * 3.6}deg, var(--gray-200) 0deg)`;

    // Update courses completed
    const coursesCircle = document.getElementById('coursesProgress');
    const coursesText = coursesCircle.querySelector('.progress-text');
    coursesText.textContent = userProgress.coursesCompleted;

    // Update badges
    const badgesContainer = document.getElementById('badgesContainer');
    const totalBadges = 5;
    const earnedBadges = Math.min(userProgress.badgesEarned, totalBadges);

    badgesContainer.innerHTML = '';
    const badgeIcons = ['🏆', '⭐', '🎯', '🚀', '💎'];

    for (let i = 0; i < totalBadges; i++) {
        const badge = document.createElement('div');
        badge.className = i < earnedBadges ? 'badge' : 'badge locked';
        badge.textContent = i < earnedBadges ? badgeIcons[i] : '🔒';
        badgesContainer.appendChild(badge);
    }
}
