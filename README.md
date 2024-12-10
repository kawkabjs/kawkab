# Kawkab Framework

A powerful Node.js/TypeScript framework for building scalable backend applications and APIs.

## Features

- Built with TypeScript for type safety and better developer experience
- Modular architecture for scalable applications
- Environment-based configuration
- CLI tool for project management
- Production-ready setup

## Installation

```bash
npx create-kawkab-app@latest init my-kawkab-app
```

## Quick Start

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Copy the environment file:
```bash
cp .env.example .env.development
```
4. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the project for production
- `npm start` - Run the production server
- `npm run remove` - Remove build directory
- `npm run kawkab` - Run CLI commands

## Environment Variables

The project uses different environment files for different stages:
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.example` - Example environment template

## Project Structure

```
kawkab/
├── app/              # Application source code
├── storage/          # Storage directory
├── .dist/            # Compiled files
├── cli.ts            # CLI implementation
├── index.ts          # Application entry point
└── tsconfig.json     # TypeScript configuration
```

## Technologies

- Node.js
- Bun.js
- TypeScript

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Hassan Kerdash

## Keywords

kawkab, framework, nodejs, bunjs, javascript, js, typescript, ts, backend, api
