import map from 'lodash/map';
import values from 'lodash/values';

function categorySelector(categories, emojisByCategory, modifier, search, term) {
  const findEmojiVariant = emojis => modifier && emojis[modifier] ? emojis[modifier] : emojis[0];
  const searchTermRegExp = new RegExp(`^${term}`);
  const keywordMatchesSearchTerm = keyword => searchTermRegExp.test(keyword);
  const emojiMatchesSearchTerm = emoji => !search || !term || emoji.keywords.some(keywordMatchesSearchTerm);

  return map(categories, (category, id) => {
    const list = emojisByCategory[id] || {};
    const emojis = values(list)
      .map(findEmojiVariant)
      .filter(emojiMatchesSearchTerm);

    return {
      category,
      emojis,
      id,
    };
  }).filter(({emojis}) => emojis.length > 0);
}

function createCategorySelector() {
  let lastCategories;
  let lastEmojisByCategory;
  let lastModifier;
  let lastSearch;
  let lastTerm;
  let lastResult;

  return function memoizedCategorySelector(
    categories,
    emojisByCategory,
    modifier,
    search,
    term,
  ) {
    if (
      categories !== lastCategories ||
      emojisByCategory !== lastEmojisByCategory ||
      modifier !== lastModifier ||
      search !== lastSearch ||
      term !== lastTerm
    ) {
      lastResult = categorySelector(categories, emojisByCategory, modifier, search, term);
      lastCategories = categories;
      lastEmojisByCategory = emojisByCategory;
      lastModifier = modifier;
      lastSearch = search;
      lastTerm = term;
    }

    return lastResult;
  }
}


export default createCategorySelector;
