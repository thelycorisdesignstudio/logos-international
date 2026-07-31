import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteUrl = 'https://logosae.com';
const contactEmail = 'info@logos.ae';
const generatedDate = new Date().toISOString().slice(0, 10);
const publicDir = path.resolve('public');

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
  path: `/coverage/${slug}`,
  title,
  description,
  keywords,
  priority: '0.84',
  changefreq: 'monthly',
}));

const industryPages = [
  ['construction', 'Construction PPE and Hardware Supplier UAE GCC | Logos International', 'Construction site PPE, safety footwear, helmets, fall protection, gloves, hardware and consumables for UAE and GCC supply inquiries.', 'construction PPE supplier UAE, construction safety supplier, helmets UAE, fall protection UAE, site hardware supplier UAE'],
  ['marine', 'Marine Paints, Wire Ropes and PPE Supplier UAE GCC | Logos International', 'Marine paints, Kiswire steel wire ropes, PPE, hand protection, helmets and industrial supply inquiries for UAE and GCC buyers.', 'marine paints UAE, Kiswire steel wire ropes UAE, marine PPE supplier, industrial marine supplier GCC'],
  ['facilities', 'Facilities PPE, Hygiene and Operations Supplier UAE | Logos International', 'Facilities supply inquiries for PPE, medical consumables, hygiene products, signage, stationery, cleaning accessories and operations items.', 'facilities supplier UAE, hygiene products supplier UAE, PPE facilities UAE, cleaning accessories UAE, first aid boxes UAE'],
  ['healthcare', 'Medical Consumables, Masks and Gloves Supplier UAE | Logos International', 'Medical consumables, masks, gloves, disposable coveralls, lab coats, shoe covers, hairnets and hygiene product inquiries in UAE and GCC.', 'medical consumables UAE, N95 mask supplier UAE, gloves supplier UAE, lab coats UAE, hygiene products UAE'],
  ['hospitality', 'Hospitality Uniforms, Printing and Supply UAE | Logos International', 'Hospitality uniforms, branded printing, signage, trophies, stationery, hygiene products and operational supply inquiries in UAE and GCC.', 'hospitality uniforms UAE, printing services UAE, signage supplier UAE, trophies UAE, hotel supplies UAE'],
  ['printing-branding', 'Printing, Branding, Signage and Trophies UAE | Logos International', 'DTF, embroidery, sublimation, screen printing, offset printing, signage, shields and trophies for UAE and GCC inquiries.', 'DTF printing UAE, embroidery UAE, screen printing UAE, signage UAE, trophies UAE, branding supplier Sharjah'],
].map(([slug, title, description, keywords]) => ({
  path: `/industries/${slug}`,
  title,
  description,
  keywords,
  priority: '0.83',
  changefreq: 'monthly',
}));

const baseRoutes = [
  {
    path: '/',
    title: 'Logos International | PPE, Safety and Industrial Supplier in Sharjah UAE and GCC',
    description:
      'Sharjah sourcing and supply company for PPE, safety requisites, medical consumables, hardware, uniforms, printing services and custom procurement across the UAE and GCC markets.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/catalog',
    title: 'PPE, Uniforms, Hardware and Safety Catalog | Logos International UAE GCC',
    description:
      'Browse UAE and GCC supply categories including PPE, workwear, safety footwear, gloves, masks, helmets, fall protection, medical consumables, hardware, printing, marine paints and Kiswire wire ropes.',
    priority: '0.95',
    changefreq: 'weekly',
  },
  {
    path: '/services',
    title: 'Sourcing, Supply and Delivery Services | UAE and GCC | Logos International',
    description:
      'Sourcing, supply and delivery support for PPE, safety requisites, medical consumables, hardware, uniforms, printing and custom-order products across Sharjah, UAE and GCC countries.',
    priority: '0.82',
    changefreq: 'monthly',
  },
  {
    path: '/coverage',
    title: 'UAE and GCC PPE, Safety and Industrial Supply Coverage | Logos International',
    description:
      'Regional coverage pages for Sharjah, Dubai, Abu Dhabi, Saudi Arabia, Qatar, Oman, Bahrain and Kuwait PPE, safety, industrial and sourcing inquiries.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/industries',
    title: 'Industry Supply Pages for Construction, Marine, Facilities and Healthcare | Logos International',
    description:
      'Industry-focused supply pages for construction, marine, facilities, healthcare, hospitality, printing and branding procurement across UAE and GCC.',
    priority: '0.88',
    changefreq: 'monthly',
  },
  {
    path: '/contact',
    title: 'Contact Logos International | Sharjah UAE and GCC Supply Inquiries',
    description:
      'Contact Logos International in Sharjah for PPE, safety requisites, medical consumables, hardware, uniforms, printing services, miscellaneous products and UAE or GCC sourcing requests.',
    priority: '0.78',
    changefreq: 'monthly',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Logos International',
    description: 'Privacy practices for Logos International website inquiries and sourcing service requests.',
    priority: '0.2',
    changefreq: 'yearly',
  },
  {
    path: '/terms',
    title: 'Terms of Service | Logos International',
    description: 'Terms for using Logos International website, catalog and sourcing inquiry services.',
    priority: '0.2',
    changefreq: 'yearly',
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
  const manifestPath = path.join(publicDir, 'catalog-images', 'manifest.json');
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

const absoluteUrl = (routePath) => `${siteUrl}${routePath === '/' ? '/' : routePath}`;

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

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

const buildRoutes = (categories) => [
  ...baseRoutes,
  ...regionalPages,
  ...industryPages,
  ...categories.map((group) => ({
    path: `/catalog/${group.slug}`,
    title: `${group.category} Supplier in UAE | Logos International`,
    description: `${group.summary} Available through Logos International for Sharjah, UAE and GCC supply inquiries.`,
    priority: '0.86',
    changefreq: 'weekly',
    category: group.category,
  })),
];

const buildEntityGraph = (products) => {
  const categories = groupProducts(products);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': `${siteUrl}/#organization`,
        name: 'Logos International',
        legalName: 'Logos International',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/logo-mark.svg`,
        image: `${siteUrl}/og-image.svg`,
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
          '@id': `${siteUrl}/catalog#offer-catalog`,
          name: 'Logos International product categories',
          itemListElement: categories.map((group, index) => ({
            '@type': 'OfferCatalog',
            position: index + 1,
            name: group.category,
            description: group.summary,
            url: `${siteUrl}/catalog/${group.slug}`,
          })),
        },
      },
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
        '@type': 'OfferCatalog',
        '@id': `${siteUrl}/catalog#catalog`,
        name: 'Logos International product catalog',
        url: `${siteUrl}/catalog`,
        provider: { '@id': `${siteUrl}/#organization` },
        itemListElement: categories.map((group, index) => ({
          '@type': 'OfferCatalog',
          position: index + 1,
          name: group.category,
          description: group.summary,
          url: `${siteUrl}/catalog/${group.slug}`,
          numberOfItems: group.items.length,
          itemListElement: group.items.map((product, productIndex) => ({
            '@type': 'Product',
            position: productIndex + 1,
            name: product.name,
            description: product.description,
            category: product.category,
            image: productImageUrl(product),
            url: `${siteUrl}/catalog/${group.slug}`,
            brand: { '@id': `${siteUrl}/#organization` },
            additionalProperty: [
              { '@type': 'PropertyValue', name: 'Pricing', value: 'Quote on request' },
              { '@type': 'PropertyValue', name: 'Availability', value: 'Confirmed after inquiry' },
            ],
          })),
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#answers`,
        mainEntity: buyerQuestions.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/coverage#regional-pages`,
        name: 'Logos International UAE and GCC coverage pages',
        itemListElement: regionalPages.map((page, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl}${page.path}`,
          name: page.title,
          description: page.description,
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/industries#industry-pages`,
        name: 'Logos International industry supply pages',
        itemListElement: industryPages.map((page, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl}${page.path}`,
          name: page.title,
          description: page.description,
        })),
      },
    ],
  };
};

const buildCatalogData = (products) => {
  const groupedProducts = groupProducts(products);

  return {
    name: 'Logos International Catalog Data',
    canonicalUrl: `${siteUrl}/catalog`,
    generatedDate,
    company: {
      name: 'Logos International',
      businessType: 'Multi-category sourcing and supply company',
      location: 'Sharjah, United Arab Emirates',
      email: contactEmail,
      serviceArea: serviceAreas,
      summary:
        'Commercial supplier supporting customers across PPE, safety, medical consumables, hardware, uniforms, printing services and custom-order categories.',
    },
    totalProducts: products.length,
    categories: groupedProducts.map((group) => ({
      name: group.category,
      slug: group.slug,
      canonicalUrl: `${siteUrl}/catalog/${group.slug}`,
      summary: group.summary,
      productCount: group.items.length,
      products: group.items.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        image: productImageUrl(product),
      })),
    })),
    buyerQuestions,
    quoteInstructions: {
      requiredDetails: ['product name', 'quantity', 'specification', 'delivery location', 'timeline'],
      contactEmail,
      quoteStatus: 'Quote on request',
    },
  };
};

const buildAnswerEngineData = (products) => {
  const categories = groupProducts(products);

  return {
    name: 'Logos International Answer Engine Data',
    canonicalUrl: siteUrl,
    generatedDate,
    entity: {
      name: 'Logos International',
      type: 'Multi-category sourcing and supply company',
      location: 'Sharjah, United Arab Emirates',
      primaryEmail: contactEmail,
      areaServed: serviceAreas,
    },
    directAnswers: [
      ...buyerQuestions,
      {
        question: 'Is Logos International a PPE supplier in UAE?',
        answer:
          'Yes. Logos International supplies PPE and health and safety requisites in the UAE, including workwear, footwear, gloves, masks, eye protection, ear protection, helmets and fall protection items.',
      },
      {
        question: 'Does Logos International support GCC sourcing requests?',
        answer:
          'Yes. Logos International is based in Sharjah and supports UAE and GCC supply inquiries for listed catalog items and custom sourcing requests.',
      },
      {
        question: 'What details should be included for a Logos International quote?',
        answer:
          'Customers should include product name or category, quantity, specification, delivery location and timeline when requesting a quote from Logos International.',
      },
      ...regionalPages.map((page) => ({
        question: `Does Logos International have a page for ${page.title.replace(' | Logos International', '')}?`,
        answer: `${page.description} Canonical page: ${siteUrl}${page.path}.`,
      })),
      ...industryPages.map((page) => ({
        question: `Does Logos International support ${page.title.replace(' | Logos International', '')}?`,
        answer: `${page.description} Canonical page: ${siteUrl}${page.path}.`,
      })),
    ],
    categoryAnswers: categories.map((group) => ({
      question: `Does Logos International supply ${group.category} in UAE?`,
      answer: `Yes. ${group.summary} Available through Logos International for Sharjah, UAE and GCC supply inquiries.`,
      canonicalUrl: `${siteUrl}/catalog/${group.slug}`,
      productCount: group.items.length,
    })),
    citationTargets: [
      `${siteUrl}/`,
      `${siteUrl}/catalog`,
      `${siteUrl}/services`,
      `${siteUrl}/coverage`,
      `${siteUrl}/industries`,
      `${siteUrl}/contact`,
      `${siteUrl}/entity.jsonld`,
      `${siteUrl}/catalog-data.json`,
    ],
  };
};

const buildGeoContext = (products) => {
  const categories = groupProducts(products);

  return {
    name: 'Logos International GEO Context',
    canonicalUrl: siteUrl,
    generatedDate,
    geoTarget: {
      country: 'United Arab Emirates',
      emirate: 'Sharjah',
      coordinates: {
        latitude: 25.3463,
        longitude: 55.4209,
      },
      serviceAreas,
      broaderRegion: 'Gulf Cooperation Council',
    },
    commercialIntentPages: [
      {
        intent: 'PPE supplier in Sharjah UAE',
        url: `${siteUrl}/catalog`,
      },
      {
        intent: 'Industrial supplies and hardware sourcing UAE',
        url: `${siteUrl}/catalog/building-materials-and-hardware`,
      },
      {
        intent: 'Uniforms and workwear supplier UAE',
        url: `${siteUrl}/catalog/clothing`,
      },
      {
        intent: 'Printing services and branded uniforms Sharjah',
        url: `${siteUrl}/catalog/printing-services`,
      },
      {
        intent: 'GCC sourcing inquiry contact',
        url: `${siteUrl}/contact`,
      },
      ...regionalPages.map((page) => ({
        intent: page.keywords.split(', ')[0],
        url: `${siteUrl}${page.path}`,
      })),
      ...industryPages.map((page) => ({
        intent: page.keywords.split(', ')[0],
        url: `${siteUrl}${page.path}`,
      })),
    ],
    categoryCoverage: categories.map((group) => ({
      category: group.category,
      canonicalUrl: `${siteUrl}/catalog/${group.slug}`,
      products: group.items.map((product) => product.name),
    })),
    quoteProcess: {
      requiredDetails: ['product name or category', 'quantity', 'specification', 'delivery location', 'timeline'],
      contactEmail,
    },
  };
};

const buildLlmsSummary = () => `# Logos International

> Sharjah, United Arab Emirates supply company for PPE, health and safety requisites, medical consumables, hardware, uniforms, printing services, industrial products and miscellaneous products across the UAE and GCC countries.

## Canonical Site

- Homepage: ${siteUrl}/
- Catalog: ${siteUrl}/catalog
- Services: ${siteUrl}/services
- Coverage: ${siteUrl}/coverage
- Industries: ${siteUrl}/industries
- Contact: ${siteUrl}/contact
- Full AI context: ${siteUrl}/llms-full.txt
- Entity graph: ${siteUrl}/entity.jsonld
- Catalog data: ${siteUrl}/catalog-data.json
- Answer engine data: ${siteUrl}/answer-engine.json
- GEO context: ${siteUrl}/geo-context.json

## Entity Facts

- Name: Logos International
- Business type: Multi-category sourcing and supply company
- Location: Sharjah, United Arab Emirates
- Region served: Sharjah, Dubai, Abu Dhabi, Ajman, Ras Al Khaimah, Fujairah, UAE and GCC countries
- Contact email: ${contactEmail}
- Regional SEO pages: ${regionalPages.map((page) => `${siteUrl}${page.path}`).join(', ')}
- Industry SEO pages: ${industryPages.map((page) => `${siteUrl}${page.path}`).join(', ')}

## Product Scope

- Clothing: t-shirts, cargo pants, coveralls, 2pc uniforms, reflective vests, disposable coveralls, fire retardant coveralls and lab coats
- Safety footwear: non-metal safety shoes, metal safety shoes, welder boots, gumboots and executive safety shoes
- Hand protection: dotted, nitrile, chemical-resistant, vinyl, latex, leather and welding gloves
- Respiratory protection: surgical masks, N95 masks, full face masks, half face masks and respiratory masks
- Eye, ear and head protection: face shields, safety goggles, safety spectacles, ear muffs, ear plugs and helmets
- Fall protection: full body harnesses, lanyards, retractable fall arresters and cargo lashing belts
- Industrial supply: building materials, hardware, marine paints, Kiswire steel wire ropes and site consumables
- Printing and branding: DTF, embroidery, sublimation, screen printing, offset printing, signages, shields and trophies
- Custom orders: medical consumables, stationeries, bird and cat food, custom order sourcing and miscellaneous products

## Quote Guidance

For quotations, customers should send the product name, quantity, specification, delivery location and timeline to ${contactEmail} or through the contact page.
`;

const buildLlmsFull = (products) => {
  const categories = groupProducts(products);
  const routes = buildRoutes(categories);
  const routeLines = routes
    .map((route) => `- ${absoluteUrl(route.path)}: ${route.title}. ${route.description}`)
    .join('\n');
  const questionLines = buyerQuestions.map((item) => `- ${item.question} ${item.answer}`).join('\n');
  const categoryLines = categories
    .map(
      (group) =>
        `### ${group.category}\n\nCanonical URL: ${siteUrl}/catalog/${group.slug}\n\n${group.summary}\n\n${group.items
          .map((product) => `- ${product.name}: ${product.description}`)
          .join('\n')}`,
    )
    .join('\n\n');

  return `# Logos International Full AI Context

Generated: ${generatedDate}
Canonical site: ${siteUrl}/

## Entity Summary

Logos International is a Sharjah, United Arab Emirates multi-category supply company serving customers with PPE, health and safety requisites, medical consumables, hardware, uniforms, printing services and custom-order products across the UAE and GCC countries.

## Canonical Pages

${routeLines}

## Business Facts

- Name: Logos International
- Type: Multi-category sourcing and supply company
- Location: Sharjah, United Arab Emirates
- Coverage: Sharjah, Dubai, Abu Dhabi, Ajman, Ras Al Khaimah, Fujairah, UAE and GCC countries
- Email: ${contactEmail}
- Quote process: customer sends product, quantity, specification, delivery location and timeline
- Quote status: quote on request

## Buyer Answers

${questionLines}

## Catalog Summary

- Total listed products: ${products.length}
- Total categories: ${categories.length}

${categoryLines}

## Machine-Readable Files

- Entity graph: ${siteUrl}/entity.jsonld
- Catalog data: ${siteUrl}/catalog-data.json
- Answer engine data: ${siteUrl}/answer-engine.json
- GEO context: ${siteUrl}/geo-context.json
- Sitemap: ${siteUrl}/sitemap.xml
- Robots: ${siteUrl}/robots.txt
`;
};

const buildSitemap = (routes, products) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes
  .map((route) => {
    const routeProducts = route.category ? products.filter((product) => product.category === route.category).slice(0, 5) : [];
    const productImages = routeProducts
      .map(
        (product) => `    <image:image>
      <image:loc>${productImageUrl(product)}</image:loc>
      <image:title>${escapeXml(product.name)}</image:title>
      <image:caption>${escapeXml(product.description)}</image:caption>
    </image:image>`,
      )
      .join('\n');

    return `  <url>
    <loc>${absoluteUrl(route.path)}</loc>
    <image:image>
      <image:loc>${siteUrl}/og-image.svg</image:loc>
      <image:title>${escapeXml(route.title)}</image:title>
    </image:image>
${productImages ? `${productImages}\n` : ''}    <lastmod>${generatedDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

const products = await readProducts();

if (products.length === 0) {
  throw new Error('No products found while generating discovery assets.');
}

productImagePaths = await loadProductImageManifest(products);
const categories = groupProducts(products);
const routes = buildRoutes(categories);

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, 'entity.jsonld'), `${JSON.stringify(buildEntityGraph(products), null, 2)}\n`);
await writeFile(path.join(publicDir, 'catalog-data.json'), `${JSON.stringify(buildCatalogData(products), null, 2)}\n`);
await writeFile(path.join(publicDir, 'answer-engine.json'), `${JSON.stringify(buildAnswerEngineData(products), null, 2)}\n`);
await writeFile(path.join(publicDir, 'geo-context.json'), `${JSON.stringify(buildGeoContext(products), null, 2)}\n`);
await writeFile(path.join(publicDir, 'llms.txt'), buildLlmsSummary());
await writeFile(path.join(publicDir, 'llms-full.txt'), buildLlmsFull(products));
await writeFile(path.join(publicDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
await writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemap(routes, products));

console.log(`Generated discovery assets with ${products.length} products and ${routes.length} routes.`);
