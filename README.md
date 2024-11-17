# AetherQuill

AetherQuill is an AI-powered blog writing platform that helps users create compelling content quickly and easily. By leveraging advanced artificial intelligence, AetherQuill streamlines the blog writing process from ideation to publication.

## Features

- **AI-Generated Blog Titles**: Input your topic, and AetherQuill suggests multiple engaging titles.
- **Content Generation**: Select a title, and watch as AI crafts a well-structured blog post.
- **Header Image Creation**: Automatically generate relevant header images for your blog posts.
- **User-Friendly Interface**: Intuitive, step-by-step process for creating blog content.
- **Responsive Design**: Fully responsive web application, works on desktop and mobile devices.

## Technologies Used

- React
- Next.js
- Tailwind CSS
- shadcn/ui components
- OpenAI GPT-4 (for text generation)
- Replicate.com (for image generation)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/nalandatechnology/aetherquill.git
   ```

2. Navigate to the project directory:
   ```
   cd aetherquill
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or if you're using yarn:
   ```
   yarn install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   REPLICATE_API_KEY=your_replicate_api_key
   ```

### Running the Development Server

1. Start the development server:
   ```
   npm run dev
   ```
   or with yarn:
   ```
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter your desired blog topic in the input field on the home page.
2. Select one of the AI-generated blog titles.
3. Review and edit the generated blog content as needed.
4. Generate a header image for your blog post.
5. Publish or export your completed blog post.

## Contributing

We welcome contributions to AetherQuill! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

Please make sure to update tests as appropriate and adhere to the existing coding style.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- Replicate.com for image generation capabilities
- The React and Next.js communities for their excellent documentation and support

## Contact

If you have any questions, feel free to reach out to us at support@aetherquill.com or open an issue in this repository.

Happy writing with AetherQuill!