async function loadActivities() {
    const response = await fetch('/activities');
    const activities = await response.json();

    const list = document.getElementById('activities-list');
    const select = document.getElementById('activity');

    list.innerHTML = '';
    select.innerHTML = '<option value="">-- Select an activity --</option>';

    for (const [name, details] of Object.entries(activities)) {
        // Add to dropdown
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);

        // Build participants list
        const participantsHTML = details.participants.length > 0
            ? `<ul class="participants-list">
                ${details.participants.map(p => `
                    <li>
                        <span class="participant-email">${p}</span>
                        <button class="delete-btn" onclick="unregister('${name}', '${p}')">🗑</button>
                    </li>
                `).join('')}
               </ul>`
            : '<p class="no-participants">No participants yet</p>';

        // Build activity card
        const card = document.createElement('div');
        card.className = 'activity-card';
        card.innerHTML = `
            <h4>${name}</h4>
            <p>${details.description}</p>
            <p><strong>Schedule:</strong> ${details.schedule}</p>
            <p><strong>Availability:</strong> ${details.max_participants - details.participants.length} spots left</p>
            <div class="participants-section">
                <strong>Signed Up:</strong>
                ${participantsHTML}
            </div>
        `;
        list.appendChild(card);
    }
}

async function signUp() {
    const email = document.getElementById('email').value;
    const activity = document.getElementById('activity').value;
    const message = document.getElementById('message');

    if (!email || !activity) {
        message.textContent = 'Please enter your email and select an activity.';
        message.style.color = 'red';
        return;
    }

    const response = await fetch(`/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`, {
        method: 'POST'
    });

    const data = await response.json();

    if (response.ok) {
        message.textContent = data.message;
        message.style.color = 'green';
        loadActivities();
    } else {
        message.textContent = data.detail;
        message.style.color = 'red';
    }
}

async function unregister(activityName, email) {
    const response = await fetch(`/activities/${encodeURIComponent(activityName)}/unregister?email=${encodeURIComponent(email)}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        loadActivities();
    }
}

loadActivities();
