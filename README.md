# Unterhalt Calculator

A simple JavaScript Single Page Application (SPA) for calculating child support information. This application allows users to input income details for parents and add multiple children with their respective information.

## Features

- Simple, lightweight JavaScript implementation without any large frameworks
- Built with Tailwind CSS for modern styling
- Parent income tracking with income group calculation
- Add/remove multiple children
- Shareable URL functionality with compact parameter encoding
- Integrated test suite for functionality verification
- Responsive design that works well on all screen sizes

## Project Structure

```
unterhalt6/
├── index.html      # Main HTML file with UI structure
├── js/
│   ├── app.js      # Core application logic and state management
│   └── tests.js    # Test suite for verification
└── README.md       # Project documentation
```

## Technical Details

### Version System

The application stores default values in versioned objects, making it easy to update values in future versions while maintaining backward compatibility.

### Data Storage

All form data is maintained in an application state object and reflected in the UI. Changes to inputs automatically update the shareable URL.

### Shareable URLs

The app creates efficient shareable URLs by:
- Only including values that differ from defaults
- Using short parameter names to minimize URL length
- Automatically updating the URL as values change

### Testing

The application includes a built-in test framework that verifies:
- Income group calculations
- URL parameter generation and parsing
- Child addition and removal functionality

Tests run automatically when the page loads and display results in the bottom-right corner.

## Usage

1. Open `index.html` in any modern browser
2. Enter parent income information
3. Add or remove children as needed
4. Use the shareable URL to save or share the current configuration

## Browser Compatibility

The application is designed for modern "evergreen" browsers and uses standard JavaScript features. It does not require any additional build steps or transpilation.
