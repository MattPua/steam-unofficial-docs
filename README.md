# Steam Unofficial Docs

Unofficial documentation for the Steamworks Web API, built with [Fumadocs](https://fumadocs.dev).

This project uses [bun](https://bun.sh) as the package manager and runtime.

## Getting Started

### Development

Run the development server:

```bash
bun run dev
```

Open http://localhost:3001 with your browser to see the result.

### Generating Documentation

Generate documentation pages from the OpenAPI specification:

```bash
bun run generate
```

This will read `openapi.json` and generate MDX files in `content/docs/`.

## Project Structure

Built with [Fumadocs](https://fumadocs.dev), a documentation framework for Next.js:

- `lib/source.ts`: Content source adapter using [`loader()`](https://fumadocs.dev/docs/headless/source-api)
- `lib/layout.shared.tsx`: Shared layout options
- `source.config.ts`: Fumadocs MDX configuration for customizing frontmatter schema and other options
- `openapi.json`: OpenAPI 3.0 specification for the Steamworks Web API
- `content/docs/`: Generated documentation pages

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

## Learn More

- [Fumadocs Documentation](https://fumadocs.dev) - learn about Fumadocs
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Steam Web API Wiki](https://developer.valvesoftware.com/wiki/Steam_Web_API) - official Steam Web API documentation

## Original References
- [Check out XPaw's original unofficial documentation](https://steamapi.xpaw.me/#)