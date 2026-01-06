async function fetchProducts() {
  const res = await fetch('./data/products.json');
  if (!res.ok) throw new Error('Không tải được dữ liệu.');
  return res.json();
}
const formatPrice = vnd => vnd.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
const getMinPrice = items => Math.min(...items.map(i => i.price));

function render(products) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  products.forEach(p => {
    const min = getMinPrice(p.items);
    const el = document.createElement('div');
    el.className = 'product-card';
    el.innerHTML = `
      <h2>${p.name} <span class="badge">Thấp nhất: ${formatPrice(min)}</span></h2>
      <div class="grid">
        ${p.items.map(i => `
          <div class="item">
            <div class="shop">${i.shop}</div>
            <div class="price">${formatPrice(i.price)}</div>
            <a href="${i.url}" target="_blank" rel="noopener">Xem tại ${i.shop}</a>
          </div>
        `).join('')}
      </div>
    `;
    app.appendChild(el);
  });
}

(async function main() {
  try {
    let products = await fetchProducts();
    render(products);

    const search = document.getElementById('search');
    search.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(q));
      render(filtered);
    });

    document.getElementById('sortAsc').addEventListener('click', () => {
      const sorted = [...products].sort((a, b) => getMinPrice(a.items) - getMinPrice(b.items));
      render(sorted);
    });
    document.getElementById('sortDesc').addEventListener('click', () => {
      const sorted = [...products].sort((a, b) => getMinPrice(b.items) - getMinPrice(a.items));
      render(sorted);
    });
  } catch (err) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="loading">Lỗi: ${err.message}</div>`;
  }
})();
