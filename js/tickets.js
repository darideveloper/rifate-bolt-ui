// JavaScript file for the tickets page
import '../styles/main.sass';
import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });

  // Mobile menu toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.querySelector('.nav__list');
  const hamburger = document.querySelector('.hamburger');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Constants for ticket grid
  const TICKETS_PER_PAGE = 200;
  const TOTAL_TICKETS = 1000;
  const TICKET_PRICE = 10;
  
  // Elements
  const ticketGrid = document.getElementById('ticketGrid');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const currentPageSpan = document.getElementById('currentPage');
  const totalPagesSpan = document.getElementById('totalPages');
  const ticketModal = document.getElementById('ticketModal');
  const modalClose = document.getElementById('modalClose');
  const selectedTicketNumber = document.getElementById('selectedTicketNumber');
  const reservationForm = document.getElementById('reservationForm');
  const confirmationModal = document.getElementById('confirmationModal');
  const confirmationClose = document.getElementById('confirmationClose');
  const confirmedTicketNumber = document.getElementById('confirmedTicketNumber');
  const confirmationDoneBtn = document.getElementById('confirmationDoneBtn');
  const ticketSearch = document.getElementById('ticketSearch');
  const searchBtn = document.getElementById('searchBtn');
  const filterSelect = document.getElementById('filterSelect');
  const apartarBtn = document.getElementById('apartarBtn');
  const selectedTicketsCount = document.getElementById('selectedTicketsCount');
  const selectedTicketsTotal = document.getElementById('selectedTicketsTotal');
  
  // State
  let currentPage = 1;
  const totalPages = Math.ceil(TOTAL_TICKETS / TICKETS_PER_PAGE);
  let ticketsData = {};
  let filteredTickets = [];
  let isFiltering = false;
  let selectedTickets = new Set();
  
  // Initialize
  initTicketsData();
  updateTotalPages();
  renderTicketGrid();
  setupEventListeners();

  function initTicketsData() {
    for (let i = 1; i <= TOTAL_TICKETS; i++) {
      const randomStatus = Math.random();
      let status = 'available';
      
      if (randomStatus < 0.1) {
        status = 'sold';
      } else if (randomStatus < 0.2) {
        status = 'reserved';
      }
      
      ticketsData[i] = {
        number: i,
        status: status
      };
    }
  }
  
  function updateTotalPages() {
    if (isFiltering) {
      const pages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE) || 1;
      if (totalPagesSpan) totalPagesSpan.textContent = pages;
      return pages;
    } else {
      if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
      return totalPages;
    }
  }
  
  function renderTicketGrid() {
    if (!ticketGrid) return;
    
    ticketGrid.innerHTML = '';
    
    let ticketsToRender;
    let startIdx;
    let endIdx;
    
    if (isFiltering) {
      startIdx = (currentPage - 1) * TICKETS_PER_PAGE;
      endIdx = Math.min(startIdx + TICKETS_PER_PAGE, filteredTickets.length);
      ticketsToRender = filteredTickets.slice(startIdx, endIdx);
    } else {
      const startNumber = (currentPage - 1) * TICKETS_PER_PAGE + 1;
      const endNumber = Math.min(startNumber + TICKETS_PER_PAGE - 1, TOTAL_TICKETS);
      
      ticketsToRender = [];
      for (let i = startNumber; i <= endNumber; i++) {
        ticketsToRender.push(ticketsData[i]);
      }
    }
    
    ticketsToRender.forEach(ticket => {
      const ticketElement = document.createElement('div');
      ticketElement.className = `ticket ticket--${ticket.status}`;
      if (selectedTickets.has(ticket.number)) {
        ticketElement.classList.add('ticket--selected');
      }
      ticketElement.dataset.number = ticket.number;
      ticketElement.textContent = ticket.number;
      
      if (ticket.status === 'available') {
        ticketElement.addEventListener('click', () => toggleTicketSelection(ticket.number));
      }
      
      ticketGrid.appendChild(ticketElement);
    });
    
    if (currentPageSpan) currentPageSpan.textContent = currentPage;
    updateSelectedTicketsInfo();
  }
  
  function toggleTicketSelection(number) {
    if (selectedTickets.has(number)) {
      selectedTickets.delete(number);
    } else {
      selectedTickets.add(number);
    }
    
    renderTicketGrid();
    updateSelectedTicketsInfo();
  }
  
  function updateSelectedTicketsInfo() {
    const count = selectedTickets.size;
    const total = count * TICKET_PRICE;
    
    if (selectedTicketsCount) selectedTicketsCount.textContent = count;
    if (selectedTicketsTotal) selectedTicketsTotal.textContent = total;
    if (apartarBtn) apartarBtn.disabled = count === 0;
  }
  
  function showReservationModal() {
    if (!ticketModal) return;
    
    const selectedCount = selectedTickets.size;
    const totalPrice = selectedCount * TICKET_PRICE;
    const ticketsStr = Array.from(selectedTickets).sort((a, b) => a - b).join(', ');
    
    if (selectedTicketNumber) {
      selectedTicketNumber.innerHTML = `
        <span style="color: #1a1c40">${ticketsStr}</span><br>
        <span class="total-price">Total a pagar: $${totalPrice}</span>
      `;
    }
    
    ticketModal.classList.add('active');
    resetFormErrors();
  }
  
  function setupEventListeners() {
    if (prevPageBtn) {
      prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderTicketGrid();
        }
      });
    }
    
    if (nextPageBtn) {
      nextPageBtn.addEventListener('click', () => {
        const maxPages = updateTotalPages();
        if (currentPage < maxPages) {
          currentPage++;
          renderTicketGrid();
        }
      });
    }
    
    if (modalClose) {
      modalClose.addEventListener('click', closeTicketModal);
    }
    
    if (reservationForm) {
      reservationForm.addEventListener('submit', handleReservationSubmit);
    }
    
    if (confirmationClose) {
      confirmationClose.addEventListener('click', closeConfirmationModal);
    }
    
    if (confirmationDoneBtn) {
      confirmationDoneBtn.addEventListener('click', closeConfirmationModal);
    }
    
    if (searchBtn) {
      searchBtn.addEventListener('click', handleTicketSearch);
    }
    
    if (ticketSearch) {
      ticketSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleTicketSearch();
        }
      });
    }
    
    if (filterSelect) {
      filterSelect.addEventListener('change', handleFilterChange);
    }
    
    if (apartarBtn) {
      apartarBtn.addEventListener('click', showReservationModal);
    }
    
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === ticketModal) {
        closeTicketModal();
      }
      if (e.target === confirmationModal) {
        closeConfirmationModal();
      }
    });

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTicketModal();
        closeConfirmationModal();
      }
    });
  }
  
  function closeTicketModal() {
    if (ticketModal) {
      ticketModal.classList.remove('active');
    }
    
    if (reservationForm) {
      reservationForm.reset();
    }
  }
  
  function handleReservationSubmit(e) {
    e.preventDefault();
    
    resetFormErrors();
    
    const fullName = document.getElementById('fullName').value.trim();
    const city = document.getElementById('city').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    
    let isValid = true;
    
    if (!fullName) {
      showError('fullNameError', 'Por favor ingresa tu nombre completo');
      isValid = false;
    }
    
    if (!city) {
      showError('cityError', 'Por favor ingresa tu ciudad');
      isValid = false;
    }
    
    if (!phoneNumber) {
      showError('phoneNumberError', 'Por favor ingresa tu número telefónico');
    } else if (!isValidPhoneNumber(phoneNumber)) {
      showError('phoneNumberError', 'Ingresa un número telefónico válido');
      isValid = false;
    }
    
    if (!userEmail) {
      showError('userEmailError', 'Por favor ingresa tu correo electrónico');
    } else if (!isValidEmail(userEmail)) {
      showError('userEmailError', 'Ingresa un correo electrónico válido');
      isValid = false;
    }
    
    if (isValid) {
      // Update ticket status for all selected tickets
      selectedTickets.forEach(number => {
        if (ticketsData[number]) {
          ticketsData[number].status = 'reserved';
        }
      });
      
      // Show confirmation modal
      if (confirmedTicketNumber) {
        confirmedTicketNumber.textContent = Array.from(selectedTickets).sort((a, b) => a - b).join(', ');
      }
      
      closeTicketModal();
      
      if (confirmationModal) {
        confirmationModal.classList.add('active');
      }
    }
  }
  
  function closeConfirmationModal() {
    if (confirmationModal) {
      confirmationModal.classList.remove('active');
    }
    
    selectedTickets.clear();
    renderTicketGrid();
  }
  
  function resetFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
      element.textContent = '';
    });
  }
  
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }
  
  function isValidPhoneNumber(phone) {
    return /^\d{10,15}$/.test(phone.replace(/[\s-()]/g, ''));
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function handleTicketSearch() {
    if (!ticketSearch) return;
    
    const searchValue = ticketSearch.value.trim();
    
    if (!searchValue) {
      isFiltering = false;
      currentPage = 1;
      renderTicketGrid();
      return;
    }
    
    if (!isNaN(searchValue) && searchValue > 0 && searchValue <= TOTAL_TICKETS) {
      const ticketNumber = parseInt(searchValue);
      
      currentPage = Math.ceil(ticketNumber / TICKETS_PER_PAGE);
      isFiltering = false;
      renderTicketGrid();
      
      setTimeout(() => {
        const ticketElement = document.querySelector(`.ticket[data-number="${ticketNumber}"]`);
        if (ticketElement) {
          ticketElement.classList.add('ticket--highlight');
          ticketElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          setTimeout(() => {
            ticketElement.classList.remove('ticket--highlight');
          }, 3000);
        }
      }, 100);
    } else {
      alert('Por favor ingresa un número de boleto válido entre 1 y ' + TOTAL_TICKETS);
    }
  }
  
  function handleFilterChange() {
    if (!filterSelect) return;
    
    const filterValue = filterSelect.value;
    
    if (filterValue === 'all') {
      isFiltering = false;
      currentPage = 1;
      renderTicketGrid();
      return;
    }
    
    filteredTickets = Object.values(ticketsData).filter(ticket => ticket.status === filterValue);
    isFiltering = true;
    currentPage = 1;
    updateTotalPages();
    renderTicketGrid();
  }
});