import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteUrl = 'https://logosae.com';
const contactEmail = 'info@logos.ae';
const brandImage = `${siteUrl}/logo-official.png`;
const brandLogo = `${siteUrl}/logo-official.png`;
const distDir = path.resolve('dist');

const serviceAreas = [
  'Sharjah',
  'Dubai',
  'Abu Dhabi',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Oman',
  'Bahrain',
  'Kuwait',
  'GCC countries',
];

const productFocus = [
  'Personal Protective Equipment',
  'PPE',
  'Health and safety requisites',
  'Medical consumables',
  'Hardware',
  'Uniforms',
  'Printing services',
  'Marine paints',
  'Kiswire steel wire ropes',
  'Stationeries',
  'Miscellaneous products',
];

const categoryCopy = {
  Clothing:
    'T-shirts, cargo pants, cotton coveralls, twill cotton uniforms, polycotton uniforms, high visibility reflective vests, disposable coveralls, fire retardant coveralls and lab coats.',
  'Safety Footwear':
    'Non-metal safety shoes, metal safety shoes, welder boots, gumboots and executive safety shoes.',
  'Hand Protection':
    'Dotted gloves, nitrile gloves, chemical resistant gloves, vinyl gloves, latex gloves, leather gloves and welding gloves.',
  'Respiratory Protection':
    'Surgical masks, N95 masks, full face masks, half face masks and respiratory masks.',
  'Eye & Ear Protection':
    'Face shields, safety goggles, safety spectacles, ear muffs and ear plugs.',
  'Head Protection':
    'Metal helmets, fiber helmets and helmets with ratchet and chin strap.',
  'Fall Protection':
    'Full body harnesses, lanyards, retractable fall arresters and cargo lashing belts.',
  'Building Materials & Hardware': 'Building materials and hardware products supplied for commercial procurement requirements.',
  'Printing Services':
    'DTF, embroidery, sublimation, screen printing, offset printing, signages, shields and trophies.',
  'Shields and Trophies': 'Custom shields, trophies and recognition awards.',
  Signages: 'Industrial, safety and directional signages.',
  'Bird & Cat Food': 'Bird and cat food plus related accessories.',
  'Order Suppliers': 'Custom order sourcing for products not listed in the main catalog.',
  'Marine Paints': 'Marine paints for commercial and industrial supply requirements.',
  'Steel Wire Ropes': 'Kiswire steel wire ropes and related wire rope supply requirements.',
  Stationeries: 'Stationeries and customized stationery sets.',
  'Medical Consumables': 'Medical consumables for hygiene, workplace and facility requirements.',
  'Miscellaneous Products':
    'Oil spill kits, traffic cones, warning tapes, barriers, flash lights, PVC buckets, plastic drums, PVC aprons, garbage bags, bio-degradable bags, trolley bags, tool boxes, ladders, water coolers, first aid boxes, shoe covers, hairnets, fire resistant cabinets, nylon ropes, food grade silicones, cleaning accessories, hygiene products, stretch films, blower fans with ducts, winter jackets and ANZA refills or handles.',
};

const buyerQuestions = [
  {
    question: 'What does Logos International supply?',
    answer:
      'Logos International supplies PPE, health and safety requisites, medical consumables, hardware, uniforms, printing services, marine paints, Kiswire steel wire ropes, stationeries and miscellaneous products.',
  },
  {
    question: 'Where is Logos International based?',
    answer:
      'Logos International is based in Sharjah, United Arab Emirates, and supports customers across the UAE and GCC countries.',
  },
  {
    question: 'Can Logos International handle customized uniforms and printing?',
    answer:
      'Yes. The catalog covers ready made and customized clothing plus DTF, embroidery, sublimation, screen printing, offset printing, signages, shields and trophies.',
  },
  {
    question: 'How should a customer request a quotation?',
    answer:
      'Send the product name, quantity, specification, delivery location and timeline so the team can review availability and respond with the next practical step.',
  },
];

const regionalPages = [
  ['sharjah', 'Sharjah PPE, Safety and Industrial Supplier | Logos International', 'Sharjah supplier for PPE, safety requisites, medical consumables, uniforms, hardware, printing services and custom sourcing with UAE and GCC support.', 'Sharjah PPE supplier, safety supplier Sharjah, industrial supplies Sharjah, uniforms Sharjah, printing services Sharjah'],
  ['dubai', 'Dubai PPE, Uniforms and Safety Supplier | Logos International UAE', 'PPE, safety footwear, gloves, masks, uniforms, hardware and printing supply support for Dubai businesses through Logos International.', 'Dubai PPE supplier, uniforms supplier Dubai, safety footwear Dubai, industrial supplies Dubai, printing services Dubai'],
  ['abu-dhabi', 'Abu Dhabi PPE and Industrial Supplier | Logos International', 'Abu Dhabi PPE, safety, hardware, uniforms, medical consumables and industrial supply inquiries supported by Logos International.', 'Abu Dhabi PPE supplier, industrial supplies Abu Dhabi, safety supplier Abu Dhabi, uniforms Abu Dhabi, PPE UAE'],
  ['ajman', 'Ajman PPE, Uniforms and Facility Supplier | Logos International UAE', 'Ajman PPE, uniforms, safety footwear, gloves, masks, hygiene products, hardware and printing supply inquiries supported by Logos International.', 'Ajman PPE supplier, uniforms supplier Ajman, safety footwear Ajman, hygiene products Ajman, hardware supplier Ajman'],
  ['ras-al-khaimah', 'Ras Al Khaimah PPE and Industrial Supplier | Logos International UAE', 'Ras Al Khaimah PPE, safety products, hardware, helmets, fall protection, wire ropes and custom industrial supply inquiries.', 'Ras Al Khaimah PPE supplier, RAK industrial supplies, safety supplier Ras Al Khaimah, wire ropes RAK, hardware supplier RAK'],
  ['fujairah', 'Fujairah Marine, PPE and Industrial Supplier | Logos International UAE', 'Fujairah marine paints, Kiswire steel wire ropes, PPE, gloves, helmets, safety footwear and industrial supply inquiries.', 'Fujairah PPE supplier, marine paints Fujairah, wire ropes Fujairah, safety supplier Fujairah, industrial supplies Fujairah'],
  ['saudi-arabia', 'Saudi Arabia PPE and Industrial Sourcing | Logos International GCC', 'Saudi Arabia sourcing inquiries for PPE, safety requisites, uniforms, hardware, marine paints, Kiswire steel wire ropes and custom supply.', 'Saudi Arabia PPE sourcing, GCC industrial supplier, Saudi safety supplier, Kiswire wire ropes Saudi Arabia, uniforms sourcing Saudi Arabia'],
  ['qatar', 'Qatar PPE, Uniform and Industrial Sourcing | Logos International', 'Qatar sourcing inquiries for PPE, safety requisites, uniforms, hardware, printing services and custom-order products.', 'Qatar PPE sourcing, Qatar uniforms supplier, GCC PPE supplier, industrial supplies Qatar, printing services Qatar sourcing'],
  ['oman', 'Oman PPE, Marine Paints and Industrial Sourcing | Logos International', 'Oman sourcing inquiries for PPE, marine paints, Kiswire steel wire ropes, safety requisites, uniforms, hardware and custom products.', 'Oman PPE sourcing, marine paints Oman, wire ropes Oman, safety supplier Oman, GCC industrial sourcing'],
  ['bahrain', 'Bahrain PPE and Commercial Supply Sourcing | Logos International', 'Bahrain sourcing inquiries for PPE, safety requisites, uniforms, stationery, medical consumables, printing and custom-order products.', 'Bahrain PPE sourcing, Bahrain safety supplier, uniforms Bahrain sourcing, GCC commercial supply, medical consumables Bahrain'],
  ['kuwait', 'Kuwait PPE, Safety and Custom Order Sourcing | Logos International', 'Kuwait sourcing inquiries for PPE, safety footwear, gloves, masks, helmets, hardware, printing and miscellaneous products.', 'Kuwait PPE sourcing, Kuwait safety supplier, gloves Kuwait sourcing, N95 masks Kuwait, GCC commercial supply'],
].map(([slug, title, description, keywords]) => ({
  route: `/coverage/${slug}`,
  type: 'CollectionPage',
  title,
  description,
  keywords,
  section: 'Coverage',
}));

const industryPages = [
  ['construction', 'Construction PPE and Hardware Supplier UAE GCC | Logos International', 'Construction site PPE, safety footwear, helmets, fall protection, gloves, hardware and consumables for UAE and GCC supply inquiries.', 'construction PPE supplier UAE, construction safety supplier, helmets UAE, fall protection UAE, site hardware supplier UAE'],
  ['marine', 'Marine Paints, Wire Ropes and PPE Supplier UAE GCC | Logos International', 'Marine paints, Kiswire steel wire ropes, PPE, hand protection, helmets and industrial supply inquiries for UAE and GCC buyers.', 'marine paints UAE, Kiswire steel wire ropes UAE, marine PPE supplier, industrial marine supplier GCC'],
  ['facilities', 'Facilities PPE, Hygiene and Operations Supplier UAE | Logos International', 'Facilities supply inquiries for PPE, medical consumables, hygiene products, signage, stationery, cleaning accessories and operations items.', 'facilities supplier UAE, hygiene products supplier UAE, PPE facilities UAE, cleaning accessories UAE, first aid boxes UAE'],
  ['healthcare', 'Medical Consumables, Masks and Gloves Supplier UAE | Logos International', 'Medical consumables, masks, gloves, disposable coveralls, lab coats, shoe covers, hairnets and hygiene product inquiries in UAE and GCC.', 'medical consumables UAE, N95 mask supplier UAE, gloves supplier UAE, lab coats UAE, hygiene products UAE'],
  ['hospitality', 'Hospitality Uniforms, Printing and Supply UAE | Logos International', 'Hospitality uniforms, branded printing, signage, trophies, stationery, hygiene products and operational supply inquiries in UAE and GCC.', 'hospitality uniforms UAE, printing services UAE, signage supplier UAE, trophies UAE, hotel supplies UAE'],
  ['printing-branding', 'Printing, Branding, Signage and Trophies UAE | Logos International', 'DTF, embroidery, sublimation, screen printing, offset printing, signage, shields and trophies for UAE and GCC inquiries.', 'DTF printing UAE, embroidery UAE, screen printing UAE, signage UAE, trophies UAE, branding supplier Sharjah'],
].map(([slug, title, description, keywords]) => ({
  route: `/industries/${slug}`,
  type: 'CollectionPage',
  title,
  description,
  keywords,
  section: 'Industries',
}));

const basePages = [
  {
    route: '/',
    type: 'WebPage',
    title: 'Logos International | PPE, Safety and Industrial Supplier in Sharjah UAE and GCC',
    description:
      'Sharjah sourcing and supply company for PPE, safety requisites, medical consumables, hardware, uniforms, printing services and custom procurement across the UAE and GCC markets.',
    keywords:
      'Logos International, Sharjah PPE supplier, UAE safety supplier, GCC industrial supplies, Dubai PPE supplier, Abu Dhabi industrial supplies, Saudi Arabia sourcing, Qatar sourcing, Oman sourcing, Bahrain sourcing, Kuwait sourcing, UAE uniforms supplier, printing services Sharjah',
  },
  {
    route: '/catalog',
    type: 'CollectionPage',
    title: 'PPE, Uniforms, Hardware and Safety Catalog | Logos International UAE GCC',
    description:
      'Browse UAE and GCC supply categories including PPE, workwear, safety footwear, gloves, masks, helmets, fall protection, medical consumables, hardware, printing, marine paints and Kiswire wire ropes.',
    keywords:
      'PPE catalog UAE, safety footwear UAE, safety gloves Sharjah, N95 mask UAE, industrial hardware UAE, uniforms supplier UAE, printing services Sharjah, Kiswire steel wire ropes UAE, marine paints UAE, GCC PPE supplier',
  },
  {
    route: '/services',
    type: 'WebPage',
    title: 'Sourcing, Supply and Delivery Services | UAE and GCC | Logos International',
    description:
      'Sourcing, supply and delivery support for PPE, safety requisites, medical consumables, hardware, uniforms, printing and custom-order products across Sharjah, UAE and GCC countries.',
    keywords:
      'UAE sourcing services, GCC procurement support, PPE supply service, industrial supply delivery, Sharjah supply services, UAE sourcing supplier, Saudi Arabia sourcing, Qatar sourcing, Oman sourcing',
  },
  {
    route: '/coverage',
    type: 'CollectionPage',
    title: 'UAE and GCC PPE, Safety and Industrial Supply Coverage | Logos International',
    description:
      'Regional coverage pages for Sharjah, Dubai, Abu Dhabi, Saudi Arabia, Qatar, Oman, Bahrain and Kuwait PPE, safety, industrial and sourcing inquiries.',
    keywords:
      'UAE PPE supplier, GCC safety supplier, Sharjah PPE, Dubai PPE supplier, Abu Dhabi industrial supplier, Saudi Arabia sourcing, Qatar sourcing, Oman sourcing, Bahrain sourcing, Kuwait sourcing',
  },
  {
    route: '/industries',
    type: 'CollectionPage',
    title: 'Industry Supply Pages for Construction, Marine, Facilities and Healthcare | Logos International',
    description:
      'Industry-focused supply pages for construction, marine, facilities, healthcare, hospitality, printing and branding procurement across UAE and GCC.',
    keywords:
      'construction PPE supplier UAE, marine paints UAE, facilities supplier UAE, medical consumables UAE, hospitality uniforms UAE, printing services UAE',
  },
  {
    route: '/contact',
    type: 'ContactPage',
    title: 'Contact Logos International | Sharjah UAE and GCC Supply Inquiries',
    description:
      'Contact Logos International in Sharjah for PPE, safety requisites, medical consumables, hardware, uniforms, printing services, miscellaneous products and UAE or GCC sourcing requests.',
    keywords:
      'contact Logos International, Sharjah PPE supplier contact, UAE supply inquiry, GCC sourcing request, Logos International quote request, UAE industrial supplier contact',
  },
  {
    route: '/privacy',
    type: 'WebPage',
    title: 'Privacy Policy | Logos International',
    description: 'Privacy practices for Logos International website inquiries and sourcing service requests.',
    keywords: 'Logos International privacy policy',
  },
  {
    route: '/terms',
    type: 'WebPage',
    title: 'Terms of Service | Logos International',
    description: 'Terms for using Logos International website, catalog and sourcing inquiry services.',
    keywords: 'Logos International terms of service',
  },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

let productImagePaths = new Map();

const loadProductImageManifest = async (products) => {
  const manifestPath = path.resolve('public/catalog-images/manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const entries = new Map(manifest.products.map((entry) => [entry.id, entry.path]));

  for (const product of products) {
    const imagePath = entries.get(product.id);
    if (!imagePath || imagePath.endsWith('.svg')) {
      throw new Error(`Missing real internet product image for ${product.name}. Run npm run assets:images first.`);
    }
  }

  return entries;
};

const productImagePath = (product) => `/${productImagePaths.get(product.id)}`;
const productImageUrl = (product) => `${siteUrl}${productImagePath(product)}`;

const escapeAttribute = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeScriptJson = (value) => JSON.stringify(value).replace(/<\/script/gi, '<\\/script');

const readProducts = async () => {
  const source = await readFile(path.resolve('src/data/products.ts'), 'utf8');
  const matches = source.matchAll(
    /\{\s*id:\s*(\d+),\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",[\s\S]*?description:\s*"([^"]*)"/g,
  );

  return Array.from(matches, ([, id, name, category, description]) => ({
    id: Number(id),
    name,
    category,
    description,
  }));
};

const groupProducts = (products) =>
  Array.from(
    products.reduce((groups, product) => {
      const items = groups.get(product.category) || [];
      items.push(product);
      groups.set(product.category, items);
      return groups;
    }, new Map()),
  )
    .map(([category, items]) => ({
      category,
      slug: slugify(category),
      summary: categoryCopy[category] || `${category} products supplied by Logos International.`,
      items,
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

const buildPages = (categories) => [
  ...basePages,
  ...regionalPages,
  ...industryPages,
  ...categories.map((group) => ({
    route: `/catalog/${group.slug}`,
    type: 'CollectionPage',
    title: `${group.category} Supplier in UAE | Logos International`,
    description: `${group.summary} Available through Logos International for Sharjah, UAE and GCC supply inquiries.`,
    keywords: `${group.category} UAE, ${group.category} Sharjah, Logos International ${group.category}, UAE PPE supplier, GCC industrial supplier`,
    category: group.category,
  })),
];

const organizationSchema = (categories) => ({
  '@type': ['Organization', 'LocalBusiness'],
  '@id': `${siteUrl}/#organization`,
  name: 'Logos International',
  legalName: 'Logos International',
  url: `${siteUrl}/`,
  logo: brandLogo,
  image: brandImage,
  email: contactEmail,
  description:
    'Sharjah, UAE multi-category sourcing and supply company providing PPE, health and safety requisites, medical consumables, hardware, uniforms, printing services and custom-order products across the UAE and GCC countries.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sharjah',
    addressRegion: 'Sharjah',
    addressCountry: 'AE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.3463,
    longitude: 55.4209,
  },
  areaServed: serviceAreas,
  knowsAbout: [...productFocus, ...categories.map((group) => group.category)],
  contactPoint: {
    '@type': 'ContactPoint',
    email: contactEmail,
    contactType: 'sales',
    areaServed: ['AE', 'GCC'],
    availableLanguage: ['English', 'Arabic'],
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Logos International product categories',
    itemListElement: categories.map((group, index) => ({
      '@type': 'OfferCatalog',
      position: index + 1,
      name: group.category,
      description: group.summary,
      url: `${siteUrl}/catalog/${group.slug}`,
    })),
  },
});

const buildStructuredData = (page, products, categories) => {
  const currentUrl = `${siteUrl}${page.route}`;
  const pageProducts = page.category ? products.filter((product) => product.category === page.category) : products;
  const graph = [
    organizationSchema(categories),
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: 'Logos International',
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'en-AE',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/catalog?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': page.type,
      '@id': `${currentUrl}#webpage`,
      url: currentUrl,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
      primaryImageOfPage: brandImage,
      inLanguage: 'en-AE',
    },
  ];

  if (page.route.startsWith('/catalog')) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${currentUrl}#product-list`,
      name: page.category ? `${page.category} products` : 'Logos International product catalog',
      description: page.description,
      numberOfItems: pageProducts.length,
      itemListElement: pageProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: currentUrl,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
          category: product.category,
          image: productImageUrl(product),
          brand: { '@id': `${siteUrl}/#organization` },
          additionalProperty: [
            { '@type': 'PropertyValue', name: 'Pricing', value: 'Quote on request' },
            { '@type': 'PropertyValue', name: 'Availability', value: 'Confirmed after inquiry' },
          ],
        },
      })),
    });
  }

  if (page.route === '/' || page.route === '/services') {
    graph.push({
      '@type': 'Service',
      '@id': `${siteUrl}/services#sourcing-service`,
      name: 'Sourcing and supply services',
      provider: { '@id': `${siteUrl}/#organization` },
      areaServed: ['United Arab Emirates', 'GCC countries'],
      serviceType: [
        'PPE supply',
        'Health and safety requisites',
        'Medical consumables',
        'Industrial hardware',
        'Uniform sourcing',
        'Printing services',
        'Marine paints',
        'Kiswire steel wire ropes',
        'Custom procurement',
      ],
    });
  }

  if (page.route.startsWith('/coverage') || page.route.startsWith('/industries')) {
    graph.push({
      '@type': 'Service',
      '@id': `${currentUrl}#supply-service`,
      name: page.title,
      description: page.description,
      provider: { '@id': `${siteUrl}/#organization` },
      areaServed: ['United Arab Emirates', 'GCC countries'],
      serviceType: productFocus,
    });
  }

  if (page.route === '/' || page.route === '/catalog' || page.route === '/services') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${currentUrl}#answers`,
      mainEntity: buyerQuestions.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  if (page.category) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${currentUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Catalog',
          item: `${siteUrl}/catalog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.category,
          item: currentUrl,
        },
      ],
    });
  }

  if (page.section) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${currentUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.section,
          item: `${siteUrl}/${page.section.toLowerCase()}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.title,
          item: currentUrl,
        },
      ],
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
};

const replaceMeta = (html, page, products, categories) => {
  const canonicalUrl = `${siteUrl}${page.route}`;
  const structuredData = escapeScriptJson(buildStructuredData(page, products, categories));

  return html
    .replace(/<title>.*?<\/title>/, `<title>${escapeAttribute(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttribute(page.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<link rel="alternate" href="[^"]*" hreflang="en-AE" \/>/, `<link rel="alternate" href="${canonicalUrl}" hreflang="en-AE" />`)
    .replace(/<link rel="alternate" href="[^"]*" hreflang="x-default" \/>/, `<link rel="alternate" href="${canonicalUrl}" hreflang="x-default" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeAttribute(page.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttribute(page.description)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeAttribute(page.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeAttribute(page.description)}" />`)
    .replace(
      /<script id="base-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script id="base-structured-data" type="application/ld+json">${structuredData}</script>`,
    );
};

const writePage = async (page, html) => {
  if (page.route === '/') {
    await writeFile(path.join(distDir, 'index.html'), html);
    return;
  }

  const routeName = page.route.slice(1);
  const routeDir = path.join(distDir, routeName);
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, 'index.html'), html);
  await writeFile(path.join(distDir, `${routeName}.html`), html);
};

const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
const products = await readProducts();

if (products.length === 0) {
  throw new Error('No products found while generating static route metadata.');
}

productImagePaths = await loadProductImageManifest(products);
const categories = groupProducts(products);
const pages = buildPages(categories);

await Promise.all(
  pages.map((page) => writePage(page, replaceMeta(template, page, products, categories))),
);

console.log(`Generated static SEO pages for ${pages.length} routes with ${products.length} catalog items.`);
