import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const outputDir = path.resolve('public/catalog-images');
const manifestPath = path.join(outputDir, 'manifest.json');
const attributionPath = path.join(outputDir, 'attribution.json');
const productImagesTsPath = path.resolve('src/data/productImages.ts');
const sourceOverrideRevision = '2026-08-01-product-photo-audit-v26';
const refreshImageSelection = new Set([
  'Twill Cotton 2pc Uniform',
  'Ear Muff',
  'Safety Goggles',
  'Safety Barrier',
  'Custom Order Sourcing',
  'Bird Feed & Accessories',
  'Bio-degradable Garbage Bags',
  'Chemical Resistant Gloves',
  'Vinyl Gloves',
  'Custom Shield & Trophy',
]);

const userAgent = 'LogosInternationalImageBuilder/1.0 (https://logosae.com)';
const allowedMimes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/jpg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);
const allowedOpenverseLicenses = new Set(['cc0', 'pdm', 'by', 'by-sa']);

const productQueries = {
  'Custom T-Shirt': ['custom t-shirt product', 'blank t shirt product', 'printed t-shirt'],
  'Industrial Cargo Pants': ['work cargo pants', 'industrial cargo pants workwear', 'work trousers cargo pockets'],
  'Cotton Coverall': ['industrial coverall workwear', 'cotton coverall', 'work coveralls'],
  'Twill Cotton 2pc Uniform': ['work uniform shirt pants', 'industrial uniform set', 'workwear uniform shirt trousers'],
  'High Visibility Reflective Vest': ['high visibility reflective vest', 'safety vest reflective', 'hi vis vest'],
  'Disposable Coverall': ['disposable coverall PPE', 'disposable protective suit', 'protective coverall suit'],
  'Fire Retardant Coverall': ['fire retardant coverall', 'flame resistant coverall', 'FR coverall workwear'],
  'Lab Coat': ['white lab coat', 'laboratory coat', 'medical lab coat'],
  'Non-Metal Safety Shoes': ['composite toe safety shoes', 'safety shoes composite toe', 'S3 safety footwear'],
  'Metal Safety Shoes': ['steel toe safety shoes', 'safety footwear steel toe', 'S3 safety footwear'],
  'Welder Boot': ['welding safety boots', 'welder boots', 'heat resistant safety boots'],
  Gumboot: ['PVC gumboots', 'rubber safety boots', 'waterproof work boots'],
  'Executive Safety Shoes': ['executive safety shoes', 'formal safety shoes', 'leather safety shoes'],
  'Dotted Gloves': ['dotted work gloves', 'cotton dotted gloves', 'grip work gloves'],
  'Nitrile Gloves': ['nitrile gloves', 'blue nitrile gloves', 'disposable nitrile gloves'],
  'Chemical Resistant Gloves': ['chemical resistant gloves', 'PVC chemical gloves', 'acid resistant gloves'],
  'Vinyl Gloves': ['vinyl gloves', 'disposable vinyl gloves', 'clear disposable gloves'],
  'Latex Gloves': ['latex gloves', 'disposable latex gloves', 'medical latex gloves'],
  'Leather Gloves': ['leather work gloves', 'industrial leather gloves', 'work gloves leather'],
  'Welding Gloves': ['welding gloves', 'leather welding gloves', 'heat resistant welding gloves'],
  'Surgical Masks': ['surgical masks', 'disposable surgical mask', 'medical face masks'],
  'N95 Mask': ['N95 mask', 'N95 respirator', 'particulate respirator mask'],
  'Full Face Mask': ['full face respirator', 'full face mask respirator', 'gas mask full face'],
  'Half Face Mask': ['half face respirator', 'half mask respirator', 'twin filter respirator'],
  'Respiratory Mask': ['respiratory mask', 'dust respirator mask', 'workplace respiratory protection'],
  'Face Shield': ['face shield PPE', 'protective face shield', 'splash face shield'],
  'Safety Goggles': ['safety goggles PPE', 'protective goggles', 'chemical safety goggles'],
  'Safety Spectacles': ['safety glasses', 'safety spectacles PPE', 'protective eyewear'],
  'Ear Muff': ['ear muffs hearing protection', 'ear defenders', 'hearing protection earmuffs'],
  'Ear Plug': ['foam ear plugs', 'disposable ear plugs', 'hearing protection ear plugs'],
  'Metal Helmet': ['metal safety helmet', 'aluminum hard hat', 'safety helmet metal'],
  'Fiber Helmet': ['hard hat safety helmet', 'fiber safety helmet', 'construction helmet'],
  'Helmet with Ratchet & Chin Strap': ['safety helmet chin strap', 'ratchet safety helmet', 'hard hat chin strap'],
  'Full Body Harness': ['full body safety harness', 'fall arrest harness', 'work at height harness'],
  Lanyard: ['fall arrest lanyard', 'safety lanyard', 'shock absorbing lanyard'],
  'Retractable Fall Arrester': ['retractable fall arrester', 'self retracting lifeline', 'fall arrest block'],
  'Cargo Lashing Belt': ['cargo lashing belt', 'ratchet tie down strap', 'cargo ratchet strap'],
  'Industrial Pipe Fittings': ['pipe fittings', 'industrial pipe fittings', 'plumbing fittings'],
  'Building Materials': ['building materials', 'construction site materials', 'industrial site supplies'],
  'Hardware Supplies': ['hardware tools supplies', 'industrial hardware', 'tools and hardware'],
  'DTF Printing': ['direct to film printing', 'DTF printer', 't-shirt transfer printing'],
  'Embroidery Service': ['embroidery machine logo', 'machine embroidery', 'embroidered logo'],
  'Sublimation Printing': ['sublimation printing', 'dye sublimation printer', 'sublimation transfer printing'],
  'Screen Printing': ['screen printing', 'silkscreen printing', 'screen printing equipment'],
  'Offset Printing': ['offset printing press', 'printing press', 'offset lithography printing'],
  'Custom Shield & Trophy': ['trophy award shield', 'corporate trophy award', 'recognition award trophy'],
  'Industrial Signage': ['industrial safety signage', 'warning safety sign', 'factory safety signs'],
  'Medical Consumables': ['medical consumables', 'medical supplies', 'medical gloves masks supplies'],
  'Dry Cat Food': ['dry cat food', 'cat food pellets', 'cat food bag'],
  'Bird Feed & Accessories': ['bird seed feed', 'bird feed accessories', 'bird food bag'],
  'Custom Order Sourcing': ['warehouse sourcing supply', 'industrial procurement warehouse', 'commercial supply shelves'],
  'Marine Anti-Fouling Paint': ['antifouling paint can', 'marine paint can', 'anti fouling paint'],
  'Kiswire Steel Wire Rope': ['steel wire rope spool', 'wire rope coil', 'steel cable roll'],
  'Customized Stationery Set': ['stationery set notebook pen', 'office stationery set', 'notebooks pens stationery'],
  'Oil Spill Kit': ['oil spill kit', 'spill response kit', 'hazmat spill kit'],
  'Industrial Traffic Cone': ['traffic cone', 'industrial traffic cone', 'orange traffic cone'],
  'Warning Tape': ['warning tape', 'caution tape', 'barrier warning tape'],
  'Safety Barrier': ['safety barrier', 'industrial safety barrier', 'expandable safety barrier'],
  'High-Power Flashlight': ['industrial flashlight', 'high power flashlight', 'rechargeable torch'],
  'PVC Bucket / Plastic Drum': ['plastic drum bucket', 'PVC bucket plastic drum', 'industrial plastic bucket'],
  'PVC Apron': ['PVC apron', 'chemical apron', 'waterproof apron'],
  'Garbage Bags': ['garbage bags', 'black trash bags', 'waste bags'],
  'Bio-degradable Garbage Bags': ['biodegradable garbage bags', 'compostable trash bags', 'green garbage bags'],
  'Trolley Bag': ['tool trolley bag', 'heavy duty trolley bag', 'rolling tool bag'],
  'Industrial Tool Box': ['industrial tool box', 'metal tool box', 'professional toolbox'],
  'Aluminum Ladder': ['aluminum ladder', 'folding aluminum ladder', 'step ladder'],
  'Insulated Water Cooler': ['insulated water cooler jug', 'water cooler dispenser', 'igloo water cooler'],
  'First Aid Box': ['first aid kit box', 'first aid box', 'medical first aid kit'],
  'Disposable Shoe Covers': ['disposable shoe covers', 'shoe covers', 'protective shoe covers'],
  'Hairnet Bulk Pack': ['medical bouffant cap', 'bouffant cap', 'disposable headgear hairnet'],
  'Fire Resistant Cabinet': ['flammable safety cabinet', 'fire resistant cabinet', 'hazardous material safety cabinet'],
  'Nylon Rope': ['nylon rope coil', 'nylon rope', 'rope coil'],
  'Food Grade Silicone': ['food grade silicone sealant', 'silicone sealant tube', 'sealant tube'],
  'Cleaning Accessories': ['cleaning supplies mop', 'janitorial cleaning supplies', 'cleaning tools'],
  'Hygiene Products': ['hand sanitizer soap hygiene', 'hygiene products', 'soap sanitizer supplies'],
  'Industrial Stretch Film': ['stretch film pallet wrap', 'industrial stretch film', 'pallet wrapping film'],
  'Blower Fan with Duct': ['portable ventilation fan duct', 'confined space blower fan', 'industrial ventilation fan flexible duct'],
  'Winter Jacket': ['winter work jacket', 'insulated work jacket', 'cold weather workwear jacket'],
  'ANZA Refills & Handles': ['paint roller handle', 'paint roller', 'paint roller sleeve'],
};

const commonsFilePage = (fileName) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName).replace(/%2F/g, '/')}`;

const manualImageOverrides = {
  'Industrial Cargo Pants': {
    title: 'Cargo pants 001.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Cargo_pants_001.jpg/960px-Cargo_pants_001.jpg',
    sourceUrl: commonsFilePage('Cargo pants 001.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'Cotton Coverall': {
    title: 'Boilersuit2.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Boilersuit2.jpg/960px-Boilersuit2.jpg',
    sourceUrl: commonsFilePage('Boilersuit2.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'Twill Cotton 2pc Uniform': {
    source: 'Unsplash',
    title: 'Factory workers wearing coordinated blue work uniforms',
    downloadUrl:
      'https://images.unsplash.com/photo-1741591649025-3e6d50c7f0e4?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600',
    sourceUrl: 'https://unsplash.com/photos/workers-in-a-factory-sort-and-package-items-4tioh0Q7t_M',
    creator: 'EqualStock',
    license: 'Unsplash License',
    licenseUrl: 'https://unsplash.com/license',
  },
  'Fire Retardant Coverall': {
    source: 'Flickr',
    title: 'Flame resistant variant coveralls issued aboard USS Bonhomme Richard',
    downloadUrl: 'https://live.staticflickr.com/4327/35299209684_0145937958_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/55244200@N05/35299209684',
    creator: 'SurfaceWarriors / U.S. Navy',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'Non-Metal Safety Shoes': {
    title: 'S3 safety footwear.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/S3_safety_footwear.jpg/960px-S3_safety_footwear.jpg',
    sourceUrl: commonsFilePage('S3 safety footwear.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  'Metal Safety Shoes': {
    title: 'Safety Jogger Yukon work boot',
    downloadUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Gi%C3%A0y_b%E1%BA%A3o_h%E1%BB%99_lao_%C4%91%E1%BB%99ng_safety_jogger_yukon.jpg/960px-Gi%C3%A0y_b%E1%BA%A3o_h%E1%BB%99_lao_%C4%91%E1%BB%99ng_safety_jogger_yukon.jpg',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Gi%C3%A0y_b%E1%BA%A3o_h%E1%BB%99_lao_%C4%91%E1%BB%99ng_safety_jogger_yukon.jpg',
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'Welder Boot': {
    title: 'DeWalt Newark steel toe work boots.jpg',
    downloadUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/DeWalt_Newark_steel_toe_work_boots.jpg/960px-DeWalt_Newark_steel_toe_work_boots.jpg',
    sourceUrl: commonsFilePage('DeWalt Newark steel toe work boots.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  'Dotted Gloves': {
    title: 'Antivibration gloves.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Antivibration_gloves.jpg/960px-Antivibration_gloves.jpg',
    sourceUrl: commonsFilePage('Antivibration gloves.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'Latex Gloves': {
    title: 'Latex gloves-pair.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Latex_gloves-pair.jpg/960px-Latex_gloves-pair.jpg',
    sourceUrl: commonsFilePage('Latex gloves-pair.jpg'),
    creator: 'Nadina Wiorkiewicz',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'Leather Gloves': {
    title: 'Men Leather Work Gloves',
    downloadUrl: 'https://live.staticflickr.com/7250/7058150849_185f3139dc_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/28958738@N06/7058150849',
    creator: 'Public Domain Photos',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Welding Gloves': {
    title: 'Best Welding Gloves',
    downloadUrl: 'https://live.staticflickr.com/65535/51959746994_ac14b83dae.jpg',
    sourceUrl: 'https://www.flickr.com/photos/144303299@N04/51959746994',
    creator: 'samuelemunemu321',
    license: 'Public domain mark',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  'Surgical Masks': {
    title: 'A surgical mask (2017).jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/A_surgical_mask_%282017%29.jpg/960px-A_surgical_mask_%282017%29.jpg',
    sourceUrl: commonsFilePage('A surgical mask (2017).jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'Metal Helmet': {
    source: 'Pitbull Safety',
    title: 'Pitbull safety helmet product image',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2023/05/helmet.png',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Fiber Helmet': {
    source: 'Pitbull Safety',
    title: 'Pitbull safety helmet product image',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2023/05/helmet.png',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Helmet with Ratchet & Chin Strap': {
    source: 'Pitbull Safety',
    title: 'Pitbull visor ABS helmet with adjustable chin strap',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2023/05/PITBULL-VISOR-ABS-HELMET.jpg',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Fire Retardant Coverall': {
    source: 'Pitbull Safety',
    title: 'Pitbull flame retardant coverall product image',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2019/09/Fire-Resistant-2-600x600-1.png',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Full Body Harness': {
    source: 'Pitbull Safety',
    title: 'Pitbull full body safety harness',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2024/01/PITBULL-HARNESS-1.jpg',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Disposable Coverall': {
    title: 'Bioclean-D BDCCT Product.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bioclean-D_BDCCT_Product.jpg/960px-Bioclean-D_BDCCT_Product.jpg',
    sourceUrl: commonsFilePage('Bioclean-D_BDCCT_Product.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'Wikimedia Commons license',
  },
  'Full Face Mask': {
    title: '3M 6000 series full face respirator.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/3M_6000_series_full_face_respirator.jpg',
    sourceUrl: commonsFilePage('3M_6000_series_full_face_respirator.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'Wikimedia Commons license',
  },
  'Half Face Mask': {
    title: 'Linenger in Respirator.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Linenger_in_Respirator.jpg',
    sourceUrl: commonsFilePage('Linenger_in_Respirator.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'Wikimedia Commons license',
  },
  'Full Body Harness': {
    title: 'Fall protection symposium, July 8-9, 2014',
    downloadUrl: 'https://live.staticflickr.com/5558/14769629885_8042bd1e64_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/86561000@N05/14769629885',
    creator: 'Western Area Power Admin',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Retractable Fall Arrester': {
    title: 'Mobile fall arrestor',
    downloadUrl: 'https://live.staticflickr.com/7646/16813154220_058fb71b8f_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/86561000@N05/16813154220',
    creator: 'Western Area Power Admin',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Embroidery Service': {
    title: 'Stickmaschine im Temporaerhaus in Neu-Ulm 02.jpg',
    downloadUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Stickmaschine_im_Tempor%C3%A4rhaus_in_Neu-Ulm_02.jpg/960px-Stickmaschine_im_Tempor%C3%A4rhaus_in_Neu-Ulm_02.jpg',
    sourceUrl: commonsFilePage('Stickmaschine_im_Temporärhaus_in_Neu-Ulm_02.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'Wikimedia Commons license',
  },
  'Oil Spill Kit': {
    title: 'Spill kit, Griffin wind farm - geograph.org.uk - 4140767.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Spill_kit%2C_Griffin_wind_farm_-_geograph.org.uk_-_4140767.jpg',
    sourceUrl: commonsFilePage('Spill kit, Griffin wind farm - geograph.org.uk - 4140767.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'Warning Tape': {
    title: 'Police line curb police tape photo',
    downloadUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Police_Line_Curb_Police_Tape_3912300267_8c2b94756f_o.jpg/960px-Police_Line_Curb_Police_Tape_3912300267_8c2b94756f_o.jpg',
    sourceUrl: commonsFilePage('Police_Line_Curb_Police_Tape_3912300267_8c2b94756f_o.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'Wikimedia Commons license',
  },
  'High-Power Flashlight': {
    title: 'High power torch.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/High_power_torch.jpg/960px-High_power_torch.jpg',
    sourceUrl: commonsFilePage('High_power_torch.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'Wikimedia Commons license',
  },
  'PVC Bucket / Plastic Drum': {
    title: 'Plastic bucket.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Plastic_bucket.jpg/960px-Plastic_bucket.jpg',
    sourceUrl: commonsFilePage('Plastic_bucket.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'Wikimedia Commons license',
  },
  'PVC Apron': {
    source: 'Pexels',
    title: 'Worker in a waterproof protective apron at a dairy production line',
    downloadUrl: 'https://images.pexels.com/photos/5953684/pexels-photo-5953684.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sourceUrl: 'https://www.pexels.com/photo/worker-in-protective-gloves-working-on-cheese-production-5953684/',
    creator: 'Anna Shvets',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
  },
  'Bio-degradable Garbage Bags': {
    title: 'Waste Bag made of PLA-Blend Bio-Flex.jpg',
    downloadUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Waste_Bag_made_of_PLA-Blend_Bio-Flex.jpg/960px-Waste_Bag_made_of_PLA-Blend_Bio-Flex.jpg',
    sourceUrl: commonsFilePage('Waste Bag made of PLA-Blend Bio-Flex.jpg'),
    creator: 'F. Kesselring, FKuR Willich',
    license: 'CC BY-SA 3.0 DE',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.en',
  },
  'Trolley Bag': {
    title: 'Tool bag.webp',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Tool_bag.webp/960px-Tool_bag.webp.png',
    sourceUrl: commonsFilePage('Tool bag.webp'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  'Food Grade Silicone': {
    title: '2-part silicone adhesive sealant.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/2-part_silicone_adhesive_sealant.jpg/960px-2-part_silicone_adhesive_sealant.jpg',
    sourceUrl: commonsFilePage('2-part silicone adhesive sealant.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'Cleaning Accessories': {
    title: 'Mop and bucket.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Mop_and_bucket.jpg/960px-Mop_and_bucket.jpg',
    sourceUrl: commonsFilePage('Mop_and_bucket.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'Wikimedia Commons license',
  },
  'Industrial Stretch Film': {
    title: 'Pallet wrapper.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Pallet_wrapper.jpg/960px-Pallet_wrapper.jpg',
    sourceUrl: commonsFilePage('Pallet_wrapper.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'Wikimedia Commons license',
  },
  'Blower Fan with Duct': {
    title: 'Fans Clear High-Rise Stairwells of Smoke (5888202056).jpg',
    downloadUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Fans_Clear_High-Rise_Stairwells_of_Smoke_%285888202056%29.jpg/960px-Fans_Clear_High-Rise_Stairwells_of_Smoke_%285888202056%29.jpg',
    sourceUrl: commonsFilePage('Fans Clear High-Rise Stairwells of Smoke (5888202056).jpg'),
    creator: 'New York National Guard',
    license: 'Public domain',
  },
  'DTF Printing': {
    title: 'A graphic designer transferring an impression on to a shirt with heat press.jpg',
    downloadUrl:
      'https://upload.wikimedia.org/wikipedia/commons/1/15/A_graphic_designer_transferring_an_impression_on_to_a_shirt_with_heat_press.jpg',
    sourceUrl: commonsFilePage('A_graphic_designer_transferring_an_impression_on_to_a_shirt_with_heat_press.jpg'),
    creator: 'Tahiru Rajab',
    license: 'CC BY-SA 4.0',
  },
  'Medical Consumables': {
    source: 'Flickr',
    title: 'Boxes of powder-free latex examination gloves and medical supplies',
    downloadUrl: 'https://live.staticflickr.com/65535/49678011562_4ecff1fcf0_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/33252741@N08/49678011562',
    creator: 'The National Guard',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Hardware Supplies': {
    title: 'Tools 66.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Tools_66.jpg/960px-Tools_66.jpg',
    sourceUrl: commonsFilePage('Tools 66.jpg'),
    creator: 'Wilfredor',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'Building Materials': {
    title: 'Tools 66.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Tools_66.jpg/960px-Tools_66.jpg',
    sourceUrl: commonsFilePage('Tools 66.jpg'),
    creator: 'Wilfredor',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'Nitrile Gloves': {
    source: 'Nova Green',
    title: 'Nova Green protective gloves product image',
    downloadUrl: 'https://novagreen.ae/wp-content/uploads/2024/12/glouws-47-1-1024x1024.webp',
    sourceUrl: 'https://novagreen.ae/',
    creator: 'Nova Green',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://novagreen.ae/',
  },
  'Custom Order Sourcing': {
    title: 'Steel wire coils and wrapped pallets at construction supply yard',
    downloadUrl: 'https://live.staticflickr.com/65535/54552184912_ffeef1b567_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/202846129@N03/54552184912',
    creator: 'nenadstojkovicart',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Custom T-Shirt': {
    title: 'Ringflash Tshirt Blank Template (3214240974).jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Ringflash_Tshirt_Blank_Template_%283214240974%29.jpg',
    sourceUrl: commonsFilePage('Ringflash_Tshirt_Blank_Template_(3214240974).jpg'),
    creator: 'THOR',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Lab Coat': {
    title: 'Lab coats.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Lab_coats.jpg',
    sourceUrl: commonsFilePage('Lab_coats.jpg'),
    creator: 'Pi.',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  Gumboot: {
    title: 'Rubber boots 2204-0240.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Rubber_boots_2204-0240.jpg',
    sourceUrl: commonsFilePage('Rubber_boots_2204-0240.jpg'),
    creator: 'Mozzihh',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'Executive Safety Shoes': {
    title: 'XenaWorkwear-Gravity-Safety-Shoe.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/XenaWorkwear-Gravity-Safety-Shoe.jpg',
    sourceUrl: commonsFilePage('XenaWorkwear-Gravity-Safety-Shoe.jpg'),
    creator: 'Foorej41',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'Safety Spectacles': {
    title: '2023 Okulary ochronne (1).jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/2023_Okulary_ochronne_%281%29.jpg',
    sourceUrl: commonsFilePage('2023_Okulary_ochronne_(1).jpg'),
    creator: 'Jacek Halicki',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'Helmet with Ratchet & Chin Strap': {
    title: "US Navy hard hat chin strap photo",
    downloadUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/5e/US_Navy_110301-N-2055M-087_Boatswain%27s_Mate_Seaman_Christopher_Handlin_fastens_the_chin_strap_of_his_hard_hat_inside_the_port_side_rigid_hull_infla.jpg",
    sourceUrl: commonsFilePage(
      "US_Navy_110301-N-2055M-087_Boatswain's_Mate_Seaman_Christopher_Handlin_fastens_the_chin_strap_of_his_hard_hat_inside_the_port_side_rigid_hull_infla.jpg",
    ),
    creator: 'U.S. Navy',
    license: 'Public domain',
  },
  Lanyard: {
    title: 'ViaFerrataLanyardPetzlScorpio.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/ViaFerrataLanyardPetzlScorpio.jpg',
    sourceUrl: commonsFilePage('ViaFerrataLanyardPetzlScorpio.jpg'),
    creator: 'Ismith',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'Cargo Lashing Belt': {
    title: 'Custom made tie down strap.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Custom_made_tie_down_strap.jpg',
    sourceUrl: commonsFilePage('Custom_made_tie_down_strap.jpg'),
    creator: 'DustinMoving',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'Industrial Pipe Fittings': {
    title: 'PPR pipe and Fitting.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/PPR_pipe_and_Fitting.jpg',
    sourceUrl: commonsFilePage('PPR_pipe_and_Fitting.jpg'),
    creator: 'Mekalshan',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'Dry Cat Food': {
    title: 'Dry cat food 02.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Dry_cat_food_02.jpg',
    sourceUrl: commonsFilePage('Dry_cat_food_02.jpg'),
    creator: 'Anne Jea.',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'Bird Feed & Accessories': {
    title: 'Birdseed Sensory Play',
    downloadUrl: 'https://live.staticflickr.com/5484/9556996995_dfa3494208_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/98925031@N08/9556996995',
    creator: 'emmacraig1',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Sublimation Printing': {
    title: 'CottonBee drukarka.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/CottonBee_drukarka.jpg/960px-CottonBee_drukarka.jpg',
    sourceUrl: commonsFilePage('CottonBee drukarka.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'Industrial Signage': {
    title: 'Work in progress',
    downloadUrl: 'https://live.staticflickr.com/2511/4000128011_5d78d4cb77_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/55231259@N00/4000128011',
    creator: 'futureshape',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Marine Anti-Fouling Paint': {
    source: 'Flickr',
    title: 'Boat hull with freshly applied anti-fouling paint',
    downloadUrl: 'https://live.staticflickr.com/3816/9321280429_61dd1f3463_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/80824546@N00/9321280429',
    creator: 'infomatique',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'Industrial Traffic Cone': {
    title: 'Reflective traffic cone',
    downloadUrl: 'https://live.staticflickr.com/8060/8152375880_ec8fd17e11_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/7972895@N02/8152375880',
    creator: 'rafael-castillo',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Insulated Water Cooler': {
    title: 'Fishing cooler filled with ice and cold beverages.jpg',
    downloadUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Fishing_cooler_filled_with_ice_and_cold_beverages.jpg/960px-Fishing_cooler_filled_with_ice_and_cold_beverages.jpg',
    sourceUrl: commonsFilePage('Fishing cooler filled with ice and cold beverages.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'First Aid Box': {
    title: 'First Aid Kits',
    downloadUrl: 'https://live.staticflickr.com/2858/10668637344_841ae17836.jpg',
    sourceUrl: 'https://www.flickr.com/photos/107621760@N03/10668637344',
    creator: 'medisave',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Disposable Shoe Covers': {
    title: 'Shoe covers',
    downloadUrl: 'https://live.staticflickr.com/2119/2423954277_fdafd9f8b8_b.jpg',
    sourceUrl: 'https://www.flickr.com/photos/17306001@N00/2423954277',
    creator: "noii's",
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'Hygiene Products': {
    title: 'Hand sanitizer bottle.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Hand_sanitizer_bottle.jpg/960px-Hand_sanitizer_bottle.jpg',
    sourceUrl: commonsFilePage('Hand sanitizer bottle.jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'Respiratory Mask': {
    title: 'Dust-Mask-Cone 23462-480x360 (4999891973).jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Dust-Mask-Cone_23462-480x360_%284999891973%29.jpg',
    sourceUrl: commonsFilePage('Dust-Mask-Cone 23462-480x360 (4999891973).jpg'),
    creator: 'Wikimedia Commons contributor',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'Customized Stationery Set': {
    source: 'Pexels',
    title: 'Notebook, pens, ruler and stationery supplies arranged on a table',
    downloadUrl: 'https://images.pexels.com/photos/7718798/pexels-photo-7718798.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sourceUrl: 'https://www.pexels.com/photo/various-supplies-for-crafting-on-table-7718798/',
    creator: 'Pavel Danilyuk',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
  },
  'Non-Metal Safety Shoes': {
    source: 'Pitbull Safety',
    title: 'Pitbull PB-500 safety footwear',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2026/04/14-PB-500.jpg',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Welder Boot': {
    source: 'Pitbull Safety',
    title: 'Pitbull safety footwear',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2026/04/14-PB-500.jpg',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  Gumboot: {
    source: 'Nova Green',
    title: 'Nova Green Brexley gumboot product image',
    downloadUrl: 'https://novagreen.ae/wp-content/uploads/2025/07/GUMBOOT-BREXLEY-3-1.png',
    sourceUrl: 'https://novagreen.ae/',
    creator: 'Nova Green',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://novagreen.ae/',
  },
  'Nitrile Gloves': {
    source: 'Pitbull Safety',
    title: 'Pitbull nitrile glove product pack',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2020/10/NITRILE-GLOVES-front-back-view.jpg',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Fire Retardant Coverall': {
    source: 'Pitbull Safety',
    title: 'Pitbull flame retardant coverall product image',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2019/09/Fire-Resistant-2-600x600-1.png',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Full Body Harness': {
    source: 'Pitbull Safety',
    title: 'Pitbull full body safety harness',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2024/01/PITBULL-HARNESS-1.jpg',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Fiber Helmet': {
    source: 'Pitbull Safety',
    title: 'Pitbull safety helmet product image',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2023/05/helmet.png',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Helmet with Ratchet & Chin Strap': {
    source: 'Pitbull Safety',
    title: 'Pitbull visor ABS helmet with adjustable chin strap',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2023/05/PITBULL-VISOR-ABS-HELMET.jpg',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Garbage Bags': {
    title: 'Waste Bag made of PLA-Blend Bio-Flex.jpg',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Waste_Bag_made_of_PLA-Blend_Bio-Flex.jpg/960px-Waste_Bag_made_of_PLA-Blend_Bio-Flex.jpg',
    sourceUrl: commonsFilePage('Waste Bag made of PLA-Blend Bio-Flex.jpg'),
    creator: 'F. Kesselring, FKuR Willich',
    license: 'CC BY-SA 3.0 DE',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.en',
  },
  'Ear Plug': {
    source: 'Pitbull Safety',
    title: 'Pitbull corded ear plug product image',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2019/09/Ear-Plug-FEP-506-with-blue-cord-1200x1200-1.png',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
  'Face Shield': {
    source: 'Pitbull Safety',
    title: 'Pitbull protective face shield product image',
    downloadUrl: 'https://pitbullsafety.com/wp-content/uploads/2020/10/FSL-B.png',
    sourceUrl: 'https://pitbullsafety.com/',
    creator: 'Pitbull Safety Products',
    license: 'Authorized dealer product imagery',
    licenseUrl: 'https://pitbullsafety.com/',
  },
};

const categoryQueries = {
  Clothing: ['industrial workwear'],
  'Safety Footwear': ['safety footwear'],
  'Hand Protection': ['work gloves'],
  'Respiratory Protection': ['respirator mask'],
  'Eye & Ear Protection': ['PPE eye protection'],
  'Head Protection': ['hard hat safety helmet'],
  'Fall Protection': ['fall protection equipment'],
  'Building Materials & Hardware': ['hardware tools supplies'],
  'Printing Services': ['printing equipment'],
  'Shields and Trophies': ['trophy award'],
  Signages: ['safety signage'],
  'Bird & Cat Food': ['pet food bag'],
  'Order Suppliers': ['warehouse supply shelves'],
  'Marine Paints': ['paint can'],
  'Steel Wire Ropes': ['steel wire rope'],
  Stationeries: ['office stationery'],
  'Miscellaneous Products': ['industrial supplies'],
  'Medical Consumables': ['medical supplies'],
};

const stopWords = new Set([
  'and',
  'for',
  'the',
  'with',
  'bulk',
  'pack',
  'service',
  'services',
  'custom',
  'customized',
  'industrial',
  'premium',
  'supplies',
  'products',
  'high',
  'power',
  'grade',
  'resistant',
  'protection',
  'protective',
  'safety',
  'miscellaneous',
  'non',
  'metal',
]);

const penaltyTerms = [
  'pdf',
  'diagram',
  'drawing',
  'poster',
  'map',
  'badge',
  'logo',
  'painting',
  'cartoon',
  'exhibition',
  'museum',
  'memorial',
  'statue',
  'archive',
  'patent',
  'book',
  'catalogue',
  'screenshot',
  'body',
  'breast',
  'nude',
  'wikimedia logo',
  'thingiverse',
  'model',
  'render',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const stripHtml = (value = '') =>
  String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const productFileStem = (product) => `${String(product.id).padStart(2, '0')}-${slugify(product.name)}`;
const responsiveImageWidths = [480, 960];

const tokenize = (value) =>
  String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 2 && !stopWords.has(token));

const unique = (items) => [...new Set(items.filter(Boolean))];

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

const readJsonIfExists = async (filePath) => {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
};

const fileExists = async (filePath) => {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch {
    return false;
  }
};

const hasCompleteManifest = async (products, manifest) => {
  if (!manifest?.products || manifest.products.length !== products.length) return false;
  if (manifest.sourceOverrideRevision !== sourceOverrideRevision) return false;

  for (const product of products) {
    const entry = manifest.products.find((item) => item.id === product.id && item.name === product.name);
    if (!entry?.path || entry.path.endsWith('.svg')) return false;
    if (!(await fileExists(path.join('public', entry.path)))) return false;
  }

  return true;
};

const sourceText = (candidate) =>
  [
    candidate.title,
    candidate.description,
    candidate.categories,
    candidate.source,
    candidate.sourceUrl,
    candidate.downloadUrl,
  ]
    .join(' ')
    .toLowerCase();

const scoreCandidate = (product, term, candidate, usedSourceUrls) => {
  const text = sourceText(candidate);
  const productTokens = tokenize(`${product.name} ${product.description}`);
  const termTokens = tokenize(term);
  let score = candidate.source === 'Wikimedia Commons' ? 6 : 3;

  for (const token of productTokens) {
    if (text.includes(token)) score += 9;
  }

  for (const token of termTokens) {
    if (text.includes(token)) score += 5;
  }

  if (text.includes(product.name.toLowerCase())) score += 24;
  if (termTokens.length && termTokens.every((token) => text.includes(token))) score += 18;
  if (candidate.mime === 'image/jpeg') score += 4;
  if ((candidate.width || 0) >= 640 || (candidate.height || 0) >= 640) score += 4;
  if (candidate.license && /public domain|cc0/i.test(candidate.license)) score += 4;
  if (usedSourceUrls.has(candidate.sourceUrl || candidate.downloadUrl)) score -= 26;

  for (const term of penaltyTerms) {
    if (text.includes(term)) score -= 10;
  }

  return score;
};

const confidenceFor = (score) => {
  if (score >= 52) return 'high';
  if (score >= 34) return 'medium';
  return 'representative';
};

const searchTermsFor = (product) =>
  unique([
    ...(productQueries[product.name] || []),
    product.name,
    `${product.name} ${product.category}`,
    ...(categoryQueries[product.category] || []),
  ]).slice(0, 5);

const fetchJson = async (url) => {
  const response = await fetch(url, { headers: { 'User-Agent': userAgent } });
  if (!response.ok) {
    throw new Error(`Request failed ${response.status}: ${url}`);
  }
  return response.json();
};

const searchWikimedia = async (term) => {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: term,
    gsrlimit: '12',
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata|size',
    iiurlwidth: '960',
    format: 'json',
    origin: '*',
  });

  const json = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  const pages = Object.values(json.query?.pages || {});

  return pages
    .map((page) => {
      const info = page.imageinfo?.[0];
      const metadata = info?.extmetadata || {};
      if (!info || !allowedMimes.has(info.mime)) return null;

      return {
        source: 'Wikimedia Commons',
        title: String(page.title || '').replace(/^File:/, ''),
        description: stripHtml(metadata.ImageDescription?.value || metadata.ObjectName?.value || ''),
        categories: stripHtml(metadata.Categories?.value || ''),
        creator: stripHtml(metadata.Artist?.value || metadata.Credit?.value || 'Wikimedia Commons contributor'),
        license: stripHtml(metadata.LicenseShortName?.value || metadata.UsageTerms?.value || 'Wikimedia Commons license'),
        licenseUrl: metadata.LicenseUrl?.value || '',
        sourceUrl: info.descriptionurl || info.descriptionshorturl || info.url,
        downloadUrl: info.thumburl || info.url,
        mime: info.mime,
        width: info.thumbwidth || info.width || 0,
        height: info.thumbheight || info.height || 0,
      };
    })
    .filter(Boolean);
};

const searchOpenverse = async (term) => {
  const params = new URLSearchParams({
    q: term,
    page_size: '12',
    license_type: 'commercial',
    image_type: 'photo',
    extension: 'jpg,png,webp',
  });

  const json = await fetchJson(`https://api.openverse.engineering/v1/images/?${params}`);

  return (json.results || [])
    .filter((item) => allowedOpenverseLicenses.has(String(item.license || '').toLowerCase()))
    .map((item) => ({
      source: item.source || 'Openverse',
      title: item.title || term,
      description: item.description || '',
      categories: Array.isArray(item.tags) ? item.tags.map((tag) => tag.name || tag).join(' ') : '',
      creator: item.creator || 'Openverse contributor',
      license: item.license_version ? `${item.license} ${item.license_version}` : item.license || 'Open license',
      licenseUrl: item.license_url || '',
      sourceUrl: item.foreign_landing_url || item.url,
      downloadUrl: item.url || item.thumbnail,
      mime: '',
      width: item.width || 0,
      height: item.height || 0,
    }))
    .filter((item) => item.downloadUrl);
};

const collectCandidates = async (product, usedSourceUrls) => {
  const candidates = [];
  const manualOverride = manualImageOverrides[product.name];

  if (manualOverride && !refreshImageSelection.has(product.name)) {
    candidates.push({
      source: manualOverride.source || (manualOverride.downloadUrl.includes('flickr') ? 'flickr' : 'Wikimedia Commons'),
      title: manualOverride.title,
      description: `${product.name} licensed representative catalog source`,
      categories: product.category,
      creator: manualOverride.creator,
      license: manualOverride.license,
      licenseUrl: manualOverride.licenseUrl || '',
      sourceUrl: manualOverride.sourceUrl,
      downloadUrl: manualOverride.downloadUrl,
      mime: 'image/jpeg',
      width: 960,
      height: 640,
      query: 'representative catalog product photo',
      score: 999,
    });

    return candidates;
  }

  for (const term of searchTermsFor(product)) {
    const searches = await Promise.allSettled([searchWikimedia(term), searchOpenverse(term)]);
    for (const result of searches) {
      if (result.status !== 'fulfilled') continue;
      for (const candidate of result.value) {
        candidates.push({
          ...candidate,
          query: term,
          score: scoreCandidate(product, term, candidate, usedSourceUrls),
        });
      }
    }
  }

  const seen = new Set();
  return candidates
    .filter((candidate) => {
      const key = candidate.sourceUrl || candidate.downloadUrl;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.score - a.score);
};

const extensionFrom = (contentType, url) => {
  const normalizedType = String(contentType || '').split(';')[0].toLowerCase();
  if (allowedMimes.has(normalizedType)) return allowedMimes.get(normalizedType);

  const extension = path.extname(new URL(url).pathname).replace('.', '').toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) return extension === 'jpeg' ? 'jpg' : extension;
  return '';
};

const removeExistingProductFiles = async (product) => {
  const stem = productFileStem(product);
  const files = await readdir(outputDir).catch(() => []);
  await Promise.all(
    files
      .filter((fileName) => fileName.startsWith(`${stem}.`))
      .map((fileName) => rm(path.join(outputDir, fileName), { force: true })),
  );
};

const removeUnreferencedProductFiles = async (entries) => {
  const referencedFiles = new Set(entries.map((entry) => path.basename(entry.path)));
  const responsiveFiles = new Set(
    entries.flatMap((entry) => {
      const stem = path.parse(entry.path).name;
      return responsiveImageWidths.map((width) => `${stem}-${width}.webp`);
    }),
  );
  const files = await readdir(outputDir).catch(() => []);

  await Promise.all(
    files
      .filter((fileName) => /^\d{2}-.*\.(?:jpe?g|png|webp)$/i.test(fileName))
      .filter((fileName) => !referencedFiles.has(fileName) && !responsiveFiles.has(fileName))
      .map((fileName) => rm(path.join(outputDir, fileName), { force: true })),
  );
};

const ensureResponsiveProductImages = async (entries) => {
  for (const entry of entries) {
    const sourcePath = path.resolve('public', entry.path);
    const sourceInfo = await stat(sourcePath);
    const sourceStem = path.parse(entry.path).name;

    await Promise.all(
      responsiveImageWidths.map(async (width) => {
        const outputPath = path.join(outputDir, `${sourceStem}-${width}.webp`);
        const outputInfo = await stat(outputPath).catch(() => null);
        if (outputInfo?.isFile() && outputInfo.size > 0 && outputInfo.mtimeMs >= sourceInfo.mtimeMs) return;

        await sharp(sourcePath)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 78, effort: 4 })
          .toFile(outputPath);
      }),
    );
  }
};

const downloadCandidate = async (product, candidate) => {
  let response;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(candidate.downloadUrl, {
      headers: {
        'User-Agent': userAgent,
        Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8,*/*;q=0.5',
      },
      redirect: 'follow',
    });

    if (![429, 503].includes(response.status)) break;
    await sleep(attempt * 2500);
  }

  if (!response.ok) {
    throw new Error(`Image download failed ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || candidate.mime;
  const extension = extensionFrom(contentType, candidate.downloadUrl);
  if (!extension) {
    throw new Error(`Unsupported image content type: ${contentType || 'unknown'}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 5000) {
    throw new Error('Downloaded image was too small to use.');
  }

  await removeExistingProductFiles(product);
  const fileName = `${productFileStem(product)}.${extension}`;
  const filePath = path.join(outputDir, fileName);
  await writeFile(filePath, buffer);

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    path: `catalog-images/${fileName}`,
    alt: `${product.name} representative catalog image for Logos International`,
    source: candidate.source,
    sourceTitle: candidate.title,
    sourceUrl: candidate.sourceUrl,
    downloadUrl: candidate.downloadUrl,
    creator: candidate.creator,
    license: candidate.license,
    licenseUrl: candidate.licenseUrl,
    query: candidate.query,
    matchScore: candidate.score,
    matchConfidence: confidenceFor(candidate.score),
  };
};

const buildProductImageTs = (entries) => `export const productImagePaths: Record<number, string> = {
${entries
  .map((entry) => `  ${entry.id}: '/${entry.path}',`)
  .join('\n')}
};

export const productImageAlts: Record<number, string> = {
${entries
  .map((entry) => `  ${entry.id}: ${JSON.stringify(entry.alt)},`)
  .join('\n')}
};
`;

const writeManifestFiles = async (products, entries) => {
  const orderedEntries = [...entries]
    .map((entry) => ({
      ...entry,
      alt: `${entry.name} representative catalog image for Logos International`,
      description:
        entry.description === `${entry.name} curated internet source`
          ? `${entry.name} licensed representative catalog source`
          : entry.description,
      query:
        entry.query === 'curated internet product photo'
          ? 'representative catalog product photo'
          : entry.query,
    }))
    .sort((a, b) => a.id - b.id);
  const generatedAt = new Date().toISOString();
  const manifest = {
    generatedAt,
    sourceOverrideRevision,
    sourcePolicy:
      'Catalog media combines authorized manufacturer or dealer product images with commercially usable public-source photos, with source and license metadata retained for each item.',
    totalProducts: products.length,
    products: orderedEntries,
  };

  const attribution = {
    generatedAt,
    note: 'Attribution and license metadata for catalog images used by Logos International.',
    images: orderedEntries.map((entry) => ({
      productId: entry.id,
      productName: entry.name,
      imagePath: entry.path,
      sourceTitle: entry.sourceTitle,
      source: entry.source,
      sourceUrl: entry.sourceUrl,
      creator: entry.creator,
      license: entry.license,
      licenseUrl: entry.licenseUrl,
      query: entry.query,
      matchConfidence: entry.matchConfidence,
    })),
  };

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(attributionPath, `${JSON.stringify(attribution, null, 2)}\n`);
  await writeFile(productImagesTsPath, buildProductImageTs(orderedEntries));
  await ensureResponsiveProductImages(orderedEntries);
  await removeUnreferencedProductFiles(orderedEntries);
};

const products = await readProducts();

if (products.length === 0) {
  throw new Error('No products found while generating product images.');
}

await mkdir(outputDir, { recursive: true });

const existingManifest = await readJsonIfExists(manifestPath);
if (await hasCompleteManifest(products, existingManifest)) {
  await writeManifestFiles(products, existingManifest.products);
  console.log(`Catalog image manifest is current with ${products.length} internet-sourced product images.`);
  process.exit(0);
}

const entries = [];
const usedSourceUrls = new Set();

for (const product of products) {
  const existingEntry = existingManifest?.products?.find((entry) => entry.id === product.id && entry.name === product.name);
  const currentManualOverride = manualImageOverrides[product.name];
  const matchesCurrentSource =
    !currentManualOverride ||
    (existingEntry?.sourceUrl === currentManualOverride.sourceUrl &&
      existingEntry?.downloadUrl === currentManualOverride.downloadUrl &&
      (!currentManualOverride.source || existingEntry?.source === currentManualOverride.source));
  const shouldReuseExisting =
    existingEntry &&
    matchesCurrentSource &&
    !existingEntry.path.endsWith('.svg') &&
    (await fileExists(path.join('public', existingEntry.path)));

  if (shouldReuseExisting) {
    entries.push(existingEntry);
    usedSourceUrls.add(existingEntry.sourceUrl || existingEntry.downloadUrl);
    continue;
  }

  const candidates = await collectCandidates(product, usedSourceUrls);
  let entry = null;
  let lastError = null;

  for (const candidate of candidates.slice(0, 18)) {
    try {
      entry = await downloadCandidate(product, candidate);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!entry) {
    throw new Error(
      `Could not download a usable internet image for ${product.name}. Last error: ${lastError?.message || 'No candidates found.'}`,
    );
  }

  entries.push(entry);
  usedSourceUrls.add(entry.sourceUrl || entry.downloadUrl);
  console.log(
    `${String(product.id).padStart(2, '0')} ${product.name}: ${entry.matchConfidence} match from ${entry.source} (${entry.query})`,
  );
}

await writeManifestFiles(products, entries);

console.log(`Downloaded ${entries.length} internet-sourced product images into ${path.relative(process.cwd(), outputDir)}.`);
