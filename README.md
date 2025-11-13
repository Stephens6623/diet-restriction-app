# Diet Restriction App 🍎

A React and Express.js application that helps individuals with dietary restrictions scan barcodes or ingredient labels to determine if food products are safe for them to consume. The app uses AI (OpenAI's GPT-4 Vision) to analyze product information and provide personalized safety recommendations.

## Features

- 📸 **Barcode Scanning**: Scan product barcodes using your device camera or enter manually
- 🏷️ **Label Analysis**: Upload photos of ingredient labels for AI-powered analysis
- 🔍 **AI-Powered Detection**: Uses OpenAI GPT-4 Vision to identify problematic ingredients
- ⚠️ **Real-time Warnings**: Get immediate alerts about ingredients that conflict with your restrictions
- 🎯 **Customizable Restrictions**: Select from common allergens or add custom dietary restrictions
- 💡 **Recommendations**: Receive helpful suggestions for verifying product safety

### Common Restrictions Supported

- Peanuts
- Tree Nuts
- Dairy
- Eggs
- Soy
- Wheat/Gluten
- Fish
- Shellfish
- Red Dye 40
- Yellow Dye 5
- Artificial Colors
- MSG
- Custom restrictions

## Tech Stack

### Frontend
- **React** - UI framework
- **HTML5 QR Code** - Barcode/QR code scanning
- **Axios** - HTTP client

### Backend
- **Express.js** - Web server framework
- **OpenAI API** - AI-powered ingredient analysis
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Stephens6623/diet-restriction-app.git
   cd diet-restriction-app
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   PORT=5000
   OPENAI_API_KEY=your-openai-api-key-here
   ```
   
   Get your API key from [OpenAI's platform](https://platform.openai.com/api-keys)

## Running the Application

### Development Mode

Run both the server and client simultaneously:
```bash
npm run dev
```

Or run them separately:

**Server only:**
```bash
npm run server
```

**Client only:**
```bash
npm run client
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### Production Build

1. **Build the client**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

The production build will be served at `http://localhost:5000`

## Usage

1. **Select Your Restrictions**
   - Click on common restrictions or add custom ones
   - Multiple restrictions can be selected

2. **Choose Analysis Method**
   - **Upload Label**: Take a photo or upload an image of the ingredient label
   - **Scan Barcode**: Use your device camera to scan a barcode or enter it manually

3. **Review Results**
   - View safety status (Safe/Unsafe)
   - Check detected ingredients
   - Read warnings about problematic ingredients
   - Follow recommendations for verification

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status

### Analyze Product
```
POST /api/analyze/product
```
**Body (multipart/form-data):**
- `restrictions`: JSON array of dietary restrictions
- `barcode`: Product barcode (optional)
- `image`: Image file of ingredient label (optional)

**Response:**
```json
{
  "safe": boolean,
  "method": "barcode" | "image",
  "ingredients": string[],
  "conflicts": string[],
  "warnings": string[],
  "recommendations": string[]
}
```

## Important Notes

⚠️ **Disclaimer**: This application is for informational purposes only. Always verify product information before consuming. The AI analysis may not catch all potential allergens or restrictions.

### Limitations

- **Barcode Analysis**: Limited without real-time barcode database integration. Consider integrating with APIs like [Open Food Facts](https://world.openfoodfacts.org/)
- **AI Accuracy**: The AI may not always be 100% accurate. Always double-check with the actual product label
- **Image Quality**: Clear, well-lit photos of ingredient labels produce better results
- **API Costs**: OpenAI API calls incur costs. Monitor your usage on the OpenAI platform

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Future Enhancements

- [ ] Integration with barcode databases (Open Food Facts, UPC Database)
- [ ] Offline mode with cached product data
- [ ] User accounts to save restriction profiles
- [ ] Product history and favorites
- [ ] Multiple language support
- [ ] Nutrition information display
- [ ] Alternative product suggestions
- [ ] Community reviews and ratings

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ to help people with dietary restrictions eat safely
