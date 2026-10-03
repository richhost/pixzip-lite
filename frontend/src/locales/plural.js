import { locales } from './data.js'

/** @type {Intl.LDMLPluralRule[]} */
const ALL_C = ['zero', 'one', 'two', 'few', 'many', 'other']

export const indices = /** @type {Map<import('./data.js').Locale, (n: number) => number>} */ (
    new Map(
        locales.map(locale => {
            const rule = new Intl.PluralRules(locale)
            const categories = rule.resolvedOptions().pluralCategories
            categories.sort((c1, c2) => ALL_C.indexOf(c1) - ALL_C.indexOf(c2))
            const idxes = new Map(categories.map((c, i) => [c, i]))
            return [locale, n => idxes.get(rule.select(n))]
        }),
    )
)

/**
 * @param {number} n
 * @param {string[]} candidates
 * @param {import('./data.js').Locale} locale
 */
export default function plural(n, candidates, locale = 'zh') {
    const rule = /** @type {(n: number) => number} */ (indices.get(locale))
    return candidates[rule(n)]?.replace('#', n.toString())
}
