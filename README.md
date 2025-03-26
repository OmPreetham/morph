# MORPH - The Wrap Station

![MORPH Logo](/public/logo.jpg)

MORPH is a powerful, browser-based data conversion tool designed for developers, data analysts, and IT professionals. It enables quick and efficient transformation between various data formats without requiring any server-side processing—all conversions happen directly in your browser.

## 🚀 Features

- **Multi-format Conversion**: Convert between JSON, XML, YAML, CSV, TSV, and many other formats
- **Batch Processing**: Convert to multiple formats simultaneously
- **Syntax Highlighting**: Beautiful code highlighting for better readability
- **Customizable**: Adjust indentation, font size, and text wrapping
- **Dark & Light Themes**: Automatic theme detection with manual override
- **Conversion History**: Save and reload previous conversions
- **Offline Support**: Works entirely in-browser, even offline
- **Responsive Design**: Fully functional on desktop and mobile devices
- **PWA Support**: Install as a native-like app on any device
- **Data Privacy**: Your data never leaves your device

## 📦 Supported Formats

| Input Formats | Output Formats |
|--------------|----------------|
| JSON         | XML, YAML, CSV, TSV, SQL, PROTOBUF, AVRO, EXCEL, PLAINTEXT, HTML, MARKDOWN |
| XML          | JSON |
| YAML         | JSON |
| CSV          | JSON, XML, YAML, SQL, PROTOBUF, AVRO, EXCEL, PARQUET, MARKDOWN |
| TSV          | JSON |
| PLAINTEXT    | MORSE |

## 🌐 Live Demo

Visit [https://morph.ompreetham.com](https://morph.ompreetham.com) to use MORPH online.

## 💻 Installation

### Option 1: Use as a Progressive Web App (PWA)

1. Visit [https://morph.ompreetham.com](https://morph.ompreetham.com) in your browser
2. For desktop (Chrome/Edge): Click the install icon in the address bar
3. For mobile:
   - iOS: Tap Share > Add to Home Screen
   - Android: Tap the menu button > Install App

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/OmPreetham/morph.git

# Navigate to the project directory
cd morph

# Install dependencies
npm install

# Start the development server
npm run dev
```
