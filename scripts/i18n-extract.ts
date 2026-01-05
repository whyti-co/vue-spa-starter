/**
 * i18n Message Extractor
 *
 * 1. Extracts messages from source files using @formatjs/cli
 * 2. Sorts all translation files alphabetically by key
 * 3. Compares en.json with other locale files and reports:
 *    - Missing keys (need translation)
 *    - Obsolete keys (exist in locale but removed from en.json)
 */

import { $ } from 'bun'

const MESSAGES_DIR = 'src/core/i18n/messages'
const SOURCE_LOCALE = 'en'
const TARGET_LOCALES = ['ru']

type TMessages = Record<string, string>

async function extractMessages(): Promise<void> {
	console.log('Extracting messages from source files...')

	await $`formatjs extract 'src/**/*.ts' 'src/**/*.tsx' --ignore 'src/**/*.d.ts' --out-file ${MESSAGES_DIR}/${SOURCE_LOCALE}.json --flatten --format simple`

	console.log(`  ✓ Extracted to ${MESSAGES_DIR}/${SOURCE_LOCALE}.json\n`)
}

async function readJsonFile(path: string): Promise<TMessages | null> {
	const file = Bun.file(path)
	if (!(await file.exists())) {
		return null
	}
	return file.json()
}

function sortKeys(obj: TMessages): TMessages {
	const sorted: TMessages = {}
	for (const key of Object.keys(obj).sort()) {
		sorted[key] = obj[key]
	}
	return sorted
}

async function writeJsonFile(path: string, data: TMessages): Promise<void> {
	await Bun.write(path, `${JSON.stringify(data, null, '\t')}\n`)
}

async function sortAndSaveLocale(locale: string): Promise<TMessages> {
	const path = `${MESSAGES_DIR}/${locale}.json`
	const messages = await readJsonFile(path)

	if (!messages) {
		console.log(`  ⚠ ${locale}.json not found, skipping`)
		return {}
	}

	const sorted = sortKeys(messages)
	await writeJsonFile(path, sorted)
	console.log(`  ✓ Sorted ${locale}.json (${Object.keys(sorted).length} keys)`)

	return sorted
}

function compareLocales(
	source: TMessages,
	target: TMessages,
	targetLocale: string,
): void {
	const sourceKeys = new Set(Object.keys(source))
	const targetKeys = new Set(Object.keys(target))

	const missing: string[] = []
	const obsolete: string[] = []

	for (const key of sourceKeys) {
		if (!targetKeys.has(key)) {
			missing.push(key)
		}
	}

	for (const key of targetKeys) {
		if (!sourceKeys.has(key)) {
			obsolete.push(key)
		}
	}

	if (missing.length === 0 && obsolete.length === 0) {
		console.log(`\n${targetLocale}.json: ✓ All keys in sync`)
		return
	}

	console.log(`\n${targetLocale}.json:`)

	if (missing.length > 0) {
		console.log(`\n  Missing (need translation): ${missing.length}`)
		for (const key of missing.sort()) {
			console.log(`    + "${key}": "${source[key]}"`)
		}
	}

	if (obsolete.length > 0) {
		console.log(`\n  Obsolete (can be removed): ${obsolete.length}`)
		for (const key of obsolete.sort()) {
			console.log(`    - "${key}"`)
		}
	}
}

async function main(): Promise<void> {
	await extractMessages()

	console.log('Sorting translation files...')
	const sourceMessages = await sortAndSaveLocale(SOURCE_LOCALE)

	for (const locale of TARGET_LOCALES) {
		const targetMessages = await sortAndSaveLocale(locale)

		if (Object.keys(targetMessages).length > 0) {
			compareLocales(sourceMessages, targetMessages, locale)
		}
	}

	console.log('\nDone!')
}

main().catch((err) => {
	console.error('Error:', err)
	process.exit(1)
})
