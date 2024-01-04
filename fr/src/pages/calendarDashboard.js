document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.querySelector('.calendar');
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const totalDaysInMonth = 30;

    // Create calendar header for days
    const header = document.createElement('div');
    header.className = 'header';
    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.innerText = day;
        header.appendChild(dayElement);
    });
    calendar.appendChild(header);

    // Populate days in the calendar
    for (let i = 1; i <= totalDaysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.innerText = i;
        calendar.appendChild(dayElement);
    }
});