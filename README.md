# eleventy-plugin-embedded-demos

A plugin for eleventy that allows you to have embedded demos using HTML, CSS and JavaScript, as well as having the code from those demos displayed in the page.

## Install

Available on [npm](https://www.npmjs.com/package/eleventy-plugin-embedded-demos).

`npm install --save-dev eleventy-plugin-embedded-demos`

## Usage

### Loading and configuring

In your Eleventy config file (probably `.eleventy.js`), load the plugin module and use `.addPlugin` to add it to Eleventy. Like this:

```javascript
const demos = require("eleventy-plugin-embedded-demos");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(demos);
};
```

REMEMBER: You’re only allowed one `module.exports` in your configuration file, so make sure you only copy the `require` and the `.addPlugin` lines above!

You can also pass an object to the `.addPlugin` call as the second parameter to configure the plugin. Like this:

```javascript
const demos = require("eleventy-plugin-embedded-demos");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(demos, {
    path: "./src/demos",
    filenames: {
      javascript: "script.js",
    },
  });
};
```

Any options you pass will be used to override the equivalent defaults.

### Demo layout

You'll need a layout for your demo files so that all the various parts of the demo can be included.

The plugin adds 2 shortcodes to enable this:

- `demoCss`: inlines the CSS for that demo into the page
- `demoJS`: inlines the JS for that demo into the page

An example of a minimal Nunjucks layout for demo files would be this:

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    {% demoCss %}
  </head>
  <body>
    <main id="demo-content" title="{{ title }}">
      {{ content | safe }}
    </main>
    {% demoJS %}
  </body>
</html>
```

You'll then need to specify that your demo pages should use this layout, either in your template front-matter or in a directory data file

### Creating a demo

To create a demo, create a folder within your demos folder (default: `./demos`). This can also be nested if you want to group multiple demos.

The only required file for a demo is a page written in any template language supported by Eleventy. The plugin looks for `index.*` by default.

You can optionally have a CSS file (default name `styles.css`) and a JavaScript file (default name `main.js`).

You can overide the CSS and JavaScript file names for a particular demo in your main demo file front-matter, as keys under a `filenames` key. For example:

```
---
title: "Basic clip-path demo"
filenames:
  javascript: "script.js"
---
```

### Embedding demos in pages

You can embed a demo in your page using the `embeddedDemo` shortcode and passing it the path within your demos folder that the plugin should look for the files in.

For example, if we had a demo that lived at `./demos/clip-path/basic`, we'd call the shortcode in Nunjucks like this:

```
{% embeddedDemo "clip-path/basic" %}
```

## Configuration options

Below are all the options that can be passed to the plugin:

<table>
<thead>
<tr>
<th>Option</th>
<th>Type</th>
<th>Default</th>
<th>Description</th> 
</tr>
</thead>
<tr>
<td>

`path`

</td>
<td>string</td>
<td>

`./demos`

</td>
<td>

The path to your demos folder, relative to the root of your Eleventy project.

**Note: This must be inside your Eleventy `input` directory**

</td>
</tr>

<tr>
<td>

`prettier`

</td>
<td>boolean</td>
<td>

`true`

</td>
<td>Whether to format the demo code with Prettier before displaying</td>
</tr>

<tr>
<td>

`parsers`

</td>
<td>object</td>
<td>

```
{
  html: "html",
  css: "css",
  javascript: "babel",
}
```

</td>
<td>An object keyed by file type with parsers that Prettier should use to format your code</td>
</tr>

<tr>
<td>

`filenames`

</td>
<td>object</td>
<td>

```
{
  html: "index.*",
  css: "styles.css",
  javascript: "main.js",
}
```

</td>
<td>

An object keyed by file type with the file name to look for.

**Note: Only the `html` value can be a glob**

</td>
</tr>

<tr>
<td>

`displayNames`

</td>
<td>object</td>
<td>

```
{
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  result: "Result",
}
```

</td>
<td>An object keyed by section with the text to be displayed with the corresponding section in the embedded demo</td>
</tr>

<tr>
<td>

`open`

</td>
<td>object</td>
<td>

```
{
  html: false,
  css: false,
  javascript: false,
  result: true,
}
```

</td>
<td>An object keyed by section with a true or false value for if that section should be open</td>
</tr>

</table>

### Defaults

All of the defaults are exposed on the `defaults` property of the module, so they can be used in your config if necessary.
