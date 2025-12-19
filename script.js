let globalClicks = 0;
let localClicks = {
  confirmed: 0,
  pending: 0
}
let confirmedClicks = localClicks.confirmed;
let pendingClicks = localClicks.pending;


let button = document.getElementById("clicker-button");
let clickCount = document.getElementById("click-count");

const backendUrl = 'https://clicker-backend-production-becd.up.railway.app'; 

button.onclick = async function () {
  pendingClicks++;
  render();

  try {
    const res = await fetch(`${backendUrl}/click`, { method: 'POST' });
    const data = await res.json();

    // Server confirmed one click
    confirmedClicks = data.global_clicks;
    pendingClicks--;
    render();
  } catch (err) {
    console.error('Failed to send click to backend:', err);

    // rollback failed click
    pendingClicks--;
    render();
  }
};

function render() {
  clickCount.textContent = confirmedClicks + pendingClicks;
}

async function updateTotal() {
  try {
    const res = await fetch(`${backendUrl}/total`);
    if (!res.ok) throw new Error('Network response was not ok');

    const data = await res.json();

    // Only update confirmed count
    confirmedClicks = data.global_clicks;
    render();
  } catch (err) {
    console.error('Failed to fetch total:', err);
  }
}

updateTotal(); // initialize global total on page load

setInterval(updateTotal, 10000); // update every 5 seconds
