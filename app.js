var myHeaders = new Headers();
myHeaders.append("apikey", "3mgP2F598I0n9pUpJqzrsMtJ3Tsh3Sty");

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

// Get elements from the Dom
let fromCurrency = document.getElementById('base-currency');
let toCurrency = document.getElementById('target-currency');
let amount = document.getElementById('amount');
let convertedAmount = document.getElementById('converted-amount');
let historicalRates = document.getElementById('historical-rates');
let historicalRatesContainer = document.getElementById('historical-rates-container');
let saveFavorite = document.getElementById('save-favorite');
let favoriteCurrencyPairs = document.getElementById('favorite-currency-pairs');

// Fetch the list of currencies
async function getCurrencies() {
  try {
    const response = await fetch(`https://api.apilayer.com/exchangerates_data/symbols`, requestOptions)
    const json = await response.json()
    const currencies = Object.keys(json.symbols)
    console.log(json)
    for (const index in currencies) {
        const option = document.createElement('option');
        option.value = currencies[index];
        option.text = `${currencies[index]}`;
        fromCurrency.add(option.cloneNode(true));
        toCurrency.add(option);
    }
  } catch (error) {
    console.error('Error fetching currencies:', error);
  }
}

getCurrencies();

// Event listeners
fromCurrency.addEventListener('change', performConversion);
toCurrency.addEventListener('change', performConversion);
amount.addEventListener('input', performConversion);
historicalRates.addEventListener('click', fetchHistoricalRates);
saveFavorite.addEventListener('click', saveFavorites);

async function performConversion() {
  try {
    const response = await fetch(`https://api.apilayer.com/exchangerates_data/convert?from=${fromCurrency.value}&to=${toCurrency.value}&amount=${amount.value}&apikey=3mgP2F598I0n9pUpJqzrsMtJ3Tsh3Sty`);
    const data = await response.json();
    const result = data.result;
    convertedAmount.textContent = result.toFixed(2);
  } catch (error) {
    console.error('Error performing conversion:', error);
    convertedAmount.textContent = 'Error performing conversion';
  }
}

async function fetchHistoricalRates() {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const date = '2020-03-11';

  try {
    const response = await fetch(`https://api.apilayer.com/exchangerates_data/${date}?base=${from}&symbols=${to}&apikey=3mgP2F598I0n9pUpJqzrsMtJ3Tsh3Sty`);
    const data = await response.json();
    const rate = data.rates[to]
    historicalRatesContainer.innerHTML = `Historical exchange rate on ${date}: 1 ${from} = ${rate.toFixed(2)} ${to}`;
    

  } catch (error) {
    console.error('Error fetching historical rates:', error);
  }
}

function displayFavorites() {
    if (localStorage.getItem('favoritePairs')) {
        const favoritePairs = JSON.parse(localStorage.getItem('favoritePairs'));
        favoriteCurrencyPairs.innerHTML = '';
        favoritePairs.forEach(pair => {
            const pairElement = document.createElement('button');
            pairElement.style.display = 'inline-block'
            pairElement.className = 'favorite-pair';
            pairElement.textContent = pair;
            pairElement.addEventListener('click', () => {
                const [from, to] = pair.split('-');
                fromCurrency.value = from;
                toCurrency.value = to;
                performConversion();
            });
            favoriteCurrencyPairs.appendChild(pairElement);
        });
    }
}

function saveFavorites() {
    const pair = `${fromCurrency.value}-${toCurrency.value}`;

    if (!localStorage.getItem('favoritePairs')) {
        localStorage.setItem('favoritePairs', JSON.stringify([]));
    }

    const favoritePairs = JSON.parse(localStorage.getItem('favoritePairs'));

    if (fromCurrency.value !== "" && toCurrency.value !== "" && !favoritePairs.includes(pair)) {
        favoritePairs.push(pair);
        localStorage.setItem('favoritePairs', JSON.stringify(favoritePairs));
        displayFavorites();
    }
}
    
displayFavorites();
