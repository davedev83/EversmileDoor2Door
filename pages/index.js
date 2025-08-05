import Head from 'next/head';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [visits, setVisits] = useState([]);
  const [editingVisit, setEditingVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const visitsPerPage = 10;

  useEffect(() => {
    loadVisits();

    // Check for admin mode in URL
    const urlParams = new URLSearchParams(window.location.search);
    setIsAdminMode(urlParams.has('admin'));
  }, []);

  const loadVisits = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/visits?page=${page}&limit=${visitsPerPage}`);
      const data = await response.json();
      setVisits(data.visits || data); // Handle both paginated and non-paginated responses
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewVisit = () => {
    setEditingVisit(null);
    setCurrentView('form');
  };

  const handleEditVisit = (visit) => {
    setEditingVisit(visit);
    if (visit.visitDate) {
      // Parse the date string and create a proper Date object
      const dateStr = visit.visitDate.includes('T') ? visit.visitDate : visit.visitDate + 'T12:00:00';
      setSelectedDate(new Date(dateStr));
    }
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingVisit(null);
    setSelectedDate(new Date()); // Reset date to today
    loadVisits(); // Refresh the list
  };

  const handleDeleteVisit = async (visitId, practiceName) => {
    if (!confirm(`Are you sure you want to delete the visit for "${practiceName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/visits?id=${visitId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the visits list
        loadVisits(currentPage);
      } else {
        alert('Error deleting visit: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting visit:', error);
      alert('Error deleting visit. Please try again.');
    }
  };



  useEffect(() => {
    if (currentView === 'form') {
      // Load the multistep form functionality
      class MultiStepForm {
      constructor(existingData = null) {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.formData = {};
        this.existingData = existingData;
        this.isEditing = !!existingData;
        this.originalStatus = existingData?.status || null; // Track original status

        this.init();
      }

      init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.populateYearOptions();
        this.updateProgress();
        this.setupSwipeGestures();

        // Populate existing data if editing
        if (this.isEditing) {
          this.populateExistingData();
        }
      }

      setupEventListeners() {
        // Navigation buttons
        document.getElementById('nextBtn')?.addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn')?.addEventListener('click', () => this.prevStep());

        // Sample quantity controls
        this.setupQuantityControls();

        // Sample toggle
        this.setupSampleToggle();

        // Credit card toggle
        this.setupCreditCardToggle();

        // Other checkbox toggle
        document.getElementById('otherCheckbox')?.addEventListener('change', (e) => {
          const otherGroup = document.getElementById('otherSampleGroup');
          if (otherGroup) {
            otherGroup.style.display = e.target.checked ? 'block' : 'none';
            if (!e.target.checked) {
              const otherSample = document.getElementById('otherSample');
              if (otherSample) otherSample.value = '';
            }
          }
        });

        // Credit card number formatting
        document.getElementById('cardNumber')?.addEventListener('input', this.formatCardNumber);

        // CVV validation
        document.getElementById('cvv')?.addEventListener('input', this.formatCVV);

        // Form validation on input
        document.querySelectorAll('input, textarea, select').forEach(input => {
          input.addEventListener('input', () => this.validateCurrentStep());
        });

        // Checkbox validation
        document.querySelectorAll('input[name="samplesProvided"]').forEach(checkbox => {
          checkbox.addEventListener('change', () => this.validateCurrentStep());
        });

        // Date input container click handler
        this.setupDateInputClick();
      }

      setDefaultDate() {
        // Set the React state for the date picker
        setSelectedDate(new Date());
      }

      populateYearOptions() {
        const yearSelect = document.getElementById('expiryYear');
        if (!yearSelect) return;
        
        const currentYear = new Date().getFullYear();
        
        for (let i = 0; i < 15; i++) {
          const year = currentYear + i;
          const option = document.createElement('option');
          option.value = year;
          option.textContent = year;
          yearSelect.appendChild(option);
        }
      }

      formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
      }

      formatCVV(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
      }

      setupDateInputClick() {
        const dateContainer = document.querySelector('.date-input-container');
        const dateInput = document.querySelector('.date-picker-input');

        if (dateContainer && dateInput) {
          dateContainer.addEventListener('click', (e) => {
            // If the click is not directly on the input, focus it to open the calendar
            if (e.target !== dateInput) {
              dateInput.focus();
              // Trigger a click event on the input to open the calendar
              dateInput.click();
            }
          });
        }
      }

      setupSampleToggle() {
        const sampleToggle = document.getElementById('sampleToggle');
        const samplesList = document.getElementById('samplesList');

        if (sampleToggle && samplesList) {
          sampleToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
              samplesList.style.display = 'block';
            } else {
              samplesList.style.display = 'none';
              // Reset all quantities when hiding samples
              this.resetSampleQuantities();
            }
            this.validateCurrentStep();
          });
        }
      }

      setupCreditCardToggle() {
        const creditCardToggle = document.getElementById('creditCardToggle');
        const creditCardFields = document.getElementById('creditCardFields');

        if (creditCardToggle && creditCardFields) {
          creditCardToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
              creditCardFields.style.display = 'block';
            } else {
              creditCardFields.style.display = 'none';
              // Clear credit card fields when hiding
              this.clearCreditCardFields();
            }
            this.validateCurrentStep();
          });
        }
      }

      resetSampleQuantities() {
        const samples = ['alignerfresh-mint', 'alignerfresh-flavors', 'allclean-minerals', 'ipr-glide', 'other'];
        samples.forEach(sample => {
          const quantitySpan = document.getElementById(`${sample}-quantity`);
          const sampleItem = document.getElementById(`${sample}-item`);
          if (quantitySpan) quantitySpan.textContent = '0';
          if (sampleItem) sampleItem.classList.remove('has-quantity');
        });

        // Hide other sample group
        const otherGroup = document.getElementById('otherSampleGroup');
        const otherSample = document.getElementById('otherSample');
        if (otherGroup) otherGroup.style.display = 'none';
        if (otherSample) otherSample.value = '';
      }

      clearCreditCardFields() {
        const fields = ['cardName', 'cardNumber', 'expiryMonth', 'expiryYear', 'cvv'];
        fields.forEach(fieldId => {
          const field = document.getElementById(fieldId);
          if (field) field.value = '';
        });
      }

      populateExistingData() {
        if (!this.existingData) return;

        const data = this.existingData;

        // Populate basic fields
        if (data.visitDate) {
          // Parse the date string and create a proper Date object
          // Add 'T12:00:00' to ensure we get the correct date regardless of timezone
          const dateStr = data.visitDate.includes('T') ? data.visitDate : data.visitDate + 'T12:00:00';
          setSelectedDate(new Date(dateStr));
        }

        if (data.practiceName) {
          const practiceName = document.getElementById('practiceName');
          if (practiceName) practiceName.value = data.practiceName;
        }

        if (data.phone) {
          const phone = document.getElementById('phone');
          if (phone) phone.value = data.phone;
        }

        if (data.email) {
          const email = document.getElementById('email');
          if (email) email.value = data.email;
        }

        if (data.address) {
          const address = document.getElementById('address');
          if (address) address.value = data.address;
        }

        if (data.topicsDiscussed) {
          const topicsDiscussed = document.getElementById('topicsDiscussed');
          if (topicsDiscussed) topicsDiscussed.value = data.topicsDiscussed;
        }

        if (data.otherSample) {
          const otherSample = document.getElementById('otherSample');
          if (otherSample) otherSample.value = data.otherSample;
        }

        // Populate samples
        if (data.samplesProvided && data.samplesProvided.length > 0) {
          const sampleToggle = document.getElementById('sampleToggle');
          const samplesList = document.getElementById('samplesList');
          if (sampleToggle) sampleToggle.checked = true;
          if (samplesList) samplesList.style.display = 'block';

          data.samplesProvided.forEach(sample => {
            if (typeof sample === 'object' && sample.name && sample.quantity) {
              const sampleId = this.getSampleId(sample.name);
              const quantitySpan = document.getElementById(`${sampleId}-quantity`);
              const sampleItem = document.getElementById(`${sampleId}-item`);
              if (quantitySpan) quantitySpan.textContent = sample.quantity;
              if (sampleItem && sample.quantity > 0) sampleItem.classList.add('has-quantity');

              if (sample.name === 'Other' && data.otherSample) {
                const otherGroup = document.getElementById('otherSampleGroup');
                if (otherGroup) otherGroup.style.display = 'block';
              }
            }
          });
        }

        // Populate credit card
        if (data.creditCard) {
          const creditCardToggle = document.getElementById('creditCardToggle');
          const creditCardFields = document.getElementById('creditCardFields');
          if (creditCardToggle) creditCardToggle.checked = true;
          if (creditCardFields) creditCardFields.style.display = 'block';

          if (data.creditCard.name) {
            const cardName = document.getElementById('cardName');
            if (cardName) cardName.value = data.creditCard.name;
          }

          if (data.creditCard.number) {
            const cardNumber = document.getElementById('cardNumber');
            if (cardNumber) cardNumber.value = data.creditCard.number;
          }

          if (data.creditCard.expiryMonth) {
            const expiryMonth = document.getElementById('expiryMonth');
            if (expiryMonth) expiryMonth.value = data.creditCard.expiryMonth;
          }

          if (data.creditCard.expiryYear) {
            const expiryYear = document.getElementById('expiryYear');
            if (expiryYear) expiryYear.value = data.creditCard.expiryYear;
          }

          if (data.creditCard.cvv) {
            const cvv = document.getElementById('cvv');
            if (cvv) cvv.value = data.creditCard.cvv;
          }
        }
      }

      getSampleId(sampleName) {
        const mapping = {
          'AlignerFresh Mint': 'alignerfresh-mint',
          'AlignerFresh Flavors': 'alignerfresh-flavors',
          'AllClean Minerals': 'allclean-minerals',
          'IPR Glide': 'ipr-glide',
          'Other': 'other'
        };
        return mapping[sampleName] || sampleName.toLowerCase().replace(/\s+/g, '-');
      }

      setupQuantityControls() {
        // Setup quantity controls for each sample
        const samples = ['alignerfresh-mint', 'alignerfresh-flavors', 'allclean-minerals', 'ipr-glide', 'other'];

        samples.forEach(sample => {
          const plusBtn = document.getElementById(`${sample}-plus`);
          const minusBtn = document.getElementById(`${sample}-minus`);
          const quantitySpan = document.getElementById(`${sample}-quantity`);
          const sampleItem = document.getElementById(`${sample}-item`);

          if (plusBtn && minusBtn && quantitySpan && sampleItem) {
            plusBtn.addEventListener('click', () => {
              let quantity = parseInt(quantitySpan.textContent) || 0;
              quantity++;
              quantitySpan.textContent = quantity;

              // Update visual state
              if (quantity > 0) {
                sampleItem.classList.add('has-quantity');
              }

              // Show other sample text field if "other" is selected
              if (sample === 'other' && quantity > 0) {
                const otherGroup = document.getElementById('otherSampleGroup');
                if (otherGroup) otherGroup.style.display = 'block';
              }

              this.validateCurrentStep();
            });

            minusBtn.addEventListener('click', () => {
              let quantity = parseInt(quantitySpan.textContent) || 0;
              if (quantity > 0) {
                quantity--;
                quantitySpan.textContent = quantity;

                // Update visual state
                if (quantity === 0) {
                  sampleItem.classList.remove('has-quantity');
                }

                // Hide other sample text field if "other" quantity is 0
                if (sample === 'other' && quantity === 0) {
                  const otherGroup = document.getElementById('otherSampleGroup');
                  const otherSample = document.getElementById('otherSample');
                  if (otherGroup) otherGroup.style.display = 'none';
                  if (otherSample) otherSample.value = '';
                }

                this.validateCurrentStep();
              }
            });
          }
        });
      }

      setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
          if (!startX || !startY) return;

          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          
          const diffX = startX - endX;
          const diffY = startY - endY;

          // Only trigger swipe if horizontal movement is greater than vertical
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
              // Swipe left - next step
              this.nextStep();
            } else {
              // Swipe right - previous step
              this.prevStep();
            }
          }

          startX = 0;
          startY = 0;
        });
      }

      validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return false;
        
        const requiredInputs = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        // Special validation for step 3 (samples)
        if (this.currentStep === 3) {
          const sampleToggle = document.getElementById('sampleToggle');
          if (sampleToggle && sampleToggle.checked) {
            // If samples are enabled, check if any sample has quantity > 0
            const samples = ['alignerfresh-mint', 'alignerfresh-flavors', 'allclean-minerals', 'ipr-glide', 'other'];
            isValid = samples.some(sample => {
              const quantitySpan = document.getElementById(`${sample}-quantity`);
              return quantitySpan && parseInt(quantitySpan.textContent) > 0;
            });
          } else {
            // If no samples provided, that's valid
            isValid = true;
          }
        } else if (this.currentStep === 4) {
          // Step 4 (topics) - not required for drafts, always valid for navigation
          isValid = true;
        } else if (this.currentStep === 5) {
          // Special validation for step 5 (credit card)
          const creditCardToggle = document.getElementById('creditCardToggle');
          if (creditCardToggle && creditCardToggle.checked) {
            // If credit card is enabled, validate required fields
            const creditCardFields = currentStepElement.querySelectorAll('#creditCardFields [required]');
            creditCardFields.forEach(input => {
              if (!input.value.trim()) {
                isValid = false;
              }
            });
          } else {
            // If no credit card info provided, that's valid
            isValid = true;
          }
        } else {
          // Regular validation for other steps
          requiredInputs.forEach(input => {
            if (!input.value.trim()) {
              isValid = false;
            }
          });
        }

        // Update next button state
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.disabled = !isValid;
        
        return isValid;
      }

      collectFormData() {
        const formData = new FormData(document.getElementById('visitForm'));
        const data = {};

        // Add the selected date from React DatePicker
        if (selectedDate) {
          // Use toLocaleDateString to get the exact date the user sees
          const dateString = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
          data.visitDate = dateString;
        }

        // Regular form fields
        for (let [key, value] of formData.entries()) {
          if (key !== 'visitDate' && value.trim()) { // Skip visitDate as we handle it above
            data[key] = value;
          }
        }

        // Collect sample quantities
        const sampleToggle = document.getElementById('sampleToggle');
        data.samplesProvided = [];

        if (sampleToggle && sampleToggle.checked) {
          const samples = [
            { id: 'alignerfresh-mint', name: 'AlignerFresh Mint' },
            { id: 'alignerfresh-flavors', name: 'AlignerFresh Flavors' },
            { id: 'allclean-minerals', name: 'AllClean Minerals' },
            { id: 'ipr-glide', name: 'IPR Glide' },
            { id: 'other', name: 'Other' }
          ];

          samples.forEach(sample => {
            const quantitySpan = document.getElementById(`${sample.id}-quantity`);
            const quantity = quantitySpan ? parseInt(quantitySpan.textContent) || 0 : 0;
            if (quantity > 0) {
              data.samplesProvided.push({
                name: sample.name,
                quantity: quantity
              });
            }
          });
        }

        // Credit card data
        const creditCardToggle = document.getElementById('creditCardToggle');
        if (creditCardToggle && creditCardToggle.checked) {
          data.creditCard = {
            number: data.cardNumber,
            expiryMonth: data.expiryMonth,
            expiryYear: data.expiryYear,
            cvv: data.cvv,
            name: data.cardName
          };
        } else {
          data.creditCard = null;
        }

        // Clean up individual credit card fields
        delete data.cardNumber;
        delete data.expiryMonth;
        delete data.expiryYear;
        delete data.cvv;
        delete data.cardName;

        return data;
      }

      displayReview() {
        const data = this.collectFormData();
        const reviewSection = document.getElementById('reviewSection');
        if (!reviewSection) return;
        
        const reviewHTML = `
          <div class="review-item">
            <div class="review-label">Visit Date:</div>
            <div class="review-value">${new Date(data.visitDate).toLocaleDateString()}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Practice Name:</div>
            <div class="review-value">${data.practiceName}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Phone:</div>
            <div class="review-value">${data.phone}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Email:</div>
            <div class="review-value">${data.email}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Address:</div>
            <div class="review-value">${data.address}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Samples Provided:</div>
            <div class="review-value">${data.samplesProvided && data.samplesProvided.length > 0 ?
              data.samplesProvided.map(sample => `${sample.name}: ${sample.quantity}`).join(', ') : 'None'}</div>
          </div>
          ${data.otherSample ? `
          <div class="review-item">
            <div class="review-label">Other Sample:</div>
            <div class="review-value">${data.otherSample}</div>
          </div>
          ` : ''}
          <div class="review-item">
            <div class="review-label">Topics Discussed:</div>
            <div class="review-value">${data.topicsDiscussed}</div>
          </div>
          ${data.creditCard && data.creditCard.number ? `
          <div class="review-item">
            <div class="review-label">Credit Card:</div>
            <div class="review-value">**** **** **** ${data.creditCard.number.slice(-4)}</div>
          </div>
          ` : `
          <div class="review-item">
            <div class="review-label">Credit Card:</div>
            <div class="review-value">Not provided</div>
          </div>
          `}
        `;
        
        reviewSection.innerHTML = reviewHTML;
      }

      async saveDraft() {
        try {
          const data = this.collectFormData();
          data.status = 'draft';

          // If editing existing visit, update it
          if (this.isEditing) {
            data._id = this.existingData._id;
          }

          const url = '/api/visits';
          const method = this.isEditing ? 'PUT' : 'POST';

          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });

          const result = await response.json();

          if (result.success) {
            // Update the form to editing mode if it was a new visit
            if (!this.isEditing) {
              this.isEditing = true;
              this.existingData = { ...data, _id: result.visitId };
            }

            // Show brief success message
            this.showDraftSavedMessage();
          }
        } catch (error) {
          console.error('Error saving draft:', error);
          // Don't block the user if draft save fails
        }
      }

      showDraftSavedMessage() {
        // Create or update draft saved indicator
        let indicator = document.getElementById('draftIndicator');
        if (!indicator) {
          indicator = document.createElement('div');
          indicator.id = 'draftIndicator';
          indicator.className = 'draft-indicator';
          document.querySelector('.breadcrumb-container').appendChild(indicator);
        }

        indicator.innerHTML = '✓ Draft saved';
        indicator.style.display = 'block';

        // Hide after 3 seconds
        setTimeout(() => {
          if (indicator) {
            indicator.style.display = 'none';
          }
        }, 3000);
      }

      async submitForm() {
        const submitStatus = document.getElementById('submitStatus');
        const nextBtn = document.getElementById('nextBtn');

        if (!submitStatus || !nextBtn) return;

        try {
          let actionText;
          if (this.isEditing && this.originalStatus === 'saved') {
            actionText = 'Updating visit data...';
          } else {
            actionText = 'Saving visit data...';
          }
          submitStatus.innerHTML = `<div class="loading">${actionText}</div>`;
          submitStatus.className = 'submit-status loading';
          nextBtn.disabled = true;

          const data = this.collectFormData();

          // Add status and ID for updates
          if (this.isEditing) {
            data._id = this.existingData._id;
            data.status = 'saved'; // Mark as saved when updating
            data.isRealUpdate = this.originalStatus === 'saved'; // Only true updates get [UPDATE] email
          } else {
            data.status = 'saved'; // New visits are saved
          }

          const url = '/api/visits';
          const method = this.isEditing ? 'PUT' : 'POST';

          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });

          const result = await response.json();

          if (result.success) {
            let successText;
            if (this.isEditing && this.originalStatus === 'saved') {
              successText = '✅ Visit updated successfully!';
            } else {
              successText = '✅ Visit saved successfully!';
            }
            submitStatus.innerHTML = `<div class="success">${successText}</div>`;
            submitStatus.className = 'submit-status success';
            nextBtn.style.display = 'none';

            // Go back to list after 2 seconds
            setTimeout(() => {
              handleBackToList();
            }, 2000);
          } else {
            throw new Error(result.error || 'Failed to save visit data');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          submitStatus.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
          submitStatus.className = 'submit-status error';
          nextBtn.disabled = false;
        }
      }

      resetForm() {
        this.currentStep = 1;
        const form = document.getElementById('visitForm');
        if (form) form.reset();

        // Reset sample toggle and quantities
        const sampleToggle = document.getElementById('sampleToggle');
        const samplesList = document.getElementById('samplesList');
        if (sampleToggle) sampleToggle.checked = false;
        if (samplesList) samplesList.style.display = 'none';
        this.resetSampleQuantities();

        // Reset credit card toggle
        const creditCardToggle = document.getElementById('creditCardToggle');
        const creditCardFields = document.getElementById('creditCardFields');
        if (creditCardToggle) creditCardToggle.checked = false;
        if (creditCardFields) creditCardFields.style.display = 'none';

        this.setDefaultDate();
        setSelectedDate(new Date()); // Reset date picker to today
        this.showStep(1);
        this.updateProgress();
        this.updateNavigation();
        const submitStatus = document.getElementById('submitStatus');
        if (submitStatus) submitStatus.innerHTML = '';
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.style.display = 'block';
      }

      async nextStep() {
        if (!this.validateCurrentStep()) return;

        if (this.currentStep === this.totalSteps) {
          this.submitForm();
          return;
        }

        // Auto-save as draft after practice information (step 2)
        if (this.currentStep === 2) {
          await this.saveDraft();
        }

        if (this.currentStep < this.totalSteps) {
          this.currentStep++;
          this.showStep(this.currentStep);
          this.updateProgress();
          this.updateNavigation();

          if (this.currentStep === this.totalSteps) {
            this.displayReview();
          }
        }
      }

      prevStep() {
        if (this.currentStep > 1) {
          this.currentStep--;
          this.showStep(this.currentStep);
          this.updateProgress();
          this.updateNavigation();
        }
      }

      showStep(step) {
        document.querySelectorAll('.form-step').forEach(stepElement => {
          stepElement.classList.remove('active');
        });
        
        const targetStep = document.querySelector(`[data-step="${step}"]`);
        if (targetStep) targetStep.classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
      }

      updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const currentStepSpan = document.getElementById('currentStep');
        
        if (progressFill) {
          const progressPercentage = (this.currentStep / this.totalSteps) * 100;
          progressFill.style.width = `${progressPercentage}%`;
        }
        
        if (currentStepSpan) {
          currentStepSpan.textContent = this.currentStep;
        }
      }

      updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) prevBtn.disabled = this.currentStep === 1;

        if (nextBtn) {
          const btnText = nextBtn.querySelector('.btn-text');
          if (btnText) {
            if (this.currentStep === this.totalSteps) {
              // Determine button text based on visit status
              if (this.isEditing && this.originalStatus === 'saved') {
                btnText.textContent = 'Update';
              } else {
                btnText.textContent = 'Save';
              }
            } else {
              btnText.textContent = 'Next';
            }
          }
        }

        this.validateCurrentStep();
      }
    }

      // Initialize the form
      new MultiStepForm(editingVisit);
    }
  }, [currentView]);

  if (currentView === 'list') {
    return (
      <>
        <Head>
          <title>Door2Door Marketing - Visits</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <style jsx global>{`
          /* Reset and Base Styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #C7E8FF;
            color: #333;
            line-height: 1.6;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .app-container {
            max-width: 500px;
            margin: 0 auto;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }

          .header {
            background: white;
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .logo-container {
            text-align: center;
            margin-bottom: 20px;
          }

          .logo {
            max-height: 60px;
            width: auto;
          }

          .admin-indicator {
            background: #dc3545;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 10px;
            text-align: center;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }

          .add-visit-btn {
            width: 100%;
            padding: 16px 24px;
            font-size: 18px;
            font-weight: 600;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
            background: linear-gradient(135deg, #127BB8, #0f6ba3);
            color: white;
            margin-bottom: 30px;
          }

          .add-visit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(18, 123, 184, 0.3);
          }

          .visits-container {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
          }

          .visits-title {
            font-size: 24px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
          }

          .visit-card {
            background: #f8f9fa;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .visit-card:hover {
            background: #C7E8FF;
            border-color: #127BB8;
            transform: translateY(-2px);
          }

          .visit-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .practice-name {
            font-size: 18px;
            font-weight: 600;
            color: #333;
          }

          .visit-status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .status-saved {
            background: #C7E8FF;
            color: #127BB8;
          }

          .status-draft {
            background: #fde7f0;
            color: #ED337D;
          }

          .visit-card.draft {
            border-left: 4px solid #ED337D;
          }

          .visit-card.saved {
            border-left: 4px solid #127BB8;
          }

          /* Admin Mode Styles */
          .visit-card.admin-mode {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 16px 20px 16px 16px;
          }

          .visit-content {
            flex: 1;
            cursor: pointer;
          }

          .visit-card.admin-mode .visit-content:hover {
            opacity: 0.8;
          }

          .delete-btn {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 44px;
            height: 44px;
          }

          .delete-btn:hover {
            background: #c82333;
            transform: scale(1.05);
          }

          .delete-btn:active {
            transform: scale(0.95);
          }

          /* Pagination */
          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 30px;
            padding: 20px;
          }

          .pagination-btn {
            padding: 12px 20px;
            background: #127BB8;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
          }

          .pagination-btn:hover:not(:disabled) {
            background: #0f6ba3;
            transform: translateY(-1px);
          }

          .pagination-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
          }

          .pagination-info {
            font-size: 14px;
            font-weight: 600;
            color: #666;
          }

          .visit-details {
            font-size: 14px;
            color: #666;
            line-height: 1.4;
          }

          .visit-date {
            font-weight: 500;
            color: #333;
          }

          .loading {
            text-align: center;
            padding: 40px;
            font-size: 16px;
            color: #666;
          }

          .no-visits {
            text-align: center;
            padding: 40px;
            color: #666;
          }

          .no-visits h3 {
            margin-bottom: 10px;
            color: #333;
          }

          @media (max-width: 480px) {
            .app-container {
              max-width: 100%;
            }

            .header {
              padding: 15px;
            }

            .visits-container {
              padding: 15px;
            }
          }
        `}</style>

        <div className="app-container">
          <header className="header">
            <div className="logo-container">
              <img src="/logo.png" alt="Company Logo" className="logo" />
              {isAdminMode && (
                <div className="admin-indicator">
                  🔧 Admin Mode - Delete visits enabled
                </div>
              )}
            </div>
          </header>

          <main className="visits-container">
            <button className="add-visit-btn" onClick={handleAddNewVisit}>
              + Add New Visit
            </button>
            <h2 className="visits-title">Recent Visits</h2>

            {loading ? (
              <div className="loading">Loading visits...</div>
            ) : visits.length === 0 ? (
              <div className="no-visits">
                <h3>No visits recorded yet</h3>
                <p>Click "Add New Visit" to get started</p>
              </div>
            ) : (
              visits.map((visit) => (
                <div
                  key={visit._id}
                  className={`visit-card ${visit.status || 'saved'} ${isAdminMode ? 'admin-mode' : ''}`}
                >
                  <div
                    className="visit-content"
                    onClick={() => handleEditVisit(visit)}
                  >
                    <div className="visit-header">
                      <div className="practice-name">{visit.practiceName}</div>
                      <div className={`visit-status ${visit.status === 'saved' ? 'status-saved' : 'status-draft'}`}>
                        {visit.status || 'saved'}
                      </div>
                    </div>
                    <div className="visit-details">
                      <div className="visit-date">
                        {new Date(visit.visitDate).toLocaleDateString()}
                      </div>
                      <div>{visit.phone}</div>
                      <div>{visit.email}</div>
                    </div>
                  </div>
                  {isAdminMode && (
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVisit(visit._id, visit.practiceName);
                      }}
                      title="Delete visit"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))
            )}

            {/* Pagination */}
            {!loading && visits.length > 0 && totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => loadVisits(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => loadVisits(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Door2Door Marketing - Visit Form</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #C7E8FF;
          color: #333;
          line-height: 1.6;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* App Container */
        .app-container {
          max-width: 500px;
          margin: 0 auto;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: white;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .header {
          background: white;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        /* Breadcrumb Navigation */
        .breadcrumb-container {
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
          padding: 12px 20px;
          position: relative;
        }

        .breadcrumb-btn {
          background: none;
          border: none;
          color: #127BB8;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .breadcrumb-btn:hover {
          color: #0f6ba3;
          text-decoration: underline;
        }

        .draft-indicator {
          display: none;
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: #C7E8FF;
          color: #127BB8;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          animation: fadeInOut 0.3s ease;
        }

        @keyframes fadeInOut {
          from { opacity: 0; transform: translateY(-50%) translateX(10px); }
          to { opacity: 1; transform: translateY(-50%) translateX(0); }
        }

        .logo-container {
          text-align: center;
          margin-bottom: 20px;
        }

        .logo {
          max-height: 60px;
          width: auto;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #127BB8, #0f6ba3);
          border-radius: 4px;
          transition: width 0.3s ease;
          width: 16.67%; /* 1/6 steps */
        }

        .progress-text {
          font-size: 14px;
          font-weight: 500;
          color: #666;
          white-space: nowrap;
        }

        /* Form Container */
        .form-container {
          flex: 1;
          padding: 30px 20px;
          overflow-y: auto;
        }

        .multistep-form {
          position: relative;
          height: 100%;
        }

        .form-step {
          display: none;
          animation: fadeIn 0.3s ease-in-out;
        }

        .form-step.active {
          display: block;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .step-title {
          font-size: 28px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
        }

        /* Input Groups */
        .input-group {
          margin-bottom: 25px;
        }

        .input-group label {
          display: block;
          font-size: 16px;
          font-weight: 500;
          color: #555;
          margin-bottom: 8px;
        }

        .input-group input,
        .input-group textarea,
        .input-group select {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .input-group input:focus,
        .input-group textarea:focus,
        .input-group select:focus {
          outline: none;
          border-color: #127BB8;
          box-shadow: 0 0 0 3px rgba(18, 123, 184, 0.1);
        }

        .input-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        /* Date Input Group */
        .date-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .date-input-group label {
          font-weight: 600;
          color: #333;
          font-size: 16px;
          margin-bottom: 0;
        }

        /* Date Input Container with Icon */
        .date-input-container {
          position: relative;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        /* Date Picker Styling */
        .date-picker-input {
          width: 100%;
          padding: 16px 50px 16px 16px !important;
          font-size: 16px !important;
          border: 2px solid #e0e0e0 !important;
          border-radius: 12px !important;
          background: white !important;
          transition: all 0.3s ease !important;
          font-family: inherit !important;
          cursor: pointer !important;
        }

        /* Calendar Icon */
        .calendar-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #666;
          pointer-events: none;
          z-index: 1;
        }

        .date-picker-input:focus {
          outline: none !important;
          border-color: #127BB8 !important;
          box-shadow: 0 0 0 3px rgba(18, 123, 184, 0.1) !important;
        }

        .date-input-container:hover .date-picker-input {
          border-color: #127BB8 !important;
        }

        .date-input-container:hover .calendar-icon {
          color: #127BB8;
        }

        .date-picker-popper {
          z-index: 1000 !important;
        }

        .date-picker-calendar {
          border: 2px solid #e0e0e0 !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          font-family: inherit !important;
          max-height: 400px !important;
          overflow: visible !important;
        }

        .react-datepicker__header {
          background: #127BB8 !important;
          border-bottom: none !important;
          border-radius: 10px 10px 0 0 !important;
        }

        .react-datepicker__current-month {
          color: white !important;
          font-weight: 600 !important;
          font-size: 16px !important;
        }

        .react-datepicker__day-name {
          color: white !important;
          font-weight: 500 !important;
        }

        .react-datepicker__navigation {
          top: 12px !important;
        }

        .react-datepicker__navigation--previous {
          border-right-color: white !important;
        }

        .react-datepicker__navigation--next {
          border-left-color: white !important;
        }

        .react-datepicker__day {
          width: 2.5rem !important;
          height: 2.5rem !important;
          line-height: 2.5rem !important;
          margin: 0.2rem !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }

        .react-datepicker__day:hover {
          background: #C7E8FF !important;
          border-radius: 8px !important;
        }

        .react-datepicker__day--selected {
          background: #127BB8 !important;
          color: white !important;
          border-radius: 8px !important;
        }

        .react-datepicker__day--today {
          background: #f0f8ff !important;
          color: #127BB8 !important;
          font-weight: 600 !important;
        }

        .react-datepicker__day--keyboard-selected {
          background: #C7E8FF !important;
          color: #333 !important;
        }

        /* Ensure calendar is always visible */
        .react-datepicker-popper {
          z-index: 9999 !important;
        }

        .react-datepicker-wrapper {
          flex: 1;
          min-width: 200px;
        }

        /* Fix for calendar positioning */
        .react-datepicker {
          border: 2px solid #e0e0e0 !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          font-family: inherit !important;
        }

        /* Toggle Switch */
        .toggle-container {
          margin-bottom: 25px;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
          margin-left: 15px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #127BB8;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        /* Input Row for Credit Card */
        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
        }

        /* Sample Group */
        .sample-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .sample-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: #f8f9fa;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          transition: all 0.3s ease;
          font-size: 16px;
          font-weight: 500;
        }

        .sample-item:hover {
          background: #C7E8FF;
          border-color: #127BB8;
        }

        .sample-item.has-quantity {
          background: #C7E8FF;
          border-color: #127BB8;
        }

        .sample-name {
          flex: 1;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quantity-btn {
          width: 36px;
          height: 36px;
          border: 2px solid #127BB8;
          background: white;
          color: #127BB8;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quantity-btn:hover {
          background: #127BB8;
          color: white;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          min-width: 30px;
          text-align: center;
          font-weight: 600;
          font-size: 16px;
          color: #333;
        }

        /* Navigation */
        .navigation {
          padding: 20px;
          background: white;
          border-top: 1px solid #e0e0e0;
          display: flex;
          gap: 15px;
        }

        .nav-btn {
          flex: 1;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .prev-btn {
          background: #f8f9fa;
          color: #666;
          border: 2px solid #e0e0e0;
        }

        .prev-btn:not(:disabled):hover {
          background: #e9ecef;
          border-color: #ccc;
        }

        .prev-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .next-btn {
          background: linear-gradient(135deg, #127BB8, #0f6ba3);
          color: white;
          border: 2px solid transparent;
        }

        .next-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(18, 123, 184, 0.3);
        }

        .next-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }



        /* Review Section */
        .review-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .review-item {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .review-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .review-label {
          font-weight: 600;
          color: #555;
          margin-bottom: 5px;
        }

        .review-value {
          color: #333;
        }

        /* Submit Status */
        .submit-status {
          text-align: center;
          padding: 20px;
          border-radius: 12px;
          margin-top: 20px;
        }

        .submit-status.success {
          background: #C7E8FF;
          color: #127BB8;
          border: 1px solid #9dd4f7;
        }

        .submit-status.error {
          background: #fde7f0;
          color: #ED337D;
          border: 1px solid #f7b3d1;
        }

        .submit-status.loading {
          background: #C7E8FF;
          color: #127BB8;
          border: 1px solid #9dd4f7;
        }

        /* Mobile Optimizations */
        @media (max-width: 480px) {
          .app-container {
            max-width: 100%;
          }

          .header {
            padding: 15px;
          }

          .breadcrumb-container {
            padding: 10px 15px;
          }

          .form-container {
            padding: 20px 15px;
          }

          .step-title {
            font-size: 24px;
          }

          .input-row {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .navigation {
            padding: 15px;
          }

          .pagination {
            flex-direction: column;
            gap: 15px;
          }

          .pagination-btn {
            padding: 10px 16px;
            font-size: 13px;
          }

          /* Mobile Date Picker */
          .date-input-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .date-input-group label {
            font-size: 14px;
          }

          .date-picker-input {
            font-size: 16px !important; /* Prevent zoom on iOS */
            min-width: 100% !important;
          }

          .react-datepicker__day {
            width: 2.2rem !important;
            height: 2.2rem !important;
            line-height: 2.2rem !important;
            font-size: 13px !important;
          }

          .date-picker-calendar {
            font-size: 14px !important;
          }

          .date-picker-popper {
            transform: none !important;
            left: 50% !important;
            margin-left: -150px !important;
          }
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .checkbox-item {
            padding: 20px 16px;
          }
          
          .nav-btn {
            padding: 18px 24px;
          }
          
          .input-group input,
          .input-group textarea,
          .input-group select {
            padding: 18px;
          }
        }
      `}</style>

      <div className="app-container">
        {/* Header with Logo and Progress */}
        <header className="header">
          <div className="logo-container">
            <img src="/logo.png" alt="Company Logo" className="logo" />
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" id="progressFill"></div>
            </div>
            <div className="progress-text">
              <span id="currentStep">1</span> of <span id="totalSteps">6</span>
            </div>
          </div>
        </header>

        {/* Breadcrumb Navigation */}
        <div className="breadcrumb-container">
          <button className="breadcrumb-btn" onClick={handleBackToList}>
            ← Back to Visits
          </button>
        </div>

        {/* Main Form Container */}
        <main className="form-container">
          <form id="visitForm" className="multistep-form">
            
            {/* Step 1: Visit Date */}
            <div className="form-step active" data-step="1">
              <h2 className="step-title">Visit Date</h2>
              <div className="date-input-group"> 
                <div className="date-input-container">
                  <DatePicker
                    id="visitDate"
                    name="visitDate"
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="date-picker-input"
                    placeholderText="Select visit date"
                    showPopperArrow={false}
                    popperClassName="date-picker-popper"
                    calendarClassName="date-picker-calendar"
                    fixedHeight
                    required
                  />
                  <svg className="calendar-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 2: Practice Information */}
            <div className="form-step" data-step="2">
              <h2 className="step-title">Practice Information</h2>
              <div className="input-group">
                <label htmlFor="practiceName">Practice Name:</label>
                <input type="text" id="practiceName" name="practiceName" required />
              </div>
              <div className="input-group">
                <label htmlFor="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="input-group">
                <label htmlFor="address">Address:</label>
                <textarea id="address" name="address" rows="3"></textarea>
              </div>
            </div>

            {/* Step 3: Samples Provided */}
            <div className="form-step" data-step="3">
              <h2 className="step-title">Samples Provided</h2>

              <div className="toggle-container">
                <label className="toggle-label">
                  Did you provide samples?
                  <div className="toggle-switch">
                    <input type="checkbox" id="sampleToggle" />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>

              <div id="samplesList" style={{display: 'none'}}>
                <div className="sample-group">
                  <div className="sample-item" id="alignerfresh-mint-item">
                    <span className="sample-name">AlignerFresh Mint</span>
                    <div className="quantity-controls">
                      <button type="button" className="quantity-btn" id="alignerfresh-mint-minus">−</button>
                      <span className="quantity-display" id="alignerfresh-mint-quantity">0</span>
                      <button type="button" className="quantity-btn" id="alignerfresh-mint-plus">+</button>
                    </div>
                  </div>
                  <div className="sample-item" id="alignerfresh-flavors-item">
                    <span className="sample-name">AlignerFresh Flavors</span>
                    <div className="quantity-controls">
                      <button type="button" className="quantity-btn" id="alignerfresh-flavors-minus">−</button>
                      <span className="quantity-display" id="alignerfresh-flavors-quantity">0</span>
                      <button type="button" className="quantity-btn" id="alignerfresh-flavors-plus">+</button>
                    </div>
                  </div>
                  <div className="sample-item" id="allclean-minerals-item">
                    <span className="sample-name">AllClean Minerals</span>
                    <div className="quantity-controls">
                      <button type="button" className="quantity-btn" id="allclean-minerals-minus">−</button>
                      <span className="quantity-display" id="allclean-minerals-quantity">0</span>
                      <button type="button" className="quantity-btn" id="allclean-minerals-plus">+</button>
                    </div>
                  </div>
                  <div className="sample-item" id="ipr-glide-item">
                    <span className="sample-name">IPR Glide</span>
                    <div className="quantity-controls">
                      <button type="button" className="quantity-btn" id="ipr-glide-minus">−</button>
                      <span className="quantity-display" id="ipr-glide-quantity">0</span>
                      <button type="button" className="quantity-btn" id="ipr-glide-plus">+</button>
                    </div>
                  </div>
                  <div className="sample-item" id="other-item">
                    <span className="sample-name">Other</span>
                    <div className="quantity-controls">
                      <button type="button" className="quantity-btn" id="other-minus">−</button>
                      <span className="quantity-display" id="other-quantity">0</span>
                      <button type="button" className="quantity-btn" id="other-plus">+</button>
                    </div>
                  </div>
                </div>
                <div className="input-group" id="otherSampleGroup" style={{display: 'none'}}>
                  <label htmlFor="otherSample">Specify other sample:</label>
                  <input type="text" id="otherSample" name="otherSample" />
                </div>
              </div>
            </div>

            {/* Step 4: Topics and Notes */}
            <div className="form-step" data-step="4">
              <h2 className="step-title">Topics & Notes</h2>
              <div className="input-group">
                <label htmlFor="topicsDiscussed">Topics discussed and notes:</label>
                <textarea id="topicsDiscussed" name="topicsDiscussed" rows="6" required 
                          placeholder="Enter topics discussed, key points, follow-up actions, etc."></textarea>
              </div>
            </div>

            {/* Step 5: Credit Card Information */}
            <div className="form-step" data-step="5">
              <h2 className="step-title">Credit Card Information</h2>

              <div className="toggle-container">
                <label className="toggle-label">
                  Provide credit card information?
                  <div className="toggle-switch">
                    <input type="checkbox" id="creditCardToggle" />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>

              <div id="creditCardFields" style={{display: 'none'}}>
                <div className="input-group">
                  <label htmlFor="cardName">Cardholder Name:</label>
                  <input type="text" id="cardName" name="cardName" required />
                </div>
                <div className="input-group">
                  <label htmlFor="cardNumber">Card Number:</label>
                  <input type="text" id="cardNumber" name="cardNumber" required maxLength="19"
                         placeholder="1234 5678 9012 3456" />
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="expiryMonth">Month:</label>
                    <select id="expiryMonth" name="expiryMonth" required>
                      <option value="">MM</option>
                      <option value="01">01</option>
                      <option value="02">02</option>
                      <option value="03">03</option>
                      <option value="04">04</option>
                      <option value="05">05</option>
                      <option value="06">06</option>
                      <option value="07">07</option>
                      <option value="08">08</option>
                      <option value="09">09</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="expiryYear">Year:</label>
                    <select id="expiryYear" name="expiryYear" required>
                      <option value="">YYYY</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="cvv">CVV:</label>
                    <input type="text" id="cvv" name="cvv" required maxLength="4" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6: Review and Submit */}
            <div className="form-step" data-step="6">
              <h2 className="step-title">Review & Submit</h2>
              <div className="review-section" id="reviewSection">
                {/* Review content will be populated by JavaScript */}
              </div>
              <div className="submit-status" id="submitStatus"></div>
            </div>

          </form>
        </main>

        {/* Navigation */}
        <nav className="navigation">
          <button type="button" id="prevBtn" className="nav-btn prev-btn" disabled>
            <span className="btn-text">Previous</span>
          </button>
          <button type="button" id="nextBtn" className="nav-btn next-btn">
            <span className="btn-text">Next</span>
          </button>
        </nav>
      </div>
    </>
  );
}
