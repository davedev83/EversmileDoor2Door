# Door2Door Marketing Web App

A mobile-first Next.js web application for door-to-door marketers to quickly input visit data to dental practices. Features a multistep form with swipe navigation, progress tracking, and automatic data saving to MongoDB with email notifications. Optimized for Vercel deployment.

## Features

- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interface
- **Multistep Form**: 6-step process for efficient data entry
- **Swipe Navigation**: Swipe between steps on mobile (arrow keys on desktop)
- **Progress Indicator**: Visual progress bar showing completion status
- **Data Collection**: Comprehensive visit information including:
  - Visit date
  - Practice information (name, phone, email, address)
  - Samples provided (multiselect with custom options)
  - Topics discussed and notes
  - Credit card information
- **Auto-Save**: Automatic saving to MongoDB database
- **Email Notifications**: Automatic email alerts via SendGrid
- **Responsive Design**: Works on both mobile and desktop

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database (cloud recommended)
- SendGrid account for email notifications
- Vercel account for deployment (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Door2DoorMarketing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
     ```
     MONGODB_URI=your_mongodb_connection_string
     SENDGRID_API_KEY=your_sendgrid_api_key
     NOTIFICATION_EMAIL=admin@yourcompany.com
     FROM_EMAIL=noreply@yourcompany.com
     ```

4. **Start local development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - The app is optimized for mobile, so test on a mobile device or use browser dev tools

### Vercel Deployment

1. **Connect your GitHub repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

2. **Configure environment variables in Vercel**
   - In your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     SENDGRID_API_KEY=your_sendgrid_api_key
     NOTIFICATION_EMAIL=admin@yourcompany.com
     FROM_EMAIL=noreply@yourcompany.com
     ```

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - Or manually trigger deployment from the dashboard

## Usage

### For Marketers

1. **Visit Date**: Select the date of the visit (defaults to today)
2. **Practice Info**: Enter practice name, phone, email, and address
3. **Samples**: Select which samples were provided (multiselect)
4. **Topics**: Enter discussion topics and notes
5. **Credit Card**: Enter payment information
6. **Review & Submit**: Review all information and submit

### Navigation

- **Mobile**: Swipe left/right to navigate between steps
- **Desktop**: Use Previous/Next buttons or arrow keys
- **Progress**: Visual indicator shows current step and overall progress

### Data Storage

- All visit data is automatically saved to MongoDB
- Email notifications are sent to the configured admin email
- Credit card information is stored securely (consider encryption for production)

## API Endpoints

- `GET /` - Main application interface (served from index.html)
- `POST /api/visits` - Save new visit data (serverless function)
- `GET /api/visits` - Retrieve all visits (admin) (serverless function)

## File Structure

```
Door2DoorMarketing/
├── pages/
│   ├── api/
│   │   └── visits.js   # Next.js API route for visit data
│   └── index.js        # Main application page (React component)
├── lib/
│   └── mongodb.js      # Database connection and models
├── public/
│   └── logo.png        # Company logo
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies and scripts
├── .env                # Environment variables (local only)
├── .env.example        # Environment template
└── README.md          # This file
```

## Customization

### Styling
- Background color: `#C7E8FF` (defined in CSS)
- Logo: Replace `public/logo.png` with your company logo
- Colors and fonts can be customized in `public/styles.css`

### Sample Options
- Modify the samples list in `public/index.html` (Step 3)
- Update the enum values in `server.js` visitSchema

### Email Templates
- Customize email content in the `/api/visits` endpoint in `server.js`

## Security Considerations

⚠️ **Important for Production:**

1. **Credit Card Data**: Implement proper encryption for credit card storage
2. **HTTPS**: Use SSL/TLS certificates for secure data transmission
3. **Input Validation**: Add server-side validation for all inputs
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Authentication**: Add user authentication if needed
6. **Environment Variables**: Never commit `.env` file to version control

## Browser Support

- Chrome (recommended for mobile)
- Safari (iOS)
- Firefox
- Edge

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your `MONGODB_URI` in `.env`
   - Ensure MongoDB is running (if using local instance)

2. **Email Not Sending**
   - Verify `SENDGRID_API_KEY` is correct
   - Check SendGrid account status and quotas

3. **Mobile Navigation Issues**
   - Ensure touch events are enabled
   - Test on actual mobile device vs. browser emulation

## Support

For technical support or feature requests, please contact the development team.
