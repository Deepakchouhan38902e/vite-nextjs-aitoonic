import { Handler } from '@netlify/functions';
import { render } from '../../src/entry-server';

export const handler: Handler = async (event, context) => {
  const url = event.path;
  
  try {
    const { html, helmetContext } = render(url);
    
    const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/sparkles.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${helmetContext.helmet ? [
      helmetContext.helmet.title.toString(),
      helmetContext.helmet.meta.toString(),
      helmetContext.helmet.link.toString()
    ].join('\n') : ''}
  </head>
  <body>
    <div id="root">${html}</div>
    <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300'
      },
      body: template
    };
  } catch (error) {
    console.error('SSR Error:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error'
    };
  }
};