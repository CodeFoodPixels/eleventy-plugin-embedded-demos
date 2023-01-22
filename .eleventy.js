const path = require("path");

// Hack: Stop this plugin clobbering any other uses of Prism
// Related bug: https://github.com/PrismJS/prism/issues/3636
const globalPrism = global.Prism;
const Prism = require("prismjs");
global.Prism = globalPrism;
// Endhack

const prettier = require("prettier");
const fs = require("fs");

const defaults = {
  demoPath: path.join(".", "demos"),
};

const parsers = {
  html: "html",
  css: "css",
  javascript: "babel"
};

const displayNames = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript"
};

const filenames = {
  css: "styles.css",
  javascript: "main.js"
}

function stripTrailingSlashes(str) {
  let end = str.length;
  while (str[--end] === "/");
  return str.slice(0, end + 1);
}

function generateCodeBlock(code, language) {
  const formatted = prettier.format(code, {parser: parsers[language]});
  const highlighted = Prism.highlight(
      formatted,
      Prism.languages[language],language
    )
  return `<pre class="language-${language}"><code class="language-${language}">${highlighted}</code></pre>`
}

function generateDetailsBlocks(files) {
  return files.map(({ code, language }) => {
    return `<details class="demo__code">
    <summary class="demo__code-toggle">${displayNames[language]}</summary>
    ${generateCodeBlock(code, language)}
  </details>`
  }).join("");
   
}

function demoFileExists(demoPath) {
  try {
    fs.accessSync(demoPath);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = function demo(
  eleventyConfig,
  { demoPath = defaults.demoPath }
) {
  demoPath = stripTrailingSlashes(demoPath);

  eleventyConfig.addCollection("demos", (collectionApi) =>
    collectionApi.getFilteredByGlob(`${demoPath}/**/index.*`)
  );

  [
    {name: "demoCss", language: "css", tag: "style" },
    {name: "demoJS", language: "javascript", tag: "script"}
  ].forEach(({name, language, tag}) => {
eleventyConfig.addShortcode(name, function() {
    const pagePath = path.dirname(path.resolve(this.page.inputPath));
    const filepath = path.join(pagePath, filenames[language]);
    if (demoFileExists(filepath)){
      try {
        return `<${tag}>${fs.readFileSync(filepath, "utf-8")}</${tag}>`;
      } catch (e) {
        throw new Error(`Problem trying to load demo file "${filepath}": ${e}`)
      }
    }
    return "";
  })
  });
  

  eleventyConfig.addShortcode("demo", function (demoName) {
    const searchPath = stripTrailingSlashes(
      path.join(path.resolve("."), demoPath, demoName)
    );
    const page = this.ctx.collections.demos.find(
      (page) => path.dirname(path.resolve(page.inputPath)) === searchPath
    );

    const files = [];
    files.push({ code: page.templateContent, language: "html"});
    ["css", "javascript"].forEach((language) => {
      const filepath = path.join(searchPath, filenames[language]);
      if (demoFileExists(filepath)){
        try {
          files.push({code: fs.readFileSync(filepath, "utf-8"), language});
        } catch (e) {
          throw new Error(`Problem trying to load demo file "${filepath}": ${e}`)
        }
      }
    })
    

    return `<div class="demo-container">
  ${generateDetailsBlocks(files)}
  <details class="demo__result" open>
    <summary class="demo__result-toggle">Result</summary>
    <iframe src="/demo/${demoName}" title="${page.data.title}" loading="lazy" class="demo-container__iframe"></iframe>
  </details>
</div>`
  });
};
