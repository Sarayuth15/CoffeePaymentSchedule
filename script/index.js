const people = ['Vanda 님', 'Sarayuth 님', 'Vimean 님'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const startDate = new Date('2025-04-16'); // Starting point

const today = new Date()

// convert to real date object
const year = today.getFullYear()
const month = today.getMonth() + 1 // month is 0-index, so add 1
const day = today.getDate()
console.log(year)

// fn get ISO week number
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return weekNo
}

const todayWeekNumber = getWeekNumber(today)

function getPersonForDate(date) {
  let count = 0;
  let current = new Date(startDate);

  while (current < date) {
    const day = current.getDay();
    if (day >= 1 && day <= 5) count++;
    current.setDate(current.getDate() + 1);
  }

  return people[count % people.length];
}

function renderScheduleForWeek(year, weekNumber) {
  const resultHTML = [];
  const monday = getMondayOfWeek(year, weekNumber);

  for (let i = 0; i < 5; i++) {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);

    if (date < startDate) {
      resultHTML.push(`
          <div class="col-md-6">
            <div class="schedule-card bg-light text-muted">
              <span>${days[i]}</span> — N/A (before rotation start)
            </div>
          </div>
        `);
      continue;
    }

    const person = getPersonForDate(date);

    resultHTML.push(`
        <div class="col-md-6">
          <div class="schedule-card">
            <span>${days[i]}</span> — ${person} is pay
          </div>
        </div>
      `);
  }

  $('#schedule').html(resultHTML.join(''));
}

function getMondayOfWeek(year, week) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const monday = simple;
  if (dow <= 4) {
    monday.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    monday.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return monday;
}

$(document).ready(function () {

  $(".fw-bold").append(todayWeekNumber)

  const currentYear = 2025;

  for (let i = 16; i <= 52; i++) {
    $('#weekSelector').append(`<option value="${i}">Week ${i}</option>`);
  }

  renderScheduleForWeek(currentYear, 16);
  $('#weekSelector').val(16);

  $('#weekSelector').on('change', function () {
    const selectedWeek = parseInt($(this).val());
    renderScheduleForWeek(currentYear, selectedWeek);
  });
});