# style-broom

> Remove unused CSS from <style> tags in HTML

[![Travis](https://img.shields.io/travis/gakimball/style-broom.svg?maxAge=2592000)](https://travis-ci.org/gakimball/style-broom) [![npm](https://img.shields.io/npm/v/style-broom.svg?maxAge=2592000)](https://www.npmjs.com/package/style-broom)

An uncss-like tool for removing unused CSS from HTML, but it only operates on `<style>` tags, and only performs static analysis.

Used by [Scow](https://github.com/gakimball/scow), an email inliner and bundler, to remove unused CSS, saving precious bytes on HTML emails.

## Installation

```bash
npm install style-broom
```

## Usage

```js
const styleBroom = require('style-broom');

const html = `
<html>
  <head>
    <style>
      .unused {
        color: red;
      }

      .used {
        color: blue;
      }
    </style>
  </head>
  <body>
    <p class="used">style-broom</p>
  </body>
</html>
`;

styleBroom(html);
/*
<html>
  <head>
    <style>
      .used {
        color: blue;
      }
    </style>
  </head>
  <body>
    <p class="used">style-broom</p>
  </body>
</html>
*/
```

## API

### styleBroom(html)

Given a string of HTML, look for any unused CSS selectors in inline `<style>` tags, and remove them.

- **html** (String): input HTML.

Returns modified HTML.

## Local Development

```bash
git clone https://github.com/gakimball/style-broom
cd style-broom
npm install
npm test
```

## License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
