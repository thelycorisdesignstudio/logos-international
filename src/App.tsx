import React, { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe2,
  Mail,
  MapPin,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { productImageAlts, productImagePaths } from './data/productImages';
import { products } from './data/products';
import { Page, Product } from './types';

const SITE_URL = 'https://logosae.com';
const CONTACT_EMAIL = 'logosfze@gmail.com';
const CONTACT_PHONE = '+971 55 832 2030';
const CONTACT_PERSON = 'Simon Philip';
const CONTACT_ROLE = 'Business Development Manager';
const CONTACT_ADDRESS = 'P1- Hamriyah Business Center, P.O. Box- 41565, Hamriyah Free Zone - Sharjah, United Arab Emirates';
const BRAND_IMAGE = `${SITE_URL}/logo-official.png`;
const BRAND_LOGO = `${SITE_URL}/logo-official.png`;

type ProductGroup = {
  name: string;
  category: string;
  items: string;
};

type Service = {
  title: string;
  description: string;
  points: string[];
};

type BuyerQuestion = {
  question: string;
  answer: string;
};

type EditorialPage = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  proof: string;
  focus: string[];
  categories: string[];
  questions: BuyerQuestion[];
};

const navItems: { page: Page; label: string }[] = [
  { page: 'home', label: 'Home' },
  { page: 'products', label: 'Catalog' },
  { page: 'services', label: 'Services' },
  { page: 'coverage', label: 'Coverage' },
  { page: 'industries', label: 'Industries' },
  { page: 'contact', label: 'Contact' },
];

const categoryCodes: Record<string, string> = {
  Clothing: 'CL',
  'Safety Footwear': 'SF',
  'Hand Protection': 'HP',
  'Respiratory Protection': 'RP',
  'Eye & Ear Protection': 'EE',
  'Head Protection': 'HD',
  'Fall Protection': 'FP',
  'Building Materials & Hardware': 'BH',
  'Printing Services': 'PR',
  'Shields and Trophies': 'AW',
  Signages: 'SG',
  'Bird & Cat Food': 'BC',
  'Order Suppliers': 'OS',
  'Marine Paints': 'MP',
  'Steel Wire Ropes': 'WR',
  Stationeries: 'ST',
  'Miscellaneous Products': 'MX',
  'Medical Consumables': 'MC',
};

const productGroups: ProductGroup[] = [
  {
    name: 'Clothing',
    category: 'Clothing',
    items: 'T-shirts, cargo pants, coveralls, uniforms, reflective vests, lab coats',
  },
  {
    name: 'Safety footwear',
    category: 'Safety Footwear',
    items: 'Non-metal, metal, welder, gumboot, executive safety shoes',
  },
  {
    name: 'Hand protection',
    category: 'Hand Protection',
    items: 'Dotted, nitrile, chemical, vinyl, latex, leather, welding gloves',
  },
  {
    name: 'Respiratory',
    category: 'Respiratory Protection',
    items: 'Surgical, N95, full face, half face and respiratory masks',
  },
  {
    name: 'Eye and ear protection',
    category: 'Eye & Ear Protection',
    items: 'Face shields, safety goggles, spectacles, ear muffs and ear plugs',
  },
  {
    name: 'Head protection',
    category: 'Head Protection',
    items: 'Industrial helmets, fiber-reinforced helmets, ratchets and chin straps',
  },
  {
    name: 'Fall protection',
    category: 'Fall Protection',
    items: 'Harnesses, lanyards, retractable fall arresters, cargo lashing belts',
  },
  {
    name: 'Building materials and hardware',
    category: 'Building Materials & Hardware',
    items: 'Building materials, industrial pipe fittings, hardware and professional tools',
  },
  {
    name: 'Printing services',
    category: 'Printing Services',
    items: 'DTF, embroidery, sublimation, screen printing and offset printing',
  },
  {
    name: 'Shields and trophies',
    category: 'Shields and Trophies',
    items: 'Custom recognition shields, trophies and corporate awards',
  },
  {
    name: 'Industrial signages',
    category: 'Signages',
    items: 'Safety, directional and industrial signage for commercial sites',
  },
  {
    name: 'Bird and cat food',
    category: 'Bird & Cat Food',
    items: 'Cat food, bird feed and related pet accessories',
  },
  {
    name: 'Custom order sourcing',
    category: 'Order Suppliers',
    items: 'Products requested outside the listed catalog',
  },
  {
    name: 'Marine paints',
    category: 'Marine Paints',
    items: 'Marine anti-fouling paint and protective coating requirements',
  },
  {
    name: 'Steel wire ropes',
    category: 'Steel Wire Ropes',
    items: 'Kiswire high-tensile steel wire ropes for industrial requirements',
  },
  {
    name: 'Stationeries',
    category: 'Stationeries',
    items: 'Customized corporate stationery, notebooks, pens and paper sets',
  },
  {
    name: 'Medical consumables',
    category: 'Medical Consumables',
    items: 'Medical, hygiene, workplace and facility consumables supplied on request',
  },
  {
    name: 'Miscellaneous',
    category: 'Miscellaneous Products',
    items: 'Spill kits, cones, tapes, barriers, drums, ladders, coolers, hygiene supplies',
  },
];

const services: Service[] = [
  {
    title: 'Sourcing',
    description: 'We check the item, specification, quantity and delivery location before preparing a quote.',
    points: ['Requirement check', 'Product match', 'Available alternatives'],
  },
  {
    title: 'Supply',
    description: 'We coordinate listed products and approved alternatives across PPE, hardware, uniforms and consumables.',
    points: ['Order quantities', 'Brand options', 'Availability confirmation'],
  },
  {
    title: 'Delivery',
    description: 'We confirm the handover point, timing and delivery requirements for UAE and GCC orders.',
    points: ['Delivery location', 'Order status', 'Handover details'],
  },
];

const coverageAreas = [
  'Sharjah',
  'Dubai',
  'Abu Dhabi',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'UAE',
  'Saudi Arabia',
  'Qatar',
  'Oman',
  'Bahrain',
  'Kuwait',
];

const coveragePages: EditorialPage[] = [
  {
    slug: 'sharjah',
    title: 'Sharjah PPE, safety and supply.',
    eyebrow: 'Sharjah supply desk',
    description:
      'Local support for Sharjah buyers sourcing PPE, uniforms, hardware, medical consumables, printing services and custom product requests.',
    metaTitle: 'Sharjah PPE, Safety and Industrial Supplier | Logos International',
    metaDescription:
      'Sharjah supplier for PPE, safety requisites, medical consumables, uniforms, hardware, printing services and custom sourcing with UAE and GCC support.',
    keywords: 'Sharjah PPE supplier, safety supplier Sharjah, industrial supplies Sharjah, uniforms Sharjah, printing services Sharjah',
    proof: 'Sharjah base',
    focus: ['Fast inquiry review', 'PPE and safety requisites', 'Uniform and printing support', 'Custom sourcing'],
    categories: ['Clothing', 'Safety Footwear', 'Hand Protection', 'Respiratory Protection', 'Printing Services'],
    questions: [
      {
        question: 'Does Logos International supply PPE in Sharjah?',
        answer:
          'Yes. Logos International supports Sharjah PPE inquiries across workwear, safety footwear, gloves, masks, helmets and related safety requisites.',
      },
      {
        question: 'Can Sharjah customers request branded uniforms?',
        answer:
          'Yes. Buyers can request ready-made or customized uniforms with DTF, embroidery, sublimation, screen printing and offset printing support.',
      },
    ],
  },
  {
    slug: 'dubai',
    title: 'Dubai PPE, uniforms and site supply support.',
    eyebrow: 'Dubai procurement',
    description:
      'Dubai businesses can request PPE, safety footwear, gloves, masks, hardware, uniforms and branded supply items.',
    metaTitle: 'Dubai PPE, Uniforms and Safety Supplier | Logos International UAE',
    metaDescription:
      'PPE, safety footwear, gloves, masks, uniforms, hardware and printing supply support for Dubai businesses through Logos International.',
    keywords: 'Dubai PPE supplier, uniforms supplier Dubai, safety footwear Dubai, industrial supplies Dubai, printing services Dubai',
    proof: 'Dubai supply',
    focus: ['Specification-led quote requests', 'Safety and PPE categories', 'Industrial consumables', 'Branding and print'],
    categories: ['Clothing', 'Safety Footwear', 'Hand Protection', 'Building Materials & Hardware', 'Printing Services'],
    questions: [
      {
        question: 'Does Logos International support Dubai sourcing inquiries?',
        answer:
          'Yes. Logos International supports Dubai customers with PPE, safety, hardware, uniforms, printing and custom sourcing inquiries.',
      },
      {
        question: 'What should Dubai buyers include in a quote request?',
        answer:
          'Dubai buyers should include product name, quantity, specification, delivery location and required date.',
      },
    ],
  },
  {
    slug: 'abu-dhabi',
    title: 'Abu Dhabi industrial and safety supply inquiries.',
    eyebrow: 'Abu Dhabi coverage',
    description:
      'Supply inquiry support for Abu Dhabi companies buying PPE, industrial hardware, medical consumables, fall protection and uniform categories.',
    metaTitle: 'Abu Dhabi PPE and Industrial Supplier | Logos International',
    metaDescription:
      'Abu Dhabi PPE, safety, hardware, uniforms, medical consumables and industrial supply inquiries supported by Logos International.',
    keywords: 'Abu Dhabi PPE supplier, industrial supplies Abu Dhabi, safety supplier Abu Dhabi, uniforms Abu Dhabi, PPE UAE',
    proof: 'Capital projects',
    focus: ['Project supply inquiries', 'Safety and PPE categories', 'Hardware and site items', 'Medical consumables'],
    categories: ['Fall Protection', 'Head Protection', 'Medical Consumables', 'Building Materials & Hardware', 'Miscellaneous Products'],
    questions: [
      {
        question: 'Can Abu Dhabi companies request industrial supply items?',
        answer:
          'Yes. Logos International handles Abu Dhabi inquiries for hardware, safety categories, medical consumables and miscellaneous site products.',
      },
      {
        question: 'Are fall protection items available for Abu Dhabi inquiries?',
        answer:
          'Yes. Full body harnesses, lanyards, retractable fall arresters and cargo lashing belts are listed in the fall protection category.',
      },
    ],
  },
  {
    slug: 'ajman',
    title: 'Ajman PPE, uniforms and facility supply support.',
    eyebrow: 'Ajman coverage',
    description:
      'Ajman buyers can request PPE, workwear, safety footwear, masks, gloves, hygiene products, hardware and printing in one request.',
    metaTitle: 'Ajman PPE, Uniforms and Facility Supplier | Logos International UAE',
    metaDescription:
      'Ajman PPE, uniforms, safety footwear, gloves, masks, hygiene products, hardware and printing supply inquiries supported by Logos International.',
    keywords: 'Ajman PPE supplier, uniforms supplier Ajman, safety footwear Ajman, hygiene products Ajman, hardware supplier Ajman',
    proof: 'Ajman supply',
    focus: ['Local UAE inquiry support', 'PPE and uniform categories', 'Facility consumables', 'Print and signage'],
    categories: ['Clothing', 'Safety Footwear', 'Hand Protection', 'Medical Consumables', 'Miscellaneous Products'],
    questions: [
      {
        question: 'Does Logos International support Ajman PPE inquiries?',
        answer:
          'Yes. Ajman buyers can request PPE, uniforms, safety footwear, masks, gloves, hygiene items, hardware and printing categories through Logos International.',
      },
      {
        question: 'Can Ajman facilities request recurring consumables?',
        answer:
          'Yes. Facilities can send product names, quantities, specifications, delivery location and timeline for recurring or one-off supply review.',
      },
    ],
  },
  {
    slug: 'ras-al-khaimah',
    title: 'Ras Al Khaimah industrial, PPE and site supply inquiries.',
    eyebrow: 'Ras Al Khaimah coverage',
    description:
      'Ras Al Khaimah companies can review PPE, safety products, hardware, fall protection, helmets, wire ropes and custom industrial sourcing.',
    metaTitle: 'Ras Al Khaimah PPE and Industrial Supplier | Logos International UAE',
    metaDescription:
      'Ras Al Khaimah PPE, safety products, hardware, helmets, fall protection, wire ropes and custom industrial supply inquiries.',
    keywords: 'Ras Al Khaimah PPE supplier, RAK industrial supplies, safety supplier Ras Al Khaimah, wire ropes RAK, hardware supplier RAK',
    proof: 'Northern Emirates',
    focus: ['Industrial supply review', 'Safety and PPE products', 'Hardware and ropes', 'Project quote details'],
    categories: ['Head Protection', 'Fall Protection', 'Steel Wire Ropes', 'Building Materials & Hardware', 'Safety Footwear'],
    questions: [
      {
        question: 'Does Logos International handle Ras Al Khaimah industrial inquiries?',
        answer:
          'Yes. Ras Al Khaimah buyers can request PPE, safety footwear, helmets, fall protection, hardware, wire ropes and custom sourcing review.',
      },
      {
        question: 'Can RAK buyers request wire ropes or fall protection?',
        answer:
          'Yes. Kiswire steel wire ropes, harnesses, lanyards and retractable fall arresters are listed for quotation inquiries.',
      },
    ],
  },
  {
    slug: 'fujairah',
    title: 'Fujairah marine, PPE and industrial supply inquiries.',
    eyebrow: 'Fujairah coverage',
    description:
      'Fujairah-facing supply support for marine paints, Kiswire steel wire ropes, PPE, gloves, helmets, safety footwear and industrial consumables.',
    metaTitle: 'Fujairah Marine, PPE and Industrial Supplier | Logos International UAE',
    metaDescription:
      'Fujairah marine paints, Kiswire steel wire ropes, PPE, gloves, helmets, safety footwear and industrial supply inquiries.',
    keywords: 'Fujairah PPE supplier, marine paints Fujairah, wire ropes Fujairah, safety supplier Fujairah, industrial supplies Fujairah',
    proof: 'Marine corridor',
    focus: ['Marine paints', 'Wire ropes and rigging', 'PPE categories', 'Industrial consumables'],
    categories: ['Marine Paints', 'Steel Wire Ropes', 'Hand Protection', 'Head Protection', 'Safety Footwear'],
    questions: [
      {
        question: 'Can Fujairah buyers request marine paints?',
        answer:
          'Yes. Fujairah buyers can request marine paints and related industrial supply categories through Logos International.',
      },
      {
        question: 'Does Logos International support Fujairah PPE inquiries?',
        answer:
          'Yes. Fujairah inquiries can include PPE, gloves, helmets, safety footwear, wire ropes and custom industrial sourcing requirements.',
      },
    ],
  },
  {
    slug: 'saudi-arabia',
    title: 'Saudi Arabia sourcing for PPE and industrial categories.',
    eyebrow: 'GCC sourcing',
    description:
      'A GCC-facing inquiry route for Saudi Arabia buyers reviewing PPE, uniforms, safety requisites, hardware, wire ropes and custom products.',
    metaTitle: 'Saudi Arabia PPE and Industrial Sourcing | Logos International GCC',
    metaDescription:
      'Saudi Arabia sourcing inquiries for PPE, safety requisites, uniforms, hardware, marine paints, Kiswire steel wire ropes and custom supply.',
    keywords: 'Saudi Arabia PPE sourcing, GCC industrial supplier, Saudi safety supplier, Kiswire wire ropes Saudi Arabia, uniforms sourcing Saudi Arabia',
    proof: 'Saudi Arabia',
    focus: ['Cross-border inquiry review', 'Industrial and PPE categories', 'Wire ropes and marine paints', 'Custom sourcing'],
    categories: ['Steel Wire Ropes', 'Marine Paints', 'Safety Footwear', 'Respiratory Protection', 'Order Suppliers'],
    questions: [
      {
        question: 'Does Logos International support Saudi Arabia sourcing inquiries?',
        answer:
          'Yes. Logos International can review Saudi Arabia inquiries for listed catalog categories and custom sourcing requirements.',
      },
      {
        question: 'Can Saudi Arabia buyers ask for products not listed?',
        answer:
          'Yes. Buyers can use the order suppliers route and include product details, quantity, specification, delivery location and timeline.',
      },
    ],
  },
  {
    slug: 'qatar',
    title: 'Qatar PPE, uniforms and industrial supply sourcing.',
    eyebrow: 'Qatar inquiries',
    description:
      'Supply support for Qatar buyers requesting PPE, safety products, uniforms, printing, hardware and custom-order items.',
    metaTitle: 'Qatar PPE, Uniform and Industrial Sourcing | Logos International',
    metaDescription:
      'Qatar sourcing inquiries for PPE, safety requisites, uniforms, hardware, printing services and custom-order products.',
    keywords: 'Qatar PPE sourcing, Qatar uniforms supplier, GCC PPE supplier, industrial supplies Qatar, printing services Qatar sourcing',
    proof: 'Qatar supply',
    focus: ['PPE and uniform inquiries', 'Print and signage categories', 'Hardware supply review', 'GCC handoff'],
    categories: ['Clothing', 'Printing Services', 'Signages', 'Building Materials & Hardware', 'Miscellaneous Products'],
    questions: [
      {
        question: 'Can Qatar buyers request PPE and uniforms?',
        answer:
          'Yes. Qatar buyers can submit PPE, uniform, printing and hardware inquiries for review by Logos International.',
      },
      {
        question: 'Does Logos International list signage products for Qatar inquiries?',
        answer:
          'Yes. Industrial, safety and directional signages are included in the catalog for quotation inquiries.',
      },
    ],
  },
  {
    slug: 'oman',
    title: 'Oman industrial, PPE and marine supply inquiries.',
    eyebrow: 'Oman coverage',
    description:
      'Oman-facing supply support for marine paints, safety requisites, PPE, hardware, wire ropes, uniforms and custom-order items.',
    metaTitle: 'Oman PPE, Marine Paints and Industrial Sourcing | Logos International',
    metaDescription:
      'Oman sourcing inquiries for PPE, marine paints, Kiswire steel wire ropes, safety requisites, uniforms, hardware and custom products.',
    keywords: 'Oman PPE sourcing, marine paints Oman, wire ropes Oman, safety supplier Oman, GCC industrial sourcing',
    proof: 'Marine and site',
    focus: ['Marine paints', 'Steel wire ropes', 'PPE categories', 'Custom order sourcing'],
    categories: ['Marine Paints', 'Steel Wire Ropes', 'Head Protection', 'Hand Protection', 'Order Suppliers'],
    questions: [
      {
        question: 'Can Oman buyers request marine paints?',
        answer:
          'Yes. Marine paints are listed as a commercial and industrial supply category for inquiry review.',
      },
      {
        question: 'Are wire ropes available for Oman inquiries?',
        answer:
          'Yes. Kiswire steel wire ropes and related wire rope supply requirements are listed in the catalog.',
      },
    ],
  },
  {
    slug: 'bahrain',
    title: 'Bahrain PPE and commercial supply sourcing.',
    eyebrow: 'Bahrain inquiries',
    description:
      'Bahrain buyers can request PPE, safety, uniforms, printing, stationery, medical consumables and custom-order products.',
    metaTitle: 'Bahrain PPE and Commercial Supply Sourcing | Logos International',
    metaDescription:
      'Bahrain sourcing inquiries for PPE, safety requisites, uniforms, stationery, medical consumables, printing and custom-order products.',
    keywords: 'Bahrain PPE sourcing, Bahrain safety supplier, uniforms Bahrain sourcing, GCC commercial supply, medical consumables Bahrain',
    proof: 'Commercial supply',
    focus: ['PPE and safety categories', 'Stationery and consumables', 'Uniform and print', 'Custom orders'],
    categories: ['Stationeries', 'Medical Consumables', 'Clothing', 'Eye & Ear Protection', 'Printing Services'],
    questions: [
      {
        question: 'Does Logos International support Bahrain sourcing?',
        answer:
          'Yes. Bahrain buyers can submit listed catalog and custom sourcing inquiries to Logos International.',
      },
      {
        question: 'Can Bahrain customers source stationery and consumables?',
        answer:
          'Yes. Stationeries, medical consumables and miscellaneous products are listed for quotation inquiries.',
      },
    ],
  },
  {
    slug: 'kuwait',
    title: 'Kuwait PPE, safety and custom-order inquiries.',
    eyebrow: 'Kuwait coverage',
    description:
      'Kuwait-facing inquiry support for PPE, masks, gloves, safety footwear, helmets, hardware, printing and miscellaneous products.',
    metaTitle: 'Kuwait PPE, Safety and Custom Order Sourcing | Logos International',
    metaDescription:
      'Kuwait sourcing inquiries for PPE, safety footwear, gloves, masks, helmets, hardware, printing and miscellaneous products.',
    keywords: 'Kuwait PPE sourcing, Kuwait safety supplier, gloves Kuwait sourcing, N95 masks Kuwait, GCC commercial supply',
    proof: 'GCC inquiries',
    focus: ['Masks and hand protection', 'Safety footwear', 'Head protection', 'Miscellaneous products'],
    categories: ['Respiratory Protection', 'Hand Protection', 'Safety Footwear', 'Head Protection', 'Miscellaneous Products'],
    questions: [
      {
        question: 'Can Kuwait buyers request respiratory protection products?',
        answer:
          'Yes. Surgical masks, N95 masks, full face masks, half face masks and respiratory masks are included in the respiratory category.',
      },
      {
        question: 'Does Logos International handle Kuwait custom-order inquiries?',
        answer:
          'Yes. Kuwait buyers can submit catalog and custom order sourcing inquiries for review.',
      },
    ],
  },
];

const industryPages: EditorialPage[] = [
  {
    slug: 'construction',
    title: 'Construction site supply for PPE and hardware.',
    eyebrow: 'Construction',
    description:
      'PPE, safety footwear, head protection, fall protection, gloves, hardware and site consumables arranged around project requirements.',
    metaTitle: 'Construction PPE and Hardware Supplier UAE GCC | Logos International',
    metaDescription:
      'Construction site PPE, safety footwear, helmets, fall protection, gloves, hardware and consumables for UAE and GCC supply inquiries.',
    keywords: 'construction PPE supplier UAE, construction safety supplier, helmets UAE, fall protection UAE, site hardware supplier UAE',
    proof: 'Construction sites',
    focus: ['Head and fall protection', 'Safety footwear', 'Hardware and consumables', 'Bulk quote requests'],
    categories: ['Head Protection', 'Fall Protection', 'Safety Footwear', 'Hand Protection', 'Building Materials & Hardware'],
    questions: [
      {
        question: 'What can construction buyers request from Logos International?',
        answer:
          'Construction buyers can request PPE, helmets, fall protection, safety footwear, gloves, hardware and site consumables.',
      },
      {
        question: 'Can construction teams request bulk quantities?',
        answer:
          'Yes. Buyers should send product names, quantities, specifications, delivery location and timeline for review.',
      },
    ],
  },
  {
    slug: 'marine',
    title: 'Marine paints, wire ropes and safety supply.',
    eyebrow: 'Marine and industrial',
    description:
      'Marine-facing supply inquiries for marine paints, Kiswire steel wire ropes, PPE, gloves, helmets and miscellaneous site items.',
    metaTitle: 'Marine Paints, Wire Ropes and PPE Supplier UAE GCC | Logos International',
    metaDescription:
      'Marine paints, Kiswire steel wire ropes, PPE, hand protection, helmets and industrial supply inquiries for UAE and GCC buyers.',
    keywords: 'marine paints UAE, Kiswire steel wire ropes UAE, marine PPE supplier, industrial marine supplier GCC',
    proof: 'Marine categories',
    focus: ['Marine paints', 'Kiswire steel wire ropes', 'PPE and gloves', 'Industrial sourcing'],
    categories: ['Marine Paints', 'Steel Wire Ropes', 'Hand Protection', 'Head Protection', 'Miscellaneous Products'],
    questions: [
      {
        question: 'Does Logos International list marine paints?',
        answer:
          'Yes. Marine paints are included as a commercial and industrial supply category.',
      },
      {
        question: 'Are Kiswire steel wire ropes listed?',
        answer:
          'Yes. Kiswire steel wire ropes and related wire rope supply requirements are part of the catalog.',
      },
    ],
  },
  {
    slug: 'facilities',
    title: 'Facilities supply for safety, hygiene and operations.',
    eyebrow: 'Facilities',
    description:
      'Facilities teams can source PPE, medical consumables, cleaning accessories, garbage bags, first aid boxes, signage and stationery.',
    metaTitle: 'Facilities PPE, Hygiene and Operations Supplier UAE | Logos International',
    metaDescription:
      'Facilities supply inquiries for PPE, medical consumables, hygiene products, signage, stationery, cleaning accessories and operations items.',
    keywords: 'facilities supplier UAE, hygiene products supplier UAE, PPE facilities UAE, cleaning accessories UAE, first aid boxes UAE',
    proof: 'Facilities',
    focus: ['Hygiene and cleaning items', 'Medical consumables', 'Signage and stationery', 'PPE replenishment'],
    categories: ['Medical Consumables', 'Miscellaneous Products', 'Signages', 'Stationeries', 'Eye & Ear Protection'],
    questions: [
      {
        question: 'Can facilities teams request hygiene products?',
        answer:
          'Yes. The miscellaneous category includes hygiene products, cleaning accessories, garbage bags, first aid boxes and related items.',
      },
      {
        question: 'Does Logos International support facilities PPE replenishment?',
        answer:
          'Yes. Facilities buyers can request PPE, masks, gloves, eyewear, helmets and other safety requisites.',
      },
    ],
  },
  {
    slug: 'healthcare',
    title: 'Healthcare consumables and protection supply.',
    eyebrow: 'Healthcare support',
    description:
      'Healthcare and hygiene buyers can request medical consumables, masks, gloves, disposable coveralls, lab coats, shoe covers and hairnets.',
    metaTitle: 'Medical Consumables, Masks and Gloves Supplier UAE | Logos International',
    metaDescription:
      'Medical consumables, masks, gloves, disposable coveralls, lab coats, shoe covers, hairnets and hygiene product inquiries in UAE and GCC.',
    keywords: 'medical consumables UAE, N95 mask supplier UAE, gloves supplier UAE, lab coats UAE, hygiene products UAE',
    proof: 'Consumables',
    focus: ['Medical consumables', 'Masks and respiratory protection', 'Gloves and disposables', 'Lab coats and hygiene'],
    categories: ['Medical Consumables', 'Respiratory Protection', 'Hand Protection', 'Clothing', 'Miscellaneous Products'],
    questions: [
      {
        question: 'Does Logos International list medical consumables?',
        answer:
          'Yes. Medical consumables are listed for hygiene, workplace and facility requirements.',
      },
      {
        question: 'Can healthcare buyers request masks and gloves?',
        answer:
          'Yes. Respiratory protection and hand protection categories include masks, nitrile gloves, latex gloves and related items.',
      },
    ],
  },
  {
    slug: 'hospitality',
    title: 'Hospitality uniforms, print and operational supply.',
    eyebrow: 'Hospitality',
    description:
      'Hospitality teams can review uniforms, branded printing, signage, trophies, stationery, hygiene items and general operating supplies.',
    metaTitle: 'Hospitality Uniforms, Printing and Supply UAE | Logos International',
    metaDescription:
      'Hospitality uniforms, branded printing, signage, trophies, stationery, hygiene products and operational supply inquiries in UAE and GCC.',
    keywords: 'hospitality uniforms UAE, printing services UAE, signage supplier UAE, trophies UAE, hotel supplies UAE',
    proof: 'Hotels and venues',
    focus: ['Uniforms and embroidery', 'Signage and trophies', 'Stationery', 'Hygiene and operating items'],
    categories: ['Clothing', 'Printing Services', 'Signages', 'Shields and Trophies', 'Stationeries'],
    questions: [
      {
        question: 'Can hospitality teams request customized uniforms?',
        answer:
          'Yes. Logos International lists ready-made and customized clothing plus embroidery, DTF, sublimation and screen printing services.',
      },
      {
        question: 'Are trophies and signage available?',
        answer:
          'Yes. Shields, trophies and signages are included as catalog categories for inquiry review.',
      },
    ],
  },
  {
    slug: 'printing-branding',
    title: 'Printing, branding and recognition supply.',
    eyebrow: 'Printing and branding',
    description:
      'Branding support across DTF, embroidery, sublimation, screen printing, offset printing, signage, shields and trophies.',
    metaTitle: 'Printing, Branding, Signage and Trophies UAE | Logos International',
    metaDescription:
      'DTF, embroidery, sublimation, screen printing, offset printing, signage, shields and trophies for UAE and GCC inquiries.',
    keywords: 'DTF printing UAE, embroidery UAE, screen printing UAE, signage UAE, trophies UAE, branding supplier Sharjah',
    proof: 'Printing and branding',
    focus: ['DTF and embroidery', 'Sublimation and screen print', 'Offset printing', 'Signage and trophies'],
    categories: ['Printing Services', 'Signages', 'Shields and Trophies', 'Clothing', 'Stationeries'],
    questions: [
      {
        question: 'What printing services are listed?',
        answer:
          'The catalog includes DTF, embroidery, sublimation, screen printing, offset printing, signages, shields and trophies.',
      },
      {
        question: 'Can printing be paired with uniforms?',
        answer:
          'Yes. Buyers can request customized clothing with printing or embroidery requirements in one inquiry.',
      },
    ],
  },
];

const categoryDescriptions: Record<string, string> = {
  Clothing:
    'T-shirts, cargo pants, cotton coveralls, twill cotton uniforms, polycotton uniforms, high visibility reflective vests, disposable coveralls, fire retardant coveralls and lab coats.',
  'Safety Footwear': 'Non-metal safety shoes, metal safety shoes, welder boots, gumboots and executive safety shoes.',
  'Hand Protection': 'Dotted gloves, nitrile gloves, chemical resistant gloves, vinyl gloves, latex gloves, leather gloves and welding gloves.',
  'Respiratory Protection': 'Surgical masks, N95 masks, full face masks, half face masks and respiratory masks.',
  'Eye & Ear Protection': 'Face shields, safety goggles, safety spectacles, ear muffs and ear plugs.',
  'Head Protection': 'Metal helmets, fiber helmets and helmets with ratchet and chin strap.',
  'Fall Protection': 'Full body harnesses, lanyards, retractable fall arresters and cargo lashing belts.',
  'Building Materials & Hardware': 'Building materials and hardware products supplied for commercial procurement requirements.',
  'Printing Services': 'DTF, embroidery, sublimation, screen printing, offset printing, signages, shields and trophies.',
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

const buyerQuestions: BuyerQuestion[] = [
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
      'Yes. The catalog covers ready-made and customized clothing plus DTF, embroidery, sublimation, screen printing, offset printing, signages, shields and trophies.',
  },
  {
    question: 'How should a customer request a quotation?',
    answer:
      'Send the product name, quantity, specification, delivery location and required date so the team can confirm availability and quote details.',
  },
];

const pageMeta: Record<Page, { title: string; description: string; path: string; keywords: string }> = {
  home: {
    title: 'Logos International | PPE, Safety and Industrial Supplier in Sharjah UAE and GCC',
    description: 'Sharjah sourcing and supply company for PPE, safety requisites, medical consumables, hardware, uniforms, printing services and custom procurement across the UAE and GCC markets.',
    path: '/',
    keywords: 'Logos International, Sharjah PPE supplier, UAE safety supplier, GCC industrial supplies, Dubai PPE supplier, Abu Dhabi industrial supplies, Saudi Arabia sourcing, Qatar sourcing, Oman sourcing, Bahrain sourcing, Kuwait sourcing, UAE uniforms supplier, printing services Sharjah',
  },
  products: {
    title: 'PPE, Uniforms, Hardware and Safety Catalog | Logos International UAE GCC',
    description: 'Browse UAE and GCC supply categories including PPE, workwear, safety footwear, gloves, masks, helmets, fall protection, medical consumables, hardware, printing, marine paints and Kiswire wire ropes.',
    path: '/catalog',
    keywords: 'PPE catalog UAE, safety footwear UAE, safety gloves Sharjah, N95 mask UAE, industrial hardware UAE, uniforms supplier UAE, printing services Sharjah, Kiswire steel wire ropes UAE, marine paints UAE, GCC PPE supplier',
  },
  services: {
    title: 'Sourcing, Supply and Delivery Services | UAE and GCC | Logos International',
    description: 'Sourcing, supply and delivery support for PPE, safety requisites, medical consumables, hardware, uniforms, printing and custom-order products across Sharjah, UAE and GCC countries.',
    path: '/services',
    keywords: 'UAE sourcing services, GCC procurement support, PPE supply service, industrial supply delivery, Sharjah supply services, UAE sourcing supplier, Saudi Arabia sourcing, Qatar sourcing, Oman sourcing',
  },
  coverage: {
    title: 'UAE and GCC PPE, Safety and Industrial Supply Coverage | Logos International',
    description: 'Regional coverage pages for Sharjah, Dubai, Abu Dhabi, Saudi Arabia, Qatar, Oman, Bahrain and Kuwait PPE, safety, industrial and sourcing inquiries.',
    path: '/coverage',
    keywords: 'UAE PPE supplier, GCC safety supplier, Sharjah PPE, Dubai PPE supplier, Abu Dhabi industrial supplier, Saudi Arabia sourcing, Qatar sourcing, Oman sourcing, Bahrain sourcing, Kuwait sourcing',
  },
  industries: {
    title: 'Industry Supply Pages for Construction, Marine, Facilities and Healthcare | Logos International',
    description: 'Industry-focused supply pages for construction, marine, facilities, healthcare, hospitality, printing and branding procurement across UAE and GCC.',
    path: '/industries',
    keywords: 'construction PPE supplier UAE, marine paints UAE, facilities supplier UAE, medical consumables UAE, hospitality uniforms UAE, printing services UAE',
  },
  contact: {
    title: 'Contact Logos International | Sharjah UAE and GCC Supply Inquiries',
    description: 'Contact Logos International in Sharjah for PPE, safety requisites, medical consumables, hardware, uniforms, printing services, miscellaneous products and UAE or GCC sourcing requests.',
    path: '/contact',
    keywords: 'contact Logos International, Sharjah PPE supplier contact, UAE supply inquiry, GCC sourcing request, Logos International quote request, UAE industrial supplier contact',
  },
  privacy: {
    title: 'Privacy Policy | Logos International',
    description: 'Privacy practices for Logos International website inquiries and sourcing service requests.',
    path: '/privacy',
    keywords: 'Logos International privacy policy',
  },
  terms: {
    title: 'Terms of Service | Logos International',
    description: 'Terms for using Logos International website, catalog and sourcing inquiry services.',
    path: '/terms',
    keywords: 'Logos International terms of service',
  },
};

const pageEntries = Object.entries(pageMeta) as [Page, (typeof pageMeta)[Page]][];
const siteRouteChangeEvent = 'site-route-change';

const pathToPage = (pathname: string): Page => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  if (normalizedPath === pageMeta.products.path || normalizedPath.startsWith(`${pageMeta.products.path}/`)) {
    return 'products';
  }
  if (normalizedPath === pageMeta.coverage.path || normalizedPath.startsWith(`${pageMeta.coverage.path}/`)) {
    return 'coverage';
  }
  if (normalizedPath === pageMeta.industries.path || normalizedPath.startsWith(`${pageMeta.industries.path}/`)) {
    return 'industries';
  }
  const matchedEntry = pageEntries.find(([, meta]) => meta.path === normalizedPath);
  return matchedEntry?.[0] || 'home';
};

const pageUrl = (page: Page) => `${SITE_URL}${pageMeta[page].path === '/' ? '/' : pageMeta[page].path}`;

const productCategoryNames = () => Array.from(new Set(products.map((product) => product.category))).sort();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const productImagePath = (product: Product) =>
  productImagePaths[product.id] || `/catalog-images/${String(product.id).padStart(2, '0')}-${slugify(product.name)}.jpg`;
const productImageVariantPath = (product: Product, width: 480 | 960) =>
  productImagePath(product).replace(/\.[^./]+$/, `-${width}.webp`);
const productImageSrcSet = (product: Product) =>
  `${productImageVariantPath(product, 480)} 480w, ${productImageVariantPath(product, 960)} 960w`;
const productImageUrl = (product: Product) => `${SITE_URL}${productImagePath(product)}`;
const productImageAlt = (product: Product) =>
  productImageAlts[product.id] || `${product.name} - ${product.description || `${product.category} supplied by Logos International`}`;

const categoryPath = (category: string) => `${pageMeta.products.path}/${slugify(category)}`;
const coveragePath = (slug: string) => `${pageMeta.coverage.path}/${slug}`;
const industryPath = (slug: string) => `${pageMeta.industries.path}/${slug}`;

const categoryMeta = (category: string) => ({
  title: `${category} Supplier in UAE | Logos International`,
  description: `${categoryDescriptions[category] || `${category} products supplied by Logos International.`} Available through Logos International for Sharjah, UAE and GCC supply inquiries.`,
  path: categoryPath(category),
  keywords: `${category} UAE, ${category} Sharjah, Logos International ${category}, UAE PPE supplier, GCC industrial supplier`,
});

const currentRoutePath = () => window.location.pathname.replace(/\/+$/, '') || '/';

const categoryFromPath = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const prefix = `${pageMeta.products.path}/`;
  if (!normalizedPath.startsWith(prefix)) return '';

  const slug = normalizedPath.slice(prefix.length);
  const matchedCategory = productCategoryNames().find((category) => slugify(category) === slug);
  return matchedCategory || '';
};

const detailFromPath = (pathname: string, basePath: string, pages: EditorialPage[]) => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const prefix = `${basePath}/`;
  if (!normalizedPath.startsWith(prefix)) return null;

  const slug = normalizedPath.slice(prefix.length);
  return pages.find((page) => page.slug === slug) || null;
};

const activeEditorialPage = (page: Page, pathname = window.location.pathname) => {
  if (page === 'coverage') return detailFromPath(pathname, pageMeta.coverage.path, coveragePages);
  if (page === 'industries') return detailFromPath(pathname, pageMeta.industries.path, industryPages);
  return null;
};

const editorialMeta = (page: Page, detail: EditorialPage) => ({
  title: detail.metaTitle,
  description: detail.metaDescription,
  path: page === 'coverage' ? coveragePath(detail.slug) : industryPath(detail.slug),
  keywords: detail.keywords,
});

const baseBusinessSchema = () => ({
  '@type': ['Organization', 'LocalBusiness'],
  '@id': `${SITE_URL}/#organization`,
  name: 'Logos International',
  legalName: 'Logos International',
  url: `${SITE_URL}/`,
  logo: BRAND_LOGO,
  image: BRAND_IMAGE,
  email: CONTACT_EMAIL,
  description:
    'Sharjah, UAE sourcing and supply company for PPE, safety requisites, medical consumables, hardware, uniforms, printing services and custom procurement.',
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
  areaServed: [
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
    'Gulf Cooperation Council',
  ],
  knowsAbout: [
    'Personal Protective Equipment',
    'PPE supply',
    'Health and safety requisites',
    'Medical consumables',
    'Hardware',
    'Uniforms',
    'Printing services',
    'Marine paints',
    'Kiswire steel wire ropes',
    'Stationeries',
    'Miscellaneous products',
    ...productCategoryNames(),
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: CONTACT_EMAIL,
    contactType: 'sales',
    areaServed: ['AE', 'GCC'],
    availableLanguage: ['English', 'Arabic'],
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Logos International product categories',
    itemListElement: productGroups.map((group, index) => ({
      '@type': 'OfferCatalog',
      position: index + 1,
      name: group.name,
      description: group.items,
    })),
  },
});

const buildStructuredData = (page: Page, activeCategory = '', detail: EditorialPage | null = null) => {
  const meta = activeCategory ? categoryMeta(activeCategory) : detail ? editorialMeta(page, detail) : pageMeta[page];
  const currentUrl = activeCategory
    ? `${SITE_URL}${categoryPath(activeCategory)}`
    : detail
      ? `${SITE_URL}${meta.path}`
      : pageUrl(page);
  const structuredProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;
  const graph: Record<string, unknown>[] = [
    baseBusinessSchema(),
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'Logos International',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-AE',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/catalog?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': page === 'contact' ? 'ContactPage' : page === 'products' || page === 'coverage' || page === 'industries' ? 'CollectionPage' : 'WebPage',
      '@id': `${currentUrl}#webpage`,
      url: currentUrl,
      name: meta.title,
      description: meta.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      primaryImageOfPage: BRAND_IMAGE,
      inLanguage: 'en-AE',
    },
  ];

  if (page === 'products') {
    graph.push({
      '@type': 'ItemList',
      '@id': `${currentUrl}#product-list`,
      name: activeCategory ? `${activeCategory} products` : 'Logos International product catalog',
      description: meta.description,
      numberOfItems: structuredProducts.length,
      itemListElement: structuredProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: currentUrl,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.description || `${product.name} supplied through Logos International.`,
          image: productImageUrl(product),
          category: product.category,
          brand: { '@id': `${SITE_URL}/#organization` },
          additionalProperty: [
            { '@type': 'PropertyValue', name: 'Pricing', value: 'Quote on request' },
            { '@type': 'PropertyValue', name: 'Availability', value: 'Confirmed after inquiry' },
          ],
        },
      })),
    });
  }

  if (detail) {
    graph.push({
      '@type': 'Service',
      '@id': `${currentUrl}#regional-service`,
      name: detail.title,
      description: detail.description,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: page === 'coverage' ? detail.title.replace(/\.$/, '') : ['United Arab Emirates', 'Gulf Cooperation Council'],
      serviceType: detail.categories,
    });
  }

  if (activeCategory) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${currentUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Catalog',
          item: `${SITE_URL}/catalog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: activeCategory,
          item: currentUrl,
        },
      ],
    });
  }

  if (detail) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${currentUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page === 'coverage' ? 'Coverage' : 'Industries',
          item: `${SITE_URL}${pageMeta[page].path}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: detail.title.replace(/\.$/, ''),
          item: currentUrl,
        },
      ],
    });
  }

  if (page === 'services' || page === 'home') {
    graph.push({
      '@type': 'Service',
      '@id': `${SITE_URL}/services#sourcing-service`,
      name: 'Sourcing and supply services',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: ['United Arab Emirates', 'Gulf Cooperation Council'],
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

  if (page === 'home' || page === 'services' || page === 'products' || page === 'coverage' || page === 'industries') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${currentUrl}#answers`,
      mainEntity: [...buyerQuestions, ...(detail?.questions || [])].map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
};

const setMetaContent = (attribute: 'name' | 'property', key: string, content: string) => {
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

const setLinkHref = (rel: string, href: string, attributes: Record<string, string> = {}) => {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]${attributes.hreflang ? `[hreflang="${attributes.hreflang}"]` : ''}`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  Object.entries(attributes).forEach(([key, value]) => link.setAttribute(key, value));
  link.setAttribute('href', href);
};

const quoteLabel = 'Quote on request';
const quoteChecklist = ['Product or category', 'Quantity', 'Specification', 'Delivery location', 'Timeline'];

const cleanMailField = (value: FormDataEntryValue | string) =>
  String(value)
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 900);

const buildMailto = (subject: string, body: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(cleanMailField(subject))}&body=${encodeURIComponent(body.slice(0, 6000))}`;

const Logo = ({ onClick, light = false }: { onClick?: () => void; light?: boolean }) => (
  <button
    className="brand-lockup"
    onClick={onClick}
    type="button"
  >
    <span className={light ? 'brand-mark brand-mark-light' : 'brand-mark'}>
      <img src="/logo-official-512.png" alt="" aria-hidden="true" />
    </span>
    <span className="brand-text">
      <span className={light ? 'text-white' : 'text-[var(--ink)]'}>Logos International</span>
      <span className={light ? 'text-white/60' : 'text-[var(--muted)]'}>Industrial Supply, Sharjah</span>
    </span>
  </button>
);

const SectionIntro = ({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) => (
  <div className="section-intro">
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    {copy && <p>{copy}</p>}
  </div>
);

const AnswerCards = ({ items }: { items: BuyerQuestion[] }) => (
  <div className="answer-grid">
    {items.map((item) => (
      <article className="answer-card" key={item.question}>
        <h3>{item.question}</h3>
        <p>{item.answer}</p>
      </article>
    ))}
  </div>
);

const BuyerQuestions = () => (
  <section className="surface-section answer-section">
    <div className="container">
      <SectionIntro
        eyebrow="Before you request a quote"
        title="What buyers usually ask."
        copy="Availability, pricing and delivery are confirmed after the team reviews the specification."
      />
      <AnswerCards items={buyerQuestions} />
    </div>
  </section>
);

const AssuranceStrip = () => (
  <section className="assurance-strip" aria-label="Operating standards">
    <div className="container assurance-grid">
      {[
        ['Request', 'Clear requirement', 'Send the item, quantity, specification, delivery location and required date.'],
        ['Catalog', 'Catalog coverage', `${products.length} listed items across PPE, hardware, printing and custom orders.`],
        ['Region', 'Regional supply', 'Based in Sharjah with support for UAE and GCC delivery enquiries.'],
      ].map(([label, title, copy]) => (
        <div className="assurance-item" key={title}>
          <span>{label}</span>
          <strong>{title}</strong>
          <p>{copy}</p>
        </div>
      ))}
    </div>
  </section>
);

const SupplyDesk = () => (
  <div className="supply-desk" aria-label="Logos International supply desk overview">
    <div className="desk-header">
      <span>Logos International</span>
      <strong>Supply Desk</strong>
    </div>
    <div className="desk-board">
      {productGroups.slice(0, 6).map((group) => (
        <div className="desk-row" key={group.category}>
          <strong>{group.name}</strong>
          <em>{categoryCodes[group.category]}</em>
        </div>
      ))}
    </div>
    <div className="desk-footer">
      <span>{coverageAreas.length} service regions</span>
      <span>{products.length} catalog items</span>
    </div>
  </div>
);

const productById = (id: number) => products.find((product) => product.id === id);

const categoryRepresentativeProductIds: Record<string, number> = {
  Clothing: 4,
  'Safety Footwear': 9,
  'Hand Protection': 15,
  'Respiratory Protection': 22,
  'Eye & Ear Protection': 26,
  'Head Protection': 30,
  'Fall Protection': 33,
  'Building Materials & Hardware': 78,
  'Printing Services': 38,
  'Shields and Trophies': 43,
  Signages: 44,
  'Bird & Cat Food': 46,
  'Order Suppliers': 47,
  'Marine Paints': 48,
  'Steel Wire Ropes': 49,
  Stationeries: 50,
  'Medical Consumables': 76,
  'Miscellaneous Products': 51,
};

const productsForCategories = (categories: string[], limit = 4) => {
  const selected: Product[] = [];

  for (const category of categories) {
    const representativeId = categoryRepresentativeProductIds[category];
    const match = products.find((product) => product.id === representativeId)
      || products.find(
        (product) => product.category === category && !selected.some((selectedProduct) => selectedProduct.id === product.id),
      );
    if (match) selected.push(match);
    if (selected.length === limit) break;
  }

  for (const product of products) {
    if (selected.length === limit) break;
    if (!selected.some((selectedProduct) => selectedProduct.id === product.id)) selected.push(product);
  }

  return selected;
};

const ProductMosaic = ({
  items,
  variant = 'wide',
  label,
  priority = false,
}: {
  items: Product[];
  variant?: 'wide' | 'portrait';
  label: string;
  priority?: boolean;
}) => (
  <div className={`product-mosaic product-mosaic-${variant}`} role="group" aria-label={label}>
    {items.slice(0, 4).map((product, index) => (
      <figure key={product.id}>
        <img
          src={productImagePath(product)}
          srcSet={productImageSrcSet(product)}
          sizes={variant === 'portrait'
            ? (index === 0 ? '(max-width: 760px) 62vw, 520px' : '(max-width: 760px) 34vw, 260px')
            : (index === 0 ? '(max-width: 760px) 50vw, 620px' : '(max-width: 760px) 50vw, 360px')}
          alt={productImageAlts[product.id]}
          loading={priority && index === 0 ? 'eager' : 'lazy'}
          fetchPriority={priority && index === 0 ? 'high' : 'auto'}
        />
        <figcaption>
          <span>{categoryCodes[product.category] || 'LI'}</span>
          <strong>{product.name}</strong>
        </figcaption>
      </figure>
    ))}
  </div>
);

const homeFeatureProducts = [4, 30, 48, 76]
  .map(productById)
  .filter((product): product is Product => Boolean(product));

const coverageFeatureProducts = [9, 37, 49, 78]
  .map(productById)
  .filter((product): product is Product => Boolean(product));

const industryFeatureProducts = [4, 7, 48, 76]
  .map(productById)
  .filter((product): product is Product => Boolean(product));

const SignatureImage = () => (
  <div className="signature-image">
    <ProductMosaic
      items={homeFeatureProducts}
      variant="portrait"
      label="Featured Logos International workwear, safety, marine and medical supply products"
      priority
    />
  </div>
);

const EditorialBand = ({ onPageChange }: { onPageChange: (page: Page) => void }) => (
  <section className="editorial-band">
    <div className="container editorial-band-grid">
      <div>
        <p className="eyebrow">How enquiries start</p>
        <h2>Send the product details. We handle the follow-up.</h2>
      </div>
      <p>
        Include quantity, specification, delivery location and required date. We review availability, suitable alternatives
        and the delivery route before quoting.
      </p>
      <button type="button" className="btn btn-light" onClick={() => onPageChange('services')}>
        View supply process
        <ArrowRight size={16} />
      </button>
    </div>
  </section>
);

const Header = ({
  currentPage,
  onPageChange,
}: {
  currentPage: Page;
  onPageChange: (page: Page, target?: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const changePage = (page: Page) => {
    onPageChange(page);
    setIsOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="container nav-shell" aria-label="Primary navigation">
        <Logo onClick={() => changePage('home')} />
        <div className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => changePage(item.page)}
              className={currentPage === item.page ? 'nav-link active' : 'nav-link'}
              aria-current={currentPage === item.page ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
          <button type="button" className="btn btn-dark" onClick={() => changePage('contact')}>
            <Mail size={16} />
            Send requirement
          </button>
        </div>
        <button
          type="button"
          className="icon-button mobile-menu-button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {isOpen && (
          <div className="mobile-nav">
            {navItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => changePage(item.page)}
                className={currentPage === item.page ? 'nav-link active' : 'nav-link'}
                aria-current={currentPage === item.page ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
            <button type="button" className="btn btn-dark mobile-nav-cta" onClick={() => changePage('contact')}>
              <Mail size={16} />
              Send requirement
            </button>
          </div>
      )}
    </header>
  );
};

const Footer = ({ onPageChange }: { onPageChange: (page: Page, target?: string) => void }) => (
  <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-primary">
        <Logo light onClick={() => onPageChange('home')} />
        <p className="footer-copy">
          Sourcing and supply support for PPE, industrial materials, uniforms, printing and custom procurement across the UAE and GCC.
        </p>
        <a className="footer-email-link" href={buildMailto('Sourcing inquiry', 'Hello Logos International,\n\nI would like to discuss a sourcing requirement.')}>
          <Mail size={16} />
          {CONTACT_EMAIL}
        </a>
        <p className="footer-contact-detail">{CONTACT_PERSON} · {CONTACT_ROLE}<br />{CONTACT_PHONE}</p>
      </div>
      <div className="footer-links-group">
        <p className="footer-label">Explore</p>
        <button type="button" onClick={() => onPageChange('products')}>Catalog</button>
        <button type="button" onClick={() => onPageChange('services')}>Services</button>
        <button type="button" onClick={() => onPageChange('coverage')}>Coverage</button>
        <button type="button" onClick={() => onPageChange('industries')}>Industries</button>
        <button type="button" onClick={() => onPageChange('contact')}>Contact</button>
      </div>
      <div className="footer-coverage">
        <p className="footer-label">Supply desk</p>
        <p>{CONTACT_ADDRESS}</p>
        <div className="footer-regions" aria-label="Supply regions">
          {['Sharjah', 'Dubai', 'Abu Dhabi', 'UAE', 'GCC'].map((area) => <span key={area}>{area}</span>)}
        </div>
      </div>
      <div className="footer-cta-card">
        <p className="footer-label">Have a requirement?</p>
        <strong>Send the list. We will review the next step.</strong>
        <button type="button" className="btn btn-light" onClick={() => onPageChange('contact')}>
          Start an enquiry
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>Copyright 2026 Logos International. All rights reserved.</span>
      <span>
        <button type="button" onClick={() => onPageChange('privacy')}>Privacy</button>
        <button type="button" onClick={() => onPageChange('terms')}>Terms</button>
      </span>
    </div>
  </footer>
);

const HomePage = ({
  onPageChange,
  onCatalogCategory,
}: {
  onPageChange: (page: Page, target?: string) => void;
  onCatalogCategory: (category: string) => void;
}) => (
  <div>
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Based in Sharjah. Supplying UAE and GCC.</p>
          <h1>PPE, workwear and site supplies for UAE buyers.</h1>
          <p>
            Send the item, quantity, specification, delivery location and required date. Logos International checks the category,
            availability and supply options before quoting.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-dark" onClick={() => onPageChange('products')}>
              Browse catalog
              <ArrowRight size={16} />
            </button>
            <button type="button" className="btn btn-light" onClick={() => onPageChange('contact')}>
              Send requirement
              <Mail size={16} />
            </button>
          </div>
          <div className="hero-signal-grid" aria-label="Supply strengths">
            <div>
              <span>PPE</span>
              <strong>PPE and safety</strong>
              <p>Workwear, footwear, gloves, masks, eye, ear, head and fall protection.</p>
            </div>
            <div>
              <span>Industrial</span>
              <strong>Industrial supply</strong>
              <p>Hardware, marine paints, Kiswire steel wire ropes and site items.</p>
            </div>
            <div>
              <span>Custom</span>
              <strong>Custom orders</strong>
              <p>Medical consumables, stationery, pet food, printing and items outside the catalog.</p>
            </div>
          </div>
        </div>
        <div className="hero-gallery">
          <SignatureImage />
          <SupplyDesk />
        </div>
      </div>
    </section>

    <AssuranceStrip />
    <EditorialBand onPageChange={onPageChange} />

    <section className="surface-section">
      <div className="container">
        <SectionIntro
          eyebrow="18 product categories"
          title="Start with the product family."
          copy="Each card opens the catalog with the relevant filter applied. If the item is not listed, send it as a custom order request."
        />
        <div className="category-grid">
          {productGroups.map((group) => {
            return (
              <button
                type="button"
                className="category-card"
                key={group.name}
                onClick={() => onCatalogCategory(group.category)}
              >
                <span className="category-code" aria-hidden="true">{categoryCodes[group.category]}</span>
                <h3>{group.name}</h3>
                <p>{group.items}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>

    <BuyerQuestions />

    <section className="surface-section image-led-section">
      <div className="container">
        <ProductMosaic
          items={coverageFeatureProducts}
          label="Representative workwear, hardware, marine and site products supplied across the UAE and GCC"
        />
        <div className="section-intro split-intro">
          <div>
            <p className="eyebrow">Service areas</p>
            <h2>Built for UAE coverage and GCC reach.</h2>
          </div>
          <div className="coverage-list">
            {coverageAreas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="container cta-band">
      <div>
        <p className="eyebrow">Have a product list?</p>
        <h2>Send the list, quantities and delivery location.</h2>
      </div>
      <button type="button" className="btn btn-dark" onClick={() => onPageChange('contact')}>
        Send product list
        <ArrowRight size={16} />
      </button>
    </section>
  </div>
);

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(window.location.search).get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(
    () => new URLSearchParams(window.location.search).get('category') || categoryFromPath(window.location.pathname),
  );
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), []);
  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ['name', 'category', 'description'],
        threshold: 0.3,
      }),
    [],
  );

  const visibleProducts = useMemo(() => {
    const source = searchTerm.trim() ? fuse.search(searchTerm).map((result) => result.item) : products;
    const filtered = categoryFilter ? source.filter((product) => product.category === categoryFilter) : source;

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });
  }, [categoryFilter, fuse, searchTerm, sortBy]);

  const selectedProductList = products.filter((product) => selectedProducts.includes(product.id));
  const activeCategoryMeta = categoryFilter ? categoryMeta(categoryFilter) : null;
  const catalogTitle = activeCategoryMeta
    ? `${categoryFilter} supply in UAE.`
    : 'PPE, safety, hardware and sourced products.';
  const catalogCopy = activeCategoryMeta
    ? `${categoryDescriptions[categoryFilter]} Send quantity, specification, delivery location and required date for quotation review.`
    : 'Search Logos International products, filter by category and collect items into one quote request for UAE or GCC supply.';
  const catalogCount = categoryFilter || searchTerm.trim() ? visibleProducts.length : products.length;
  const catalogCountLabel = searchTerm.trim()
    ? 'matching results'
    : categoryFilter
      ? `${categoryFilter.toLowerCase()} listed`
      : 'products listed';
  const hasActiveFilters = Boolean(searchTerm.trim() || categoryFilter);

  useEffect(() => {
    const syncFiltersFromLocation = () => {
      if (!window.location.pathname.startsWith(pageMeta.products.path)) return;

      const params = new URLSearchParams(window.location.search);
      setSearchTerm(params.get('search') || '');
      setCategoryFilter(params.get('category') || categoryFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', syncFiltersFromLocation);
    window.addEventListener('catalog-route-change', syncFiltersFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFiltersFromLocation);
      window.removeEventListener('catalog-route-change', syncFiltersFromLocation);
    };
  }, []);

  useEffect(() => {
    if (!window.location.pathname.startsWith(pageMeta.products.path)) return;

    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (categoryFilter && searchTerm.trim()) params.set('category', categoryFilter);

    const query = params.toString();
    const basePath = categoryFilter && !searchTerm.trim() ? categoryPath(categoryFilter) : pageMeta.products.path;
    const nextUrl = `${basePath}${query ? `?${query}` : ''}`;
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState({ page: 'products' }, '', nextUrl);
      window.dispatchEvent(new Event(siteRouteChangeEvent));
    }
  }, [categoryFilter, searchTerm]);

  const toggleProduct = (id: number) => {
    setSelectedProducts((current) =>
      current.includes(id) ? current.filter((productId) => productId !== id) : [...current, id],
    );
  };

  const quoteRequestHref = () => {
    const body = selectedProductList
      .map((product) => `- ${product.name} (${product.category})`)
      .join('\n');

    return buildMailto(
      `Quote request for ${selectedProductList.length} item${selectedProductList.length === 1 ? '' : 's'}`,
      `Hello Logos International,\n\nPlease share pricing and availability for:\n\n${body}\n\nCompany:\nDelivery location:\nTimeline:\n\nThank you.`,
    );
  };

  return (
    <div>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Catalog</p>
            <h1>{catalogTitle}</h1>
            <p>{catalogCopy}</p>
          </div>
          <div className="catalog-summary">
            <span>{catalogCount}</span>
            <span>{catalogCountLabel}</span>
          </div>
        </div>
      </section>

      <section className="container catalog-section">
        <div className="catalog-controls" aria-label="Catalog filters">
          <label className="search-field">
            <Search size={18} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search PPE, uniforms, masks, wire ropes..."
              type="search"
            />
          </label>
          <label className="select-field">
            <span>Category</span>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </label>
          <label className="select-field">
            <span>Sort</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
            <ChevronDown size={16} />
          </label>
        </div>

        <div className="result-line">
          <span>{visibleProducts.length} {visibleProducts.length === 1 ? 'result' : 'results'}</span>
          {hasActiveFilters && (
            <button
              type="button"
              className="inline-reset"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
            >
              Clear filters
            </button>
          )}
          {selectedProducts.length > 0 && (
            <a className="btn btn-dark" href={quoteRequestHref()}>
              Send quote request ({selectedProducts.length})
              <Mail size={16} />
            </a>
          )}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => {
              const selected = selectedProducts.includes(product.id);

              return (
                <article
                  className={selected ? 'product-card selected' : 'product-card'}
                  key={product.id}
                >
                  <button
                    type="button"
                    className="product-visual"
                    onClick={() => setActiveProduct(product)}
                    aria-label={`View ${product.name} details`}
                  >
                    <img
                      src={productImagePath(product)}
                      srcSet={productImageSrcSet(product)}
                      sizes="(max-width: 760px) calc(100vw - 30px), (max-width: 1040px) 33vw, 300px"
                      alt={productImageAlt(product)}
                      loading="lazy"
                    />
                    <span className="product-code-badge">{String(product.id).padStart(2, '0')}</span>
                  </button>
                  <div className="product-body">
                    <div className="product-kicker">
                      <span className="product-kicker-code" aria-hidden="true">{categoryCodes[product.category] || 'LI'}</span>
                      <span>{product.category}</span>
                    </div>
                    <h2>{product.name}</h2>
                    <p>{product.description || 'Verified supply item available through Logos International.'}</p>
                  <div className="product-actions">
                      <span>{quoteLabel}</span>
                      <div>
                        <button type="button" onClick={() => setActiveProduct(product)}>
                          Details
                        </button>
                        <button type="button" className="quote-toggle" onClick={() => toggleProduct(product.id)}>
                          {selected ? 'Selected' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-code" aria-hidden="true">00</span>
            <h2>No products found</h2>
            <p>Clear the search or choose another category.</p>
          </div>
        )}
      </section>

      <BuyerQuestions />

      <ProductModal
        product={activeProduct}
        isSelected={activeProduct ? selectedProducts.includes(activeProduct.id) : false}
        onClose={() => setActiveProduct(null)}
        onToggle={(product) => toggleProduct(product.id)}
      />
    </div>
  );
};

const ProductModal = ({
  product,
  isSelected,
  onClose,
  onToggle,
}: {
  product: Product | null;
  isSelected: boolean;
  onClose: () => void;
  onToggle: (product: Product) => void;
}) => {
  useEffect(() => {
    if (!product) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, product]);

  if (!product) return null;

  const titleId = `product-modal-title-${product.id}`;

  return (
    <div className="modal-shell">
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Dismiss product overlay" />
      <article
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close product details" autoFocus>
          <X size={20} />
        </button>
        <div className="modal-product-image">
          <img
            src={productImagePath(product)}
            srcSet={productImageSrcSet(product)}
            sizes="(max-width: 760px) calc(100vw - 40px), 480px"
            alt={productImageAlt(product)}
          />
          <span>{categoryCodes[product.category] || 'LI'}</span>
        </div>
        <div className="modal-content">
          <p className="eyebrow">{product.category}</p>
          <h2 id={titleId}>{product.name}</h2>
          <p>{product.fullDescription || product.description || 'Available for quote through Logos International.'}</p>
          <p className="representative-note">Representative catalog image. Final brand, model and specification are confirmed with the quotation.</p>
          {product.specifications && (
            <div className="spec-grid">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key}>
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          )}
          <div className="modal-actions">
            <span>{quoteLabel}</span>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => {
                onToggle(product);
                onClose();
              }}
            >
              {isSelected ? 'Remove from quote' : 'Add to quote'}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

const ServicesPage = ({ onPageChange }: { onPageChange: (page: Page, target?: string) => void }) => (
  <div>
    <section className="page-hero">
      <div className="container page-hero-grid">
        <div>
          <p className="eyebrow">Services</p>
          <h1>From requirement to delivery.</h1>
          <p>
            Logos International reviews the product details, confirms available options and coordinates the agreed delivery route.
          </p>
        </div>
        <div className="service-proof" aria-label="Service flow">
          {services.map((service, index) => (
            <span key={service.title}>
              <strong>{String(index + 1).padStart(2, '0')}</strong>
              {service.title}
            </span>
          ))}
        </div>
      </div>
    </section>

    <section className="container services-grid">
      {services.map((service, index) => {
        return (
          <article className="service-card" key={service.title}>
            <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <ul>
              {service.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        );
      })}
    </section>

    <section className="container requirement-section">
      <div>
        <p className="eyebrow">Request details</p>
        <h2>Include these five details.</h2>
        <p>
          A complete request lets the team check the right product, availability and delivery requirements before replying.
        </p>
      </div>
        <div className="quote-checklist">
          {quoteChecklist.map((item) => (
            <span key={item}>
              <Check size={15} aria-hidden="true" />
              {item}
            </span>
        ))}
      </div>
    </section>

    <BuyerQuestions />

    <section className="container cta-band">
      <div>
        <p className="eyebrow">Product request</p>
        <h2>Need an item that is not listed?</h2>
      </div>
      <button type="button" className="btn btn-dark" onClick={() => onPageChange('contact')}>
        Send requirement
        <ArrowRight size={16} />
      </button>
    </section>
  </div>
);

const EditorialProofPanel = ({ page }: { page: EditorialPage }) => (
  <div className="editorial-proof-panel">
    <span>{page.proof}</span>
    <strong>{page.focus.length} relevant areas</strong>
    <div>
      {page.focus.map((item) => (
        <em key={item}>
          {item}
        </em>
      ))}
    </div>
  </div>
);

const PageTile = ({
  page,
  onOpen,
}: {
  page: EditorialPage;
  onOpen: () => void;
  key?: React.Key;
}) => (
  <article className="editorial-tile">
    <button type="button" onClick={onOpen}>
      <span>{page.eyebrow}</span>
      <strong>{page.title}</strong>
      <p>{page.description}</p>
      <em>
        View details
        <ArrowRight size={15} />
      </em>
    </button>
  </article>
);

const EditorialDetailPage = ({
  page,
  kind,
  onPageChange,
  onCatalogCategory,
}: {
  page: EditorialPage;
  kind: 'coverage' | 'industries';
  onPageChange: (page: Page, target?: string) => void;
  onCatalogCategory: (category: string) => void;
}) => (
  <div>
    <section className="page-hero editorial-detail-hero">
      <div className="container page-hero-grid">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-dark" onClick={() => onPageChange('contact')}>
              Send requirement
              <Mail size={16} />
            </button>
            <button type="button" className="btn btn-light" onClick={() => onPageChange(kind === 'coverage' ? 'coverage' : 'industries')}>
              View all {kind}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <EditorialProofPanel page={page} />
      </div>
    </section>

    <section className="surface-section">
        <div className="container editorial-feature-grid">
        <ProductMosaic
          items={productsForCategories(page.categories)}
          variant="portrait"
          label={`Representative products for ${page.title}`}
        />
        <div className="editorial-copy-stack">
          <p className="eyebrow">Request details</p>
          <h2>Include the specification, quantity, location and required date.</h2>
          <p>
            Use the linked categories below, then send the product name, quantity, specification, delivery location and required date.
            The team will confirm availability and any suitable alternatives.
          </p>
          <div className="coverage-list">
            {page.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="container linked-category-section">
      <SectionIntro
        eyebrow="Related products"
        title="Catalog categories for this requirement."
        copy="Select a category to open the catalog with the filter already applied."
      />
      <div className="linked-category-grid">
        {page.categories.map((category) => {
          return (
            <button type="button" className="category-card" key={category} onClick={() => onCatalogCategory(category)}>
              <span className="category-code" aria-hidden="true">{categoryCodes[category] || 'LI'}</span>
              <h3>{category}</h3>
              <p>{categoryDescriptions[category] || `${category} supplied by Logos International.`}</p>
            </button>
          );
        })}
      </div>
    </section>

    <section className="surface-section answer-section">
      <div className="container">
        <SectionIntro
          eyebrow="Common questions"
          title="Before you send the request."
        />
        <AnswerCards items={[...page.questions, ...buyerQuestions.slice(0, 2)]} />
      </div>
    </section>

    <section className="container cta-band">
      <div>
        <p className="eyebrow">Request a quote</p>
        <h2>Send the item, quantity, specification, location and required date.</h2>
      </div>
      <button type="button" className="btn btn-dark" onClick={() => onPageChange('contact')}>
        Send requirement
        <ArrowRight size={16} />
      </button>
    </section>
  </div>
);

const EditorialHubPage = ({
  kind,
  pages,
  onPageChange,
  onCatalogCategory,
}: {
  kind: 'coverage' | 'industries';
  pages: EditorialPage[];
  onPageChange: (page: Page, target?: string) => void;
  onCatalogCategory: (category: string) => void;
}) => {
  const currentDetail = activeEditorialPage(kind === 'coverage' ? 'coverage' : 'industries');

  if (currentDetail) {
    return (
      <EditorialDetailPage
        page={currentDetail}
        kind={kind}
        onPageChange={onPageChange}
        onCatalogCategory={onCatalogCategory}
      />
    );
  }

  const pageType = kind === 'coverage' ? 'coverage' : 'industries';
  const title =
    kind === 'coverage'
      ? 'Supply enquiries across the UAE and GCC.'
      : 'Product categories by industry.';
  const copy =
    kind === 'coverage'
      ? 'Choose a location to see the product categories most often requested there and the details to include in a quote request.'
      : 'Choose an industry to see the relevant product categories for construction, marine, facilities, healthcare, hospitality, printing and branding.';

  return (
    <div>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">{kind === 'coverage' ? 'Coverage' : 'Industries'}</p>
            <h1>{title}</h1>
            <p>{copy}</p>
          </div>
          <div className="catalog-summary">
            <span>{pages.length}</span>
            <span>{kind === 'coverage' ? 'regional pages' : 'industry pages'}</span>
          </div>
        </div>
      </section>

      <section className="surface-section image-led-section">
        <div className="container">
          <ProductMosaic
            items={kind === 'coverage' ? coverageFeatureProducts : industryFeatureProducts}
            label={kind === 'coverage'
              ? 'Representative product categories supplied across the UAE and GCC'
              : 'Representative workwear, safety, marine and medical industry products'}
          />
          <div className="section-intro split-intro">
            <div>
              <p className="eyebrow">How these pages help</p>
              <h2>The relevant categories in one place.</h2>
            </div>
            <p>
              Each page links directly to matching catalog filters and lists the information needed for a quote.
            </p>
          </div>
        </div>
      </section>

      <section className="container editorial-list-section">
        <div className="editorial-list-grid">
          {pages.map((page) => (
            <PageTile
              key={page.slug}
              page={page}
              onOpen={() => onPageChange(pageType, kind === 'coverage' ? coveragePath(page.slug) : industryPath(page.slug))}
            />
          ))}
        </div>
      </section>

      <section className="container cta-band">
        <div>
          <p className="eyebrow">Start with the catalog</p>
          <h2>Choose a product category first.</h2>
        </div>
        <button type="button" className="btn btn-dark" onClick={() => onCatalogCategory(kind === 'coverage' ? 'Safety Footwear' : 'Building Materials & Hardware')}>
          View matching products
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
};

const ContactPage = () => {
  return (
    <div>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Contact</p>
            <h1>Send a product requirement.</h1>
            <p>
              Include the product name, quantity, specification, delivery location and required date. The team will review availability and reply by email.
            </p>
          </div>
          <div className="contact-panel">
            <a href={buildMailto('Sourcing inquiry', 'Hello Logos International,\n\nI would like to discuss a sourcing requirement.')}>
              <Mail size={18} />
              {CONTACT_EMAIL}
            </a>
            <span>
              <MapPin size={18} />
              {CONTACT_ADDRESS}
            </span>
            <span><Mail size={18} />{CONTACT_PERSON} · {CONTACT_ROLE}</span>
            <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}><Globe2 size={18} />{CONTACT_PHONE}</a>
            <span>
              <Globe2 size={18} />
              UAE and GCC inquiries
            </span>
          </div>
        </div>
      </section>

      <section className="container contact-grid contact-direct-grid">
        <div className="direct-contact-card">
          <p className="eyebrow">Direct enquiry</p>
          <h2>Send your requirement to the supply desk.</h2>
          <p>Include the product, quantity, specification, delivery location and required date in your email. Simon Philip will review the request and reply directly.</p>
          <div className="direct-contact-actions">
            <a className="btn btn-dark" href={buildMailto('Sourcing inquiry', 'Hello Logos International,\n\nI would like to discuss a sourcing requirement.\n\nProduct / quantity:\nSpecification:\nDelivery location:\nRequired date:')}>
              Email the supply desk <Mail size={16} />
            </a>
            <a className="btn btn-light" href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>
              Call {CONTACT_PHONE} <Globe2 size={16} />
            </a>
          </div>
          <div className="direct-contact-person"><strong>{CONTACT_PERSON}</strong><span>{CONTACT_ROLE}</span><span>{CONTACT_EMAIL}</span></div>
        </div>
        <div className="map-panel">
          <div>
            <Globe2 size={26} />
            <h2>Supply coverage</h2>
            <p>Based in Sharjah. Enquiries are accepted for UAE and GCC delivery requirements.</p>
          </div>
          <div className="quote-checklist compact">
            {quoteChecklist.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="coverage-list compact">
            {coverageAreas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const PrivacyPage = () => (
  <section className="container legal-page">
    <p className="eyebrow">Privacy</p>
    <h1>Privacy Policy</h1>
    <p>Last updated: July 31, 2026</p>
    <p>
      Logos International uses information submitted through the website to respond to inquiries, prepare quotes and support sourcing services.
    </p>
    <h2>Information we collect</h2>
    <p>We may collect your name, company, email address, requirement details and related business inquiry information.</p>
    <h2>How we use information</h2>
    <p>Information is used to answer requests, coordinate sourcing and maintain necessary business communication.</p>
    <h2>Contact</h2>
    <p>For privacy questions, email {CONTACT_EMAIL}.</p>
  </section>
);

const TermsPage = () => (
  <section className="container legal-page">
    <p className="eyebrow">Terms</p>
    <h1>Terms of Service</h1>
    <p>Last updated: July 31, 2026</p>
    <p>
      Website content is provided for product sourcing and inquiry purposes. Product availability, pricing and delivery details are confirmed after review.
    </p>
    <h2>Catalog information</h2>
    <p>Catalog items are representative of supply categories and may require final confirmation before quotation or purchase.</p>
    <h2>Inquiries</h2>
    <p>Submitting an inquiry does not create a binding order until both parties confirm commercial terms.</p>
    <h2>Contact</h2>
    <p>Questions about these terms can be sent to {CONTACT_EMAIL}.</p>
  </section>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => pathToPage(window.location.pathname));
  const [routePath, setRoutePath] = useState(() => currentRoutePath());

  const navigateToPage = (page: Page, target?: string) => {
    setCurrentPage(page);

    const nextPath = page === 'products' && target
      ? categoryPath(target)
      : (page === 'coverage' || page === 'industries') && target
        ? target
        : pageMeta[page].path;
    if (window.location.pathname !== nextPath || window.location.search) {
      window.history.pushState({ page }, '', nextPath);
      window.dispatchEvent(new Event('catalog-route-change'));
    }
    setRoutePath(currentRoutePath());
    window.dispatchEvent(new Event(siteRouteChangeEvent));
  };

  const navigateToCatalogCategory = (category: string) => navigateToPage('products', category);

  useEffect(() => {
    if (
      window.location.pathname.includes('__responsive-pages') ||
      window.location.pathname.includes('__scroll-check') ||
      window.location.pathname.includes('__flow-check')
    ) {
      window.history.replaceState(null, '', '/');
      setCurrentPage('home');
    }

    const syncRouteState = () => {
      setCurrentPage(pathToPage(window.location.pathname));
      setRoutePath(currentRoutePath());
    };

    const handlePopState = () => syncRouteState();
    window.addEventListener('popstate', handlePopState);
    window.addEventListener(siteRouteChangeEvent, syncRouteState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(siteRouteChangeEvent, syncRouteState);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const activeCategory = currentPage === 'products' ? categoryFromPath(window.location.pathname) : '';
    const activeDetail = activeEditorialPage(currentPage);
    const meta = activeCategory ? categoryMeta(activeCategory) : activeDetail ? editorialMeta(currentPage, activeDetail) : pageMeta[currentPage];
    const canonicalUrl = activeCategory
      ? `${SITE_URL}${categoryPath(activeCategory)}`
      : activeDetail
        ? `${SITE_URL}${meta.path}`
        : pageUrl(currentPage);

    document.title = meta.title;
    setMetaContent('name', 'description', meta.description);
    setMetaContent('name', 'robots', 'index, follow, max-image-preview:large');
    setMetaContent('property', 'og:url', canonicalUrl);
    setMetaContent('property', 'og:title', meta.title);
    setMetaContent('property', 'og:description', meta.description);
    setMetaContent('property', 'og:image', BRAND_IMAGE);
    setMetaContent('property', 'og:image:alt', 'Logos International Sharjah sourcing and supply company');
    setMetaContent('name', 'twitter:title', meta.title);
    setMetaContent('name', 'twitter:description', meta.description);
    setMetaContent('name', 'twitter:image', BRAND_IMAGE);
    setLinkHref('canonical', canonicalUrl);
    setLinkHref('alternate', canonicalUrl, { hreflang: 'en-AE' });
    setLinkHref('alternate', canonicalUrl, { hreflang: 'x-default' });

    let structuredData = document.getElementById('page-structured-data');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.id = 'page-structured-data';
      structuredData.setAttribute('type', 'application/ld+json');
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(buildStructuredData(currentPage, activeCategory, activeDetail));
  }, [currentPage, routePath]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header currentPage={currentPage} onPageChange={navigateToPage} />
      <main id="main-content" tabIndex={-1}>
        {currentPage === 'home' && <HomePage onPageChange={navigateToPage} onCatalogCategory={navigateToCatalogCategory} />}
        {currentPage === 'products' && <ProductsPage />}
        {currentPage === 'services' && <ServicesPage onPageChange={navigateToPage} />}
        {currentPage === 'coverage' && <EditorialHubPage kind="coverage" pages={coveragePages} onPageChange={navigateToPage} onCatalogCategory={navigateToCatalogCategory} />}
        {currentPage === 'industries' && <EditorialHubPage kind="industries" pages={industryPages} onPageChange={navigateToPage} onCatalogCategory={navigateToCatalogCategory} />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'privacy' && <PrivacyPage />}
        {currentPage === 'terms' && <TermsPage />}
      </main>
      <Footer onPageChange={navigateToPage} />
    </div>
  );
}
