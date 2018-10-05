# Astrid Lindgren Company

Website for Astrid Lindgren Company that promotes and protects the Astrid Lindgren trademark all over the world.

## Setup

Requirements:

- Git
- NodeJS 10+
- Nodemon
- Check .editorconfig works with your editor

### Environment variables

TBD - under development

## Technologies

This no fuzz stack is just a Node server using [Koa](http://koajs.com/) to deliver content from the headless CMS [Prismic.io](https://prismic.io/) through simple [nanohtml](https://github.com/choojs/nanohtml) views.

### Koa

TBD - under development

### Nanohtml

TBD - under development

### SUIT CSS

TBD - under development

### Prismic

TBD - under development

### Manifest(ish)

A few words from the coders of this website:

- *As vanilla as possible* - we think coding for the web should be fun and hands on, embracing modern web standards helps you avoid overhead and hiding complexity under layers of frameworks.
- *Minimalism is simplicity* - minimalism is the art of identifying and using only what you need. It may not always be easy. But we think this keeps things simple.
- *Patterns over frameworks* - a great framework is a great framework. React is one of those. But we are curious about the innovation that happens outside the norm. We like to support the initiatives that distills the greatness of the framework giants into something that is more hands on.

### Coding Style

- Unix style EOL (only a LF character).

#### JS

- Put 'use strict' on line 1.
- Use 'var', 'let' and 'const' where fit.
- We follow [StandardJS](https://standardjs.com/). Set up your IDE, ESLint accordingly.
  Format on check-in. Some of the rules are:
  - No semi.
  - 2 space indent.
  - Single quotes for strings.
  - Space between 'function name' and '(...)'
  - Space after keywords.
  - Space after comma, colon.
  - Space or NL for blocks { ... }
  - No space for (...) and [...].

#### css

- suitcss flavour bem
- enable chrome://flags "experimental Web Platform features" [css-matches-pseudo](https://caniuse.com/#feat=css-matches-pseudo).

## Build and deploy

- It's important to start the app with 'npm start ...' in order to set the 'process.env' variables correctly. Eg. the important process.env.npm_package_version will be undefined.
- Target production environment is the Jelastic PAAS hosted by Elastx. Normally production get's updated within minutes whenever the git master branch is updated. Build and deploy is part of a Jelastic command pipe wich essentially runs:
  1. Stop node
  2. Pull from git
  3. yarn
  4. yarn start

## Semantic Versioning

See https://docs.npmjs.com/getting-started/semantic-versioning

## Special thanks

Special thanks to codeandconspire who built the open sourced globalgoals.org website for inspiration.

## License

TBD - under development
