const search = document.getElementById('search');
const container = document.getElementById('contacts');

window.onload = function () {
  document.querySelector('body').style.visibility = 'hidden';
  document.querySelector('#loader').style.visibility = 'visible';

  getEmergencyNumbers();
  search.addEventListener('input', () => searchNumbers(search.value));
};

async function getEmergencyNumbers() {
  try {
    const API = 'https://emajency.com/js/numbers.json';
    const NUMBERS = await (await fetch(API)).json();
    displayContacts(NUMBERS);
  } catch (err) {
    container.innerHTML = `<div class="error">
    <h2>${err.message}</h2>
    </div>`;
  } finally {
    document.querySelector('#loader').style.display = 'none';
    document.querySelector('body').style.visibility = 'visible';
  }
}

async function displayContacts(contacts) {
  const TABLE = document.getElementById('contacts');
  contacts.forEach((contact, index) => {
    const { name, number } = contact;
    TABLE.innerHTML += `
    <tr>
    <td data-col-title="S/N">${index + 1}</td>
    <td data-col-title="Name">${name}</td>
    <td data-col-title="Emergency Number">
      ${number.trim() || 'Not available'}
    </td>
    <td data-col-title="Dial">
      <a href="tel:${number}"><i class="fas fa-phone"></i></a>
    </td>
  </tr>
    `;
  });
}

//Search and filter the numbers

const searchNumbers = async (searchText) => {
  const API = await fetch('https://emajency.com/js/numbers.json');

  let res = await API.json();
  let filterNumbers = res;

  if (searchText) {
    filterNumbers = res.filter((item) => {
      const regex = new RegExp(`^${searchText}`, 'gi');

      return item['name'].match(regex);
    });
  }

  outputNumbers(filterNumbers);
};

const outputNumbers = (matchedNumber) => {
  if (matchedNumber.length > 0) {
    const display = matchedNumber
      .map(
        (item, index) => `
        <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.number.trim() || 'Not available'}</td>
        <td>
          <a href="tel:${item.number.trim()}"><i class="fas fa-phone"></i></a>
        </td>
      </tr>
      `
      )
      .join('');

    container.innerHTML = display;
  } else {
    container.innerHTML = `<div class="error">
    <h4>No matches found</h4>
    </div>`;
    'No matches found' || null;
  }
};

// .finally((_) => {
//   document.querySelector('#loader').style.display = 'none';
//   document.querySelector('body').style.visibility = 'visible';
// });
