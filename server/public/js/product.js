// ===== Product Details Page - Dynamic Rendering =====

// Tier content mirrors the cards on the index page (same images, i18n keys and feature lists).
const PRODUCTS = {
    fazaa: {
        cardClass: 'fazaa-discount',
        badgeKey: 'newBadge',
        titleKey: 'fazaaDiscount',
        titleFallback: 'النجم',
        descKey: 'fazaaDiscountDesc',
        image: '/images/products/photo_5888856739774402815_y.jpg',
        alt: 'Hamyan Discounts',
        features: ['feat7', 'feat4', 'feat5', 'feat3', 'feat6', 'featRestaurants'],
    },
    platinum: {
        cardClass: 'platinum',
        badgeKey: 'mostPopular',
        titleKey: 'platinum',
        descKey: 'platinumDesc',
        image: '/images/products/photo_5888856739774402810_y.jpg',
        alt: 'Platinum',
        features: [
            'feat1', 'feat2', 'feat3', 'feat4', 'feat5',
            'feat6', 'feat7', 'feat8', 'feat9', 'feat10',
        ],
    },
    gold: {
        cardClass: 'gold',
        titleKey: 'gold',
        descKey: 'goldDesc',
        image: '/images/products/photo_5888856739774402811_y.jpg',
        alt: 'Gold',
        features: ['feat2', 'feat4', 'feat5', 'feat3', 'feat6', 'feat7', 'feat8', 'feat10'],
    },
    silver: {
        cardClass: 'silver',
        titleKey: 'silver',
        descKey: 'silverDesc',
        image: '/images/products/photo_5888856739774402812_y.jpg',
        alt: 'Silver',
        features: ['feat5', 'feat4', 'feat3', 'feat6', 'feat7', 'feat8'],
    },
};

const DEFAULT_TIER = 'platinum';

// main.js strips the query string on DOMContentLoaded, so capture the tier now.
// localStorage is the fallback because startOrder() stores the tier there too.
const urlTier = new URLSearchParams(window.location.search).get('tier');
let storedTier = null;
try {
    storedTier = localStorage.getItem('fazaaTier');
} catch (e) {}

const activeTier = PRODUCTS[urlTier] ? urlTier
    : (PRODUCTS[storedTier] ? storedTier : DEFAULT_TIER);

function renderProduct() {
    const product = PRODUCTS[activeTier];

    const card = document.getElementById('productCard');
    const badge = document.getElementById('productBadge');
    const image = document.getElementById('productImage');
    const title = document.getElementById('productTitle');
    const desc = document.getElementById('productDesc');
    const features = document.getElementById('productFeatures');
    const orderBtn = document.getElementById('productOrderBtn');

    card.className = 'card product-detail-card ' + product.cardClass;

    const badgeText = product.badgeKey ? t(product.badgeKey) : '';
    badge.textContent = badgeText;
    badge.style.display = badgeText ? '' : 'none';

    image.src = product.image;
    image.alt = product.alt;

    title.textContent = product.titleKey ? t(product.titleKey) : product.titleFallback;
    desc.textContent = t(product.descKey);

    features.innerHTML = product.features.map(key =>
        '<li><i class="fas fa-check"></i> <span>' + t(key) + '</span></li>'
    ).join('');

    // Keep the existing "order now" behaviour: startOrder() drives the whole flow.
    orderBtn.setAttribute('onclick', "startOrder('" + activeTier + "')");

    document.title = title.textContent + ' - ' + t('brandName');
}

document.addEventListener('DOMContentLoaded', renderProduct);

// The i18n layer rewrites [data-i18n] nodes on switch, so re-render our dynamic slots too.
window.addEventListener('languageChanged', renderProduct);
