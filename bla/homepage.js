function loadPage(url) {
    window.location.href = url;
}

window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
        loadPage(e.state.page);
    }
});

async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        console.log(data.rates.AUD);
        
        const rates = [
            {pair: 'EUR/USD', value: (1/data.rates.EUR).toFixed(4), change: '+0.15%', up: true},
            {pair: 'GBP/USD', value: (1/data.rates.GBP).toFixed(4), change: '+0.23%', up: true},
            {pair: 'USD/JPY', value: data.rates.JPY.toFixed(2), change: '-0.18%', up: false},
            {pair: 'AUD/USD', value: (1/data.rates.AUD).toFixed(4), change: '-0.12%', up: false},
            {pair: 'USD/CAD', value: data.rates.CAD.toFixed(4), change: '+0.08%', up: true},
            {pair: 'USD/CHF', value: data.rates.CHF.toFixed(4), change: '-0.05%', up: false},
            {pair: 'BTC/USD', value: '42,358', change: '+1.45%', up: true},
            {pair: 'ETH/USD', value: '2,234', change: '+0.87%', up: true},
            {pair: 'Gold/USD', value: '2,045', change: '+0.32%', up: true},
            {pair: 'Silver/USD', value: '24.15', change: '-0.28%', up: false}
        ];
        
        updateTicker(rates);
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        const fallbackRates = [
            {pair: 'BTC/USD', value: '42,358', change: '+1.45%', up: true},
            {pair: 'ETH/USD', value: '2,234', change: '+0.87%', up: true},
            {pair: 'Gold/USD', value: '2,045', change: '+0.32%', up: true},
            {pair: 'Silver/USD', value: '24.15', change: '-0.28%', up: false}
        ];
        updateTicker(fallbackRates);
    }
}

function updateTicker(rates) {
    const ticker = document.getElementById('ticker');
    const items = rates.map(r => 
        `<div class="ticker-item">
            <span class="ticker-label">${r.pair}</span>
            <span class="ticker-value">${r.value}</span>
            <span class="ticker-change ${r.up ? 'positive' : 'negative'}">${r.change}</span>
        </div>`
    ).join('');
    
    ticker.innerHTML = items + items;
}

function playGame(gameType) {
    switch(gameType) {
        case 'quiz':
            alert('News Quiz coming soon! Test your knowledge of current events.');
            break;
        case 'market':
            alert('Market Predictor coming soon! Predict stock movements and win prizes.');
            break;
        default:
            alert('Game coming soon!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchExchangeRates();
    setInterval(fetchExchangeRates, 300000);
});

document.querySelectorAll('.video-item').forEach(item => {
    item.addEventListener('click', function() {
        const title = this.querySelector('h4').textContent;
        alert(`Playing: ${title}`);
    });
});