const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/admin");
  
  eleventyConfig.addFilter("postDate", (dateObj, locale= 'pt-BR') => {
    return DateTime.fromJSDate(dateObj).setLocale(locale).toFormat('MMMM yyyy');
  });
   const md = new markdownIt({
      html: true,
    });

    // Registra o filtro 'markdown'
    eleventyConfig.addFilter("markdown", (content) => {
      return md.render(content || "");
    });

  eleventyConfig.addNunjucksFilter("excludeFromCollection", function (collection=[], pageUrl=this.ctx.page.url) {
    return collection.filter(post => post.url !== pageUrl);
  });

  eleventyConfig.addNunjucksFilter("limit", (arr, limit) => {
    return arr?.slice(0, limit);
  });

  eleventyConfig.addNunjucksFilter(
    "getRandom",
    (items, currentPage, quantity) => {
      if (!items?.length || items?.length < 2) return;

      let myItems = items?.filter(i => {
        return i.url !== currentPage.url;
      });

      const shuffledPosts = shuffleArray(myItems);

      if (myItems.length === 0) return;
      return shuffledPosts.slice(0, quantity);
    }
  );

  eleventyConfig.addFilter(
    "filterByTags",
    function (collection = [], requiredTags) {
      const filterTags = requiredTags.filter((tag) => tag !== "Geral");
      return collection.filter((post) => {
        return filterTags.some((tag) => post.data.tags?.includes(tag));
      });
    },
  );

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};

