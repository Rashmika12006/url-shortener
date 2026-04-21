# LinkSnap - Premium URL Shortener

LinkSnap is a production-ready, full-stack URL shortener built with React, Express, and Firebase.

## Features
- 🚀 Fast URL shortening
- 📊 Real-time click tracking
- 📱 Responsive, SaaS-style UI
- 🎨 Modern dark theme with Glassmorphism
- 🔗 QR Code generation
- 🛡️ Secure backend with Firebase Admin

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion, Lucide Icons, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: Local JSON Storage (db.json)
- **DevOps**: Docker, GitHub Actions, AWS EC2

## Local Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
   - The app will automatically create a `db.json` file for storage.

## Docker Setup
```bash
docker-compose up --build
```

## CI/CD Pipeline
The project uses GitHub Actions to automatically:
1. Build the Docker image
2. Push to Docker Hub
3. (Optional) Trigger deployment to AWS

## AWS Deployment
1. Launch an EC2 instance (Ubuntu recommended)
2. Install Docker and Docker Compose
3. Pull the image: `docker pull your-username/linksnap:latest`
4. Run with Docker Compose or directly:
   ```bash
   docker run -p 80:3000 your-username/linksnap:latest
   ```
5. Configure Application Load Balancer (ALB) to point to the EC2 instance.
