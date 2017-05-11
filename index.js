'use strict';

const css = require('css');
const cheerio = require('cheerio');

/**
 * Given a string of HTML, look for any unused CSS selectors in inline `<style>` tags, and remove them.
 * @param {String} html - Input HTML.
 * @returns {String} Modified HTML.
 */
module.exports = html => {
  // Convert HTML into a queriable DOM
  const $ = cheerio.load(html);

  // For each <style> tag, we're going to scan for unused rules, filter them out, then replace
  // the contents of the <style> tag
  $('style').each((i, elem) => {
    const stylesheet = css.parse(elem.children[0].data).stylesheet;
    const filteredRules = rulesCheck(stylesheet);

    elem.children[0].data = css.stringify({
      type: 'stylesheet',
      stylesheet: {
        rules: filteredRules
      }
    });
  });

  /**
   * Filter the selectors out of a list of rules, then use the return value of the filtering
   * function to determine if the rule should be removed entirely.
   * @param {Object[]} rules - List of rules to parse.
   * @returns {Object[]} Filtered rule list.
   */
  function rulesCheck(list) {
    return list.rules.filter(ruleCheck);
  }

  /**
   * Check the selectors in a rule against the input HTML. If a selector doesn't exist in the HTML,
   * remove it.
   *
   * This function filters the `selectors` property of a rule in-place, and also returns a boolean
   * value indicating if the entire rule should be thrown out. If all selectors in a rule are
   * filtered out, then the function returns `false`. If at least one selector remains after
   * filtering, the function returns `true`.
   *
   * This boolean value is used by an array `filter()` to remove rules that have no matching
   * selectors.
   *
   * @param {Object} rule - Rule to examine the selectors of. Selectors are modified in-place.
   * @returns {Boolean} If value should be kept (`true`) or filtered out (`false`).
   */
  function ruleCheck(rule) {
    // Actual rules will have a `selectors` property, whereas, say, a media query won't
    if (rule.selectors) {
      // Filter selectors by the ones that actually match an element in the HTML
      rule.selectors = rule.selectors.filter(sel => {
        // Filter out pseudo-selectors
        const selector = sel.split(/\s+/).map(s => s.replace(/:.*/, '')).join(' ');

        return $(selector).length > 0;
      });

      // If a rule has no valid selectors, it should be removed from the CSS entirely
      if (rule.selectors.length === 0) {
        return false;
      }
    }

    // Media queries and other directives with nested rules will have a `rules` property
    if (rule.rules) {
      rule.rules = rulesCheck(rule);

      // If all nested rules within a rule are filtered out, remove it
      return rule.rules.length > 0;
    }

    return true;
  }

  return $.html();
};
