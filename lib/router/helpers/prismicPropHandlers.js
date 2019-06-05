const Prismic = require('prismic-javascript')

module.exports = createPropHandlers

/**
 * Returns a prop handler for prismic data props
 * @param  {String} type Prismic custom type ID
 * @return {Object}    An object with handlers for Prismic document data properties
 */
function createPropHandlers (type) {
  return {
    'text': fullTextGetter(),
    'tags': tagsGetter(),
    'type': simplePropGetter(type, 'type'),
    'directors': stringListGetter(type, 'directors'),
    'authors': stringListGetter(type, 'authors'),
    'content': simplePropGetter(type, 'content'),
    'illustrators': stringListGetter(type, 'illustrators'),
    'publicist': simplePropGetter(type, 'publicist'),
    'character': simplePropGetter(type, 'character')
  }
}

/**
 * Returns a function that expects a value to query for
 * @param  {String} type Prismic Custom Type API ID
 * @param  {String} prop Prismic property API ID
 * @return {Function}    A function that takes a value and queries for it
 */
function simplePropGetter (type, prop) {
  return function simplePred (value) {
    return { predicates: [Prismic.Predicates.at(`my.${type}.${prop}`, value)] }
  }
}

/**
 * Creates a function that validates against a value within a string list
 * Example: "John" is found in "John, Mary, Amir" or "John and Mary"
 * @param  {String} type        Prismic Custom Type API ID
 * @param  {String} prop        Prismic property API ID
 * @param  {String} separator   A character that is used to separate items in string list.
 * @return {Function}           A function that takes a value and queries for it within a string list
 */
function stringListGetter (type, prop, separator) {
  return function predAndPostFilter (value) {
    return {
      predicates: [Prismic.Predicates.has(`my.${type}.${prop}`)],
      postFilter: function findInStringList (responses) {
        if (!Array.isArray(responses)) responses = [responses]
        responses = responses.map(function filterResponseResults (response) {
          response.results = response.results.filter(doc => inStringList(separator, value, doc.data[prop]))
          return response
        })
        return responses
      }
    }
  }
}

/**
 * Creates a function that validates based on an array of tags
 * @return {Function}  A function that takes an array of tags and queries for it within
 */
function tagsGetter () {
  return function tagsQuery (tags) {
    tags = typeof tags === 'string' ? [tags] : tags
    return {
      predicates: [Prismic.Predicates.at('document.tags', tags)]
    }
  }
}

/**
 * Creates a function that searches documents in text and select-fields
 * @return {Function}  A function that takes a string and does a full text search within documents
 */
function fullTextGetter () {
  return function fullTextSearch (text = '') {
    return {
      predicates: [Prismic.Predicates.fulltext('document', text)]
    }
  }
}

/**
 * Checks if a value is present within a string list
 * @param  {String} [separator=','] A character that is used to separate items in string list. Defaults to comma (,)
 * @param  {String} val             A value to search for within list
 * @param  {String} str             String to split into items
 * @return {Boolean}                True if val is found within list
 */
function inStringList (separator = ',', val, str) {
  return str.split(separator).map(str => str.trim().toLowerCase()).indexOf(val.toLowerCase()) !== -1
}
