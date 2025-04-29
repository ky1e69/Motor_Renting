// Sample motorcycle data
const motorcycles = [
    {
        id: 1,
        name: "Honda Click 125",
        image: "img/click.jpg",
        specs: {
            engine: "125cc",
            fuel: "Gasoline",
            transmission: "Automatic",
            mileage: "45 km/L",
            maxSpeed: "90 km/h"
        },
        rate: 800,
        available: true,
        features: ["ABS", "Digital Display", "USB Charging Port", "Under-seat Storage"]
    },
    {
        id: 2,
        name: "Yamaha NMAX",
        image: "img/nmax.jpg",
        specs: {
            engine: "155cc",
            fuel: "Gasoline",
            transmission: "Automatic",
            mileage: "40 km/L",
            maxSpeed: "110 km/h"
        },
        rate: 1200,
        available: true,
        features: ["ABS", "Traction Control", "Smart Key System", "Large Storage"]
    },
    {
        id: 3,
        name: "Suzuki Raider R150",
        image: "img/raider.jpg",
        specs: {
            engine: "150cc",
            fuel: "Gasoline",
            transmission: "Manual",
            mileage: "50 km/L",
            maxSpeed: "120 km/h"
        },
        rate: 1000,
        available: true,
        features: ["Sporty Design", "High Performance", "LED Lighting", "Sport Suspension"]
    }
];

// DOM Elements
const motorcycleGrid = document.querySelector('.motorcycle-grid');
const motorcycleSelect = document.getElementById('motorcycle');
const bookingForm = document.getElementById('booking-form');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const pickupDateInput = document.getElementById('pickup-date');
const durationInput = document.getElementById('duration');
const searchInput = document.getElementById('search-input');
const priceFilter = document.getElementById('price-filter');
const typeFilter = document.getElementById('type-filter');

// Set minimum date for pickup
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
pickupDateInput.min = tomorrow.toISOString().split('T')[0];

// Create motorcycle card function
function createMotorcycleCard(motorcycle) {
    const card = document.createElement('div');
    card.className = 'motorcycle-card';
    card.innerHTML = `
        <div class="card-image">
            <img src="${motorcycle.image}" alt="${motorcycle.name}" loading="lazy">
            <div class="availability-badge ${motorcycle.available ? 'available' : 'unavailable'}">
                ${motorcycle.available ? 'Available' : 'Unavailable'}
            </div>
        </div>
        <div class="card-content">
            <h3>${motorcycle.name}</h3>
            <div class="specs">
                <p><strong>Engine:</strong> ${motorcycle.specs.engine}</p>
                <p><strong>Fuel:</strong> ${motorcycle.specs.fuel}</p>
                <p><strong>Transmission:</strong> ${motorcycle.specs.transmission}</p>
                <p><strong>Mileage:</strong> ${motorcycle.specs.mileage}</p>
                <p><strong>Max Speed:</strong> ${motorcycle.specs.maxSpeed}</p>
            </div>
            <div class="features">
                ${motorcycle.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="card-footer">
                <p class="rate">₱${motorcycle.rate}/day</p>
                <button class="book-now" data-id="${motorcycle.id}" ${!motorcycle.available ? 'disabled' : ''}>
                    ${motorcycle.available ? 'Book Now' : 'Unavailable'}
                </button>
            </div>
        </div>
    `;
    return card;
}

// Display motorcycles function
function displayMotorcycles(motorcyclesToDisplay) {
    motorcycleGrid.innerHTML = '';
    if (motorcyclesToDisplay.length === 0) {
        motorcycleGrid.innerHTML = '<div class="no-results">No motorcycles found matching your criteria.</div>';
        return;
    }
    motorcyclesToDisplay.forEach(motorcycle => {
        const card = createMotorcycleCard(motorcycle);
        motorcycleGrid.appendChild(card);
    });
}

// Filter motorcycles function
function filterMotorcycles() {
    const searchTerm = searchInput.value.toLowerCase();
    const priceRange = priceFilter.value;
    const transmissionType = typeFilter.value;

    const filteredMotorcycles = motorcycles.filter(motorcycle => {
        const matchesSearch = motorcycle.name.toLowerCase().includes(searchTerm) ||
                            motorcycle.specs.transmission.toLowerCase().includes(searchTerm);
        
        let matchesPrice = true;
        if (priceRange) {
            const [min, max] = priceRange.split('-');
            if (max) {
                matchesPrice = motorcycle.rate >= parseInt(min) && motorcycle.rate <= parseInt(max);
            } else {
                matchesPrice = motorcycle.rate >= parseInt(min);
            }
        }

        const matchesType = !transmissionType || motorcycle.specs.transmission === transmissionType;

        return matchesSearch && matchesPrice && matchesType;
    });

    displayMotorcycles(filteredMotorcycles);
}

// Initialize motorcycle listings
function initializeMotorcycles() {
    // Display all motorcycles initially
    displayMotorcycles(motorcycles);
    
    // Add to select dropdown
    motorcycles.forEach(motorcycle => {
        const option = document.createElement('option');
        option.value = motorcycle.id;
        option.textContent = `${motorcycle.name} - ₱${motorcycle.rate}/day`;
        motorcycleSelect.appendChild(option);
    });

    // Add event listeners for book now buttons
    document.querySelectorAll('.book-now').forEach(button => {
        button.addEventListener('click', () => {
            const motorcycleId = button.dataset.id;
            motorcycleSelect.value = motorcycleId;
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Calculate and update total cost
function updateTotalCost() {
    const motorcycleId = motorcycleSelect.value;
    const duration = durationInput.value;
    
    if (motorcycleId && duration) {
        const selectedMotorcycle = motorcycles.find(m => m.id === parseInt(motorcycleId));
        const totalCost = selectedMotorcycle.rate * duration;
        const totalCostElement = document.querySelector('.total-cost');
        
        if (!totalCostElement) {
            const totalCostDiv = document.createElement('div');
            totalCostDiv.className = 'total-cost';
            totalCostDiv.innerHTML = `
                <div class="total-cost-content">
                    <p>Total Cost: <strong>₱${totalCost}</strong></p>
                    <p class="cost-breakdown">${selectedMotorcycle.rate} × ${duration} days</p>
                </div>
            `;
            bookingForm.appendChild(totalCostDiv);
        } else {
            totalCostElement.innerHTML = `
                <div class="total-cost-content">
                    <p>Total Cost: <strong>₱${totalCost}</strong></p>
                    <p class="cost-breakdown">${selectedMotorcycle.rate} × ${duration} days</p>
                </div>
            `;
        }
    }
}

// Handle booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = {
        motorcycleId: motorcycleSelect.value,
        pickupDate: pickupDateInput.value,
        duration: durationInput.value,
        location: document.getElementById('location').value,
        notes: document.getElementById('notes').value
    };

    // Calculate total cost
    const selectedMotorcycle = motorcycles.find(m => m.id === parseInt(formData.motorcycleId));
    const totalCost = selectedMotorcycle.rate * formData.duration;

    // Create booking summary modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Booking Summary</h2>
            <div class="summary-details">
                <div class="summary-item">
                    <span class="summary-label">Motorcycle:</span>
                    <span class="summary-value">${selectedMotorcycle.name}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Pickup Date:</span>
                    <span class="summary-value">${formData.pickupDate}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Duration:</span>
                    <span class="summary-value">${formData.duration} days</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Location:</span>
                    <span class="summary-value">${formData.location}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total Cost:</span>
                    <span class="summary-value">₱${totalCost}</span>
                </div>
                ${formData.notes ? `
                <div class="summary-item">
                    <span class="summary-label">Notes:</span>
                    <span class="summary-value">${formData.notes}</span>
                </div>
                ` : ''}
            </div>
            <div class="payment-options">
                <h3>Payment Methods</h3>
                <div class="payment-buttons">
                    <button class="payment-button gcash">
                        <i class="fas fa-mobile-alt"></i>
                        Pay with GCash
                    </button>
                    <button class="payment-button bank">
                        <i class="fas fa-university"></i>
                        Bank Transfer
                    </button>
                    <button class="payment-button paypal">
                        <i class="fab fa-paypal"></i>
                        PayPal
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.remove();
    });

    // Handle payment button clicks
    modal.querySelectorAll('.payment-button').forEach(button => {
        button.addEventListener('click', () => {
            const paymentMethod = button.textContent.replace('Pay with ', '').trim();
            alert(`Please complete your payment through ${paymentMethod}. We will confirm your booking once payment is received.`);
            modal.remove();
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeMotorcycles();
    
    // Mobile menu
    mobileMenu.addEventListener('click', toggleMobileMenu);
    
    // Booking form
    bookingForm.addEventListener('submit', handleBookingSubmit);

    // Update total cost when motorcycle or duration changes
    motorcycleSelect.addEventListener('change', updateTotalCost);
    durationInput.addEventListener('input', updateTotalCost);

    // Search and filter
    searchInput.addEventListener('input', filterMotorcycles);
    priceFilter.addEventListener('change', filterMotorcycles);
    typeFilter.addEventListener('change', filterMotorcycles);
});

// Mobile menu toggle
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add scroll animation for sections
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});
