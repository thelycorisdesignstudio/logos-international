import { test, expect } from '@playwright/test';

const baseUrl = process.env.E2E_BASE_URL || 'http://127.0.0.1:5188';
const canonicalOrigin = 'https://logosae.com';
const forbiddenLanguage = /\btrading\b|general\s+trad/i;

test.describe.configure({ mode: 'serial' });

const expectedCanonical = (path) => `${canonicalOrigin}${path === '/' ? '/' : path}`;

const routePathsFromSitemap = async (request) => {
  const response = await request.get(`${baseUrl}/sitemap.xml`);
  expect(response.status()).toBe(200);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
};

const collectRuntimeIssues = (page) => {
  const issues = [];
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) issues.push(`${message.type()}: ${message.text()}`);
  });
  page.on('pageerror', (error) => issues.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(baseUrl) && request.failure()?.errorText !== 'net::ERR_ABORTED') {
      issues.push(`requestfailed: ${request.url()} ${request.failure()?.errorText || ''}`);
    }
  });
  return issues;
};

const openRoute = async (page, path) => {
  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
  expect(response?.status(), path).toBe(200);
  await expect(page.locator('main'), path).toBeVisible();
  await expect(page.locator('h1'), path).toHaveCount(1);
  await expect(page.locator('h1'), path).toBeVisible();
  await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute('href', expectedCanonical(path));
  expect((await page.title()).trim().length, path).toBeGreaterThan(10);
  expect(await page.locator('meta[name="description"]').getAttribute('content'), path).toBeTruthy();
  expect(await page.locator('body').innerText(), path).not.toMatch(forbiddenLanguage);

  const unnamedButtons = await page.locator('button').evaluateAll((buttons) =>
    buttons.filter((button) => !((button.getAttribute('aria-label') || button.textContent || '').trim())).length,
  );
  expect(unnamedButtons, `${path} unnamed buttons`).toBe(0);

  const emptyLinks = await page.locator('a').evaluateAll((links) =>
    links.filter((link) => !(link.getAttribute('href') || '').trim()).length,
  );
  expect(emptyLinks, `${path} empty links`).toBe(0);

  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  }));
  expect(overflow.page, `${path} horizontal overflow`).toBeLessThanOrEqual(overflow.viewport + 1);
};

test('all 43 static routes expose production SEO metadata before JavaScript', async ({ request }) => {
  test.setTimeout(180_000);
  const routes = await routePathsFromSitemap(request);
  expect(routes).toHaveLength(43);
  expect(new Set(routes).size).toBe(43);

  for (const path of routes) {
    const response = await request.get(`${baseUrl}${path}`);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    expect(canonical, path).toBe(expectedCanonical(path));
    expect(html, path).toMatch(/<title>[^<]{10,}<\/title>/i);
    expect(html, path).toMatch(/<meta name="description" content="[^"]{40,}"/i);
    expect(html, path).toMatch(/<script[^>]*type="application\/ld\+json"[^>]*>/i);
    expect(html, path).not.toMatch(/logos-international\.vercel\.app|logos-international\.ae/i);
    expect(html, path).not.toMatch(forbiddenLanguage);
  }
});

test('SEO, GEO, AEO and catalog discovery assets are complete and honest', async ({ request }) => {
  test.setTimeout(180_000);
  const assets = [
    '/robots.txt',
    '/sitemap.xml',
    '/llms.txt',
    '/llms-full.txt',
    '/entity.jsonld',
    '/catalog-data.json',
    '/answer-engine.json',
    '/geo-context.json',
    '/site.webmanifest',
    '/logo-mark.svg',
    '/og-image.svg',
  ];

  for (const asset of assets) {
    const response = await request.get(`${baseUrl}${asset}`);
    expect(response.status(), asset).toBe(200);
    expect((await response.body()).byteLength, asset).toBeGreaterThan(20);
  }

  const entityRaw = await (await request.get(`${baseUrl}/entity.jsonld`)).text();
  const entity = JSON.parse(entityRaw);
  expect(entity['@graph'].length).toBeGreaterThan(4);
  expect(entityRaw).not.toContain('https://schema.org/InStock');
  expect(entityRaw).not.toContain('priceCurrency');
  expect(entityRaw).toContain('Confirmed after inquiry');
  expect(entityRaw).not.toMatch(forbiddenLanguage);

  const catalog = await (await request.get(`${baseUrl}/catalog-data.json`)).json();
  expect(catalog.totalProducts).toBe(79);
  expect(catalog.categories).toHaveLength(18);
  expect(catalog.canonicalUrl).toBe(`${canonicalOrigin}/catalog`);

  const geo = await (await request.get(`${baseUrl}/geo-context.json`)).json();
  expect(geo.canonicalUrl).toBe(canonicalOrigin);
  expect(JSON.stringify(geo)).toContain('Sharjah');
  expect(JSON.stringify(geo)).toContain('GCC');

  const manifest = await (await request.get(`${baseUrl}/catalog-images/manifest.json`)).json();
  expect(manifest.totalProducts).toBe(79);
  expect(manifest.products).toHaveLength(79);
  expect(new Set(manifest.products.map((product) => product.path)).size).toBe(79);
  expect(manifest.products.every((product) => product.sourceUrl && product.license)).toBe(true);

  for (const product of manifest.products) {
    const response = await request.get(`${baseUrl}/${product.path}`);
    expect(response.status(), product.path).toBe(200);
    expect((await response.body()).byteLength, product.path).toBeGreaterThan(5_000);
  }
});

test('every public route renders cleanly at desktop and mobile widths', async ({ page, request }) => {
  test.setTimeout(420_000);
  const routes = await routePathsFromSitemap(request);
  const issues = collectRuntimeIssues(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const path of routes) await openRoute(page, path);
  }

  expect(issues).toEqual([]);
});

test('desktop navigation, footer, home actions, answers and all category cards work', async ({ page }) => {
  test.setTimeout(300_000);
  const issues = collectRuntimeIssues(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const navTargets = [
    ['Home', '/'],
    ['Catalog', '/catalog'],
    ['Services', '/services'],
    ['Coverage', '/coverage'],
    ['Industries', '/industries'],
    ['Contact', '/contact'],
  ];

  for (const [label, path] of navTargets) {
    await page.goto(baseUrl);
    await page.getByRole('banner').getByRole('button', { name: label, exact: true }).click();
    await expect(page).toHaveURL(`${baseUrl}${path}`);
  }

  await page.goto(`${baseUrl}/services`);
  await page.getByRole('banner').getByRole('button', { name: /logos international/i }).click();
  await expect(page).toHaveURL(`${baseUrl}/`);

  await page.goto(baseUrl);
  await page.getByRole('button', { name: /browse catalog/i }).click();
  await expect(page).toHaveURL(`${baseUrl}/catalog`);
  await page.goto(baseUrl);
  await page.getByRole('button', { name: /view supply process/i }).click();
  await expect(page).toHaveURL(`${baseUrl}/services`);
  await page.goto(baseUrl);
  await page.getByRole('button', { name: /send requirement/i }).first().click();
  await expect(page).toHaveURL(`${baseUrl}/contact`);

  await page.goto(baseUrl);
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await expect(page.locator('.skip-link')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  const answerCards = page.locator('article.answer-card');
  expect(await answerCards.count()).toBe(4);
  for (let index = 0; index < (await answerCards.count()); index += 1) {
    const card = answerCards.nth(index);
    await expect(card.locator('h3')).toBeVisible();
    await expect(card.locator('p')).toBeVisible();
    expect((await card.locator('h3').innerText()).trim().length).toBeGreaterThan(8);
    expect((await card.locator('p').innerText()).trim().length).toBeGreaterThan(20);
  }

  const categoryCount = await page.locator('.category-grid .category-card').count();
  expect(categoryCount).toBe(18);
  const categoryNames = await page.locator('.category-grid .category-card h3').allTextContents();
  expect(new Set(categoryNames).size).toBe(18);
  for (let index = 0; index < categoryCount; index += 1) {
    await page.goto(baseUrl);
    await page.locator('.category-grid .category-card').nth(index).click();
    await expect(page).toHaveURL(/\/catalog\/[a-z0-9-]+$/);
    expect(await page.locator('.catalog-controls select').first().inputValue()).not.toBe('');
    await expect(page.locator('.product-card').first()).toBeVisible();
  }

  const footerTargets = [
    ['Catalog', '/catalog'],
    ['Services', '/services'],
    ['Coverage', '/coverage'],
    ['Industries', '/industries'],
    ['Contact', '/contact'],
    ['Privacy', '/privacy'],
    ['Terms', '/terms'],
  ];
  for (const [label, path] of footerTargets) {
    await page.goto(baseUrl);
    await page.locator('.site-footer').getByRole('button', { name: label, exact: true }).click();
    await expect(page).toHaveURL(`${baseUrl}${path}`);
  }

  await page.goto(`${baseUrl}/contact`);
  const emailHref = await page.locator('.site-footer a[href^="mailto:"]').getAttribute('href');
  expect(emailHref).toMatch(/^mailto:info@logos\.ae\?/);
  expect(issues).toEqual([]);
});

test('catalog search, every filter, sorting, all images, modal states and quote selection work', async ({ page }) => {
  test.setTimeout(420_000);
  const issues = collectRuntimeIssues(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${baseUrl}/catalog`);

  const search = page.getByPlaceholder(/search ppe/i);
  await search.fill('n95');
  await expect(page.locator('.result-line')).toContainText('1 result');
  await expect(page).toHaveURL(`${baseUrl}/catalog?search=n95`);
  await expect(page.locator('.product-card h2')).toHaveText('N95 Mask');

  await search.fill('product-that-does-not-exist');
  await expect(page.getByRole('heading', { name: 'No products found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.product-card')).toHaveCount(79);

  const categorySelect = page.locator('.catalog-controls select').first();
  const categoryOptions = await categorySelect.locator('option').evaluateAll((options) =>
    options.map((option) => ({ value: option.value, label: option.textContent || '' })),
  );
  expect(categoryOptions).toHaveLength(19);
  for (const option of categoryOptions.slice(1)) {
    await categorySelect.selectOption(option.value);
    await expect(page).toHaveURL(/\/catalog\/[a-z0-9-]+$/);
    expect(Number((await page.locator('.result-line > span').innerText()).split(' ')[0]), option.label).toBeGreaterThan(0);
  }

  await page.getByRole('button', { name: 'Clear filters' }).click();
  const productNamesAscending = await page.locator('.product-card h2').allTextContents();
  await page.locator('.catalog-controls select').nth(1).selectOption('name-desc');
  const productNamesDescending = await page.locator('.product-card h2').allTextContents();
  expect(productNamesDescending[0]).toBe(productNamesAscending.at(-1));
  expect(productNamesDescending.at(-1)).toBe(productNamesAscending[0]);

  const productImages = page.locator('.product-card img');
  expect(await productImages.count()).toBe(79);
  for (let index = 0; index < (await productImages.count()); index += 1) {
    const image = productImages.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((node) => node.complete && node.naturalWidth > 0)).toBe(true);
    expect(await image.getAttribute('alt')).toMatch(/representative catalog image/i);
  }

  await page.getByRole('button', { name: /view .* details/i }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(page.locator('.modal-shell')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');

  await page.getByRole('button', { name: 'Details', exact: true }).first().click();
  await page.getByRole('button', { name: /close product details/i }).click();
  await expect(page.locator('.modal-shell')).toHaveCount(0);

  await page.getByRole('button', { name: 'Details', exact: true }).first().click();
  await page.getByRole('button', { name: /dismiss product overlay/i }).click({ position: { x: 4, y: 4 } });
  await expect(page.locator('.modal-shell')).toHaveCount(0);

  await page.getByRole('button', { name: 'Add', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Selected', exact: true }).first()).toBeVisible();
  const quoteLink = page.getByRole('link', { name: /send quote request \(1\)/i });
  await expect(quoteLink).toBeVisible();
  expect(await quoteLink.getAttribute('href')).toMatch(/^mailto:info@logos\.ae\?.*Quote%20request/i);
  await page.getByRole('button', { name: 'Selected', exact: true }).first().click();
  await expect(quoteLink).toHaveCount(0);

  await page.getByRole('button', { name: 'Details', exact: true }).first().click();
  await page.getByRole('dialog').getByRole('button', { name: 'Add to quote' }).click();
  await expect(page.getByRole('link', { name: /send quote request \(1\)/i })).toBeVisible();
  await page.getByRole('button', { name: 'Details', exact: true }).first().click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove from quote' }).click();
  await expect(page.getByRole('link', { name: /send quote request/i })).toHaveCount(0);

  expect(issues).toEqual([]);
});

const exerciseEditorialHub = async (page, kind) => {
  const hubPath = kind === 'coverage' ? '/coverage' : '/industries';
  const viewAllName = kind === 'coverage' ? /view all coverage/i : /view all industries/i;
  await page.goto(`${baseUrl}${hubPath}`);
  const tileCount = await page.locator('.editorial-tile > button').count();
  expect(tileCount).toBe(kind === 'coverage' ? 11 : 6);

  for (let tileIndex = 0; tileIndex < tileCount; tileIndex += 1) {
    await page.goto(`${baseUrl}${hubPath}`);
    const tile = page.locator('.editorial-tile > button').nth(tileIndex);
    const title = (await tile.locator('strong').innerText()).trim();
    await tile.click();
    await expect(page).toHaveURL(new RegExp(`${hubPath}/[a-z0-9-]+$`));
    await expect(page.locator('h1')).toHaveText(title);
    const detailUrl = page.url();

    const answerCards = page.locator('article.answer-card');
    await expect(answerCards).toHaveCount(4);
    for (let index = 0; index < (await answerCards.count()); index += 1) {
      await expect(answerCards.nth(index).locator('h3')).toBeVisible();
      await expect(answerCards.nth(index).locator('p')).toBeVisible();
    }

    const linkedCategories = page.locator('.linked-category-grid .category-card');
    const linkedCategoryCount = await linkedCategories.count();
    expect(linkedCategoryCount).toBeGreaterThan(0);
    for (let categoryIndex = 0; categoryIndex < linkedCategoryCount; categoryIndex += 1) {
      await page.goto(detailUrl);
      await page.locator('.linked-category-grid .category-card').nth(categoryIndex).click();
      await expect(page).toHaveURL(/\/catalog\/[a-z0-9-]+$/);
      await expect(page.locator('.product-card').first()).toBeVisible();
    }

    await page.goto(detailUrl);
    await page.locator('.page-hero').getByRole('button', { name: 'Send requirement' }).click();
    await expect(page).toHaveURL(`${baseUrl}/contact`);
    await page.goto(detailUrl);
    await page.getByRole('button', { name: viewAllName }).click();
    await expect(page).toHaveURL(`${baseUrl}${hubPath}`);
    await page.goto(detailUrl);
    await page.locator('.cta-band').getByRole('button', { name: 'Send requirement' }).click();
    await expect(page).toHaveURL(`${baseUrl}/contact`);
  }

  await page.goto(`${baseUrl}${hubPath}`);
  await page.getByRole('button', { name: /view matching products/i }).click();
  await expect(page).toHaveURL(/\/catalog\/[a-z0-9-]+$/);
};

test('all coverage pages, category links, answers and calls to action work', async ({ page }) => {
  test.setTimeout(600_000);
  const issues = collectRuntimeIssues(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await exerciseEditorialHub(page, 'coverage');
  expect(issues).toEqual([]);
});

test('all industry pages, category links, answers and calls to action work', async ({ page }) => {
  test.setTimeout(420_000);
  const issues = collectRuntimeIssues(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await exerciseEditorialHub(page, 'industries');
  expect(issues).toEqual([]);
});

test('mobile navigation, services, contact validation and legal pages work', async ({ page }) => {
  test.setTimeout(240_000);
  const issues = collectRuntimeIssues(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const mobileTargets = [
    ['Home', '/'],
    ['Catalog', '/catalog'],
    ['Services', '/services'],
    ['Coverage', '/coverage'],
    ['Industries', '/industries'],
    ['Contact', '/contact'],
  ];
  for (const [label, path] of mobileTargets) {
    await page.goto(baseUrl);
    const toggle = page.getByRole('button', { name: /toggle navigation/i });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.locator('.mobile-nav').getByRole('button', { name: label, exact: true }).click();
    await expect(page).toHaveURL(`${baseUrl}${path}`);
  }

  await page.goto(baseUrl);
  const mobileCategoryCards = page.locator('.category-grid .category-card');
  await expect(mobileCategoryCards).toHaveCount(18);
  await mobileCategoryCards.last().scrollIntoViewIfNeeded();
  await expect(mobileCategoryCards.last()).toBeVisible();

  await page.goto(`${baseUrl}/services`);
  await page.locator('.cta-band').getByRole('button', { name: /send requirement/i }).click();
  await expect(page).toHaveURL(`${baseUrl}/contact`);

  await page.goto(`${baseUrl}/contact`);
  const form = page.locator('.contact-form');
  await form.getByRole('button', { name: /open email draft/i }).click();
  expect(await form.locator(':invalid').count()).toBeGreaterThanOrEqual(3);
  await expect(form.locator('.form-status')).toHaveCount(0);

  await page.getByLabel('Name').fill('QA Buyer');
  await page.getByLabel('Company').fill('QA Company');
  await page.getByLabel('Email').fill('not-an-email');
  await page.getByLabel('Requirement').fill('Safety shoes, 25 pairs, Sharjah, next week.');
  await form.getByRole('button', { name: /open email draft/i }).click();
  await expect(page.getByLabel('Email')).toHaveAttribute('type', 'email');
  expect(await page.getByLabel('Email').evaluate((input) => input.validity.valid)).toBe(false);

  await page.getByLabel('Email').fill('buyer@example.com');
  const productOptions = await page.getByLabel('Product area').locator('option').count();
  expect(productOptions).toBe(20);
  await page.getByLabel('Product area').selectOption('Safety Footwear');
  await form.getByRole('button', { name: /open email draft/i }).click({ noWaitAfter: true });
  await expect(form.locator('.form-status')).toContainText('Your email app is opening with the request details');
  await expect(page.getByLabel('Name')).toHaveValue('');
  await expect(page.getByLabel('Email')).toHaveValue('');

  const directEmailHref = await page.locator('.contact-panel a[href^="mailto:"]').getAttribute('href');
  expect(directEmailHref).toMatch(/^mailto:info@logos\.ae\?/);

  await page.locator('.site-footer').getByRole('button', { name: 'Privacy', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  await expect(page.locator('.legal-page')).toContainText('July 31, 2026');
  await page.locator('.site-footer').getByRole('button', { name: 'Terms', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();
  await expect(page.locator('.legal-page')).toContainText('July 31, 2026');

  expect(issues.filter((issue) => !issue.toLowerCase().includes('mailto'))).toEqual([]);
});
