class MultiStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.formData = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.populateYearOptions();
        this.updateProgress();
        this.setupSwipeGestures();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());

        // Other checkbox toggle
        document.getElementById('otherCheckbox').addEventListener('change', (e) => {
            const otherGroup = document.getElementById('otherSampleGroup');
            otherGroup.style.display = e.target.checked ? 'block' : 'none';
            if (!e.target.checked) {
                document.getElementById('otherSample').value = '';
            }
        });

        // Credit card number formatting
        document.getElementById('cardNumber').addEventListener('input', this.formatCardNumber);

        // CVV validation
        document.getElementById('cvv').addEventListener('input', this.formatCVV);

        // Form validation on input
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => this.validateCurrentStep());
        });

        // Checkbox validation
        document.querySelectorAll('input[name="samplesProvided"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validateCurrentStep());
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('visitDate').value = today;
    }

    populateYearOptions() {
        const yearSelect = document.getElementById('expiryYear');
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
        const requiredInputs = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        // Special validation for step 3 (samples)
        if (this.currentStep === 3) {
            const checkboxes = currentStepElement.querySelectorAll('input[name="samplesProvided"]:checked');
            isValid = checkboxes.length > 0;
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
        nextBtn.disabled = !isValid;
        
        return isValid;
    }

    collectFormData() {
        const formData = new FormData(document.getElementById('visitForm'));
        const data = {};

        // Regular form fields
        for (let [key, value] of formData.entries()) {
            if (key === 'samplesProvided') {
                if (!data.samplesProvided) data.samplesProvided = [];
                data.samplesProvided.push(value);
            } else {
                data[key] = value;
            }
        }

        // Credit card data
        data.creditCard = {
            number: data.cardNumber,
            expiryMonth: data.expiryMonth,
            expiryYear: data.expiryYear,
            cvv: data.cvv,
            name: data.cardName
        };

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
                <div class="review-value">${data.samplesProvided ? data.samplesProvided.join(', ') : 'None'}</div>
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
            <div class="review-item">
                <div class="review-label">Credit Card:</div>
                <div class="review-value">**** **** **** ${data.creditCard.number.slice(-4)}</div>
            </div>
        `;
        
        reviewSection.innerHTML = reviewHTML;
    }

    async submitForm() {
        const submitStatus = document.getElementById('submitStatus');
        const nextBtn = document.getElementById('nextBtn');
        
        try {
            submitStatus.innerHTML = '<div class="loading">Submitting visit data...</div>';
            submitStatus.className = 'submit-status loading';
            nextBtn.disabled = true;

            const data = this.collectFormData();
            
            const response = await fetch('/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                submitStatus.innerHTML = '<div class="success">✅ Visit data saved successfully!</div>';
                submitStatus.className = 'submit-status success';
                nextBtn.style.display = 'none';
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    this.resetForm();
                }, 3000);
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
        document.getElementById('visitForm').reset();
        this.setDefaultDate();
        this.showStep(1);
        this.updateProgress();
        this.updateNavigation();
        document.getElementById('submitStatus').innerHTML = '';
        document.getElementById('nextBtn').style.display = 'block';
    }

    nextStep() {
        if (!this.validateCurrentStep()) return;

        if (this.currentStep === this.totalSteps) {
            this.submitForm();
            return;
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
        
        document.querySelector(`[data-step="${step}"]`).classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const currentStepSpan = document.getElementById('currentStep');
        
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        currentStepSpan.textContent = this.currentStep;
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentStep === 1;
        
        if (this.currentStep === this.totalSteps) {
            nextBtn.querySelector('.btn-text').textContent = 'Submit';
        } else {
            nextBtn.querySelector('.btn-text').textContent = 'Next';
        }
        
        this.validateCurrentStep();
    }
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MultiStepForm();
});
