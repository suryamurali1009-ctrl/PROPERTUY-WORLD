import { Property, Testimonial } from './types';

export const PROPERTIES: Property[] = [
  {
    id: 'lepakshi-resort-farms',
    title: 'Lepakshi Resort & Farms',
    tagline: 'Premium Farm Plots amidst nature with modern resort amenities',
    type: 'resort',
    location: 'Lepakshi Border',
    subLocation: 'Near Historical Lepakshi Temple, AP-Karnataka Border',
    priceText: '₹1.5 Lakh / cent onwards',
    basePrice: 1875000, // 12.5 cents * 1.5L = 18,75,000 INR
    basePricePerUnit: 150000,
    unitLabel: 'cent',
    sizeText: '1 cent = 436 Sqft (Plots from 12.5 cents / 5,445 Sqft)',
    sizesAvailable: [5445, 10890, 21780], // 12.5, 25, 50 cents
    description: 'Luxury resort-styled farm plots with full club access, mature plantations, and 24/7 security. Low entry points with flexible installment structures.',
    longDescription: 'Escape to tranquil luxury at Lepakshi Resort & Farms, beautifully located near the historical temple town of Lepakshi. Offering master-planned agricultural and resort-styled farm plots starting from ₹19 Lakhs onwards for massive plots of 5,445 Sqft (12.5 cents). Property World Builders & Developers provides dynamic modular installment schemes, allowing you to secure premium real estate effortlessly. Beautiful green perimeters, custom high-yield Sandalwood/Fruit plantings, active maintenance, and elite resort privileges make this an unparalleled investment.',
    features: [
      'Gated Community with 24/7 Physical Security',
      'High-Yield Sandalwood & Organic Fruit Plantations',
      'Exclusive Resort Club membership with Pool & Lounge',
      'Electricity, Water connections to every plot',
      '60ft & 40ft wide internal metalled roads',
      'Low entry point with flexible monthly installments'
    ],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200'
    ],
    contactNumbers: ['9731308328', '9743395619'],
    isPremium: true,
    installmentsAvailable: true,
    minInstallmentMonths: 12,
    maxInstallmentMonths: 36,
    developmentStatus: 'Ready to Construct'
  },
  {
    id: 'devanahalli-farmhouse-plots',
    title: 'Devanahalli Premium Farmhouse Estates',
    tagline: 'Proposed 1/2 Acre luxury country estates near Bangalore International Airport',
    type: 'farmhouse',
    location: 'Devanahalli, Bangalore North',
    subLocation: 'Prime Residential Belt, Near Kempegowda International Airport',
    priceText: '₹1,950 / Sqft',
    basePrice: 42471000, // 21,780 sqft * 1950 = 42,471,000 INR
    basePricePerUnit: 1950,
    unitLabel: 'sqft',
    sizeText: '1/2 Acre plots (21,780 Sqft)',
    sizesAvailable: [21780],
    description: 'Breathtaking proposed farmhouses with brick compound walls, private entrance gates, and mature organic tree orchards.',
    longDescription: 'Secure your legacy in Bangalore’s fastest growing real estate belt. This magnificent proposed half-acre (21,780 Sqft) farmhouse development in Devanahalli combines high-value agricultural potential with country club elegance. Every plot is delivered with custom-installed high-grade brick compound walls, a designer steel entrance gate, automatic drip irrigation, pre-planted fruit orchards, and direct paved road access. Ideally situated minutes from the Kempegowda International Airport, combining explosive land value appreciation with peaceful rural retirement.',
    features: [
      'Full boundary Brick Compound Wall & Steel Gate included',
      'Proposed modern farmhouse villa layouts ready for custom build',
      'Drip irrigation connected organic orchard trees',
      'Direct main road accessibility with avenue plantation',
      'High appreciation potential due to massive industrial airport expansion',
      'Electricity lines and high-yield borewell systems'
    ],
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200'
    ],
    contactNumbers: ['9731308328', '9743395619'],
    isPremium: true,
    installmentsAvailable: true,
    minInstallmentMonths: 6,
    maxInstallmentMonths: 18,
    developmentStatus: 'Proposed'
  },
  {
    id: 'devanahalli-site-plots',
    title: 'Devanahalli BIAAPA Approved Sites',
    tagline: 'Premium residential gated plots fully approved by BIAAPA near International Airport',
    type: 'site',
    location: 'Devanahalli, Bangalore North',
    subLocation: 'BIAAPA Approved Layout, Near Airport Gate',
    priceText: '₹3,750 / Sqft',
    basePrice: 9000000, // 2400 sqft * 3750 = 90,00,000 INR
    basePricePerUnit: 3750,
    unitLabel: 'sqft',
    sizeText: 'Plots ready for immediate construction: 2400 & 4000 Sqft',
    sizesAvailable: [2400, 4000],
    description: 'Fully authorized BIAAPA plots featuring top-tier water management, electrical lines, internal layouts, and green landscaping.',
    longDescription: 'Take absolute peace of mind with 100% legal, clear-titled residential plots approved by BIAAPA in prime Devanahalli. Ideal for villa construction, these plots come with high-tier layout development including stormwater drains, wide pedestrian footpaths, clean underground water supply networks, heavy-duty electrical cabling, and green community parks. Positioned optimally to appreciate rapidly with massive tech-parks and logistics corridors coming up around the International Airport.',
    features: [
      '100% Legally Approved by BIAAPA with Khata & clear titles',
      'Underground electrical networking & modern street lighting',
      'Rainwater harvesting pits and advanced Sewage Treatment Plant (STP)',
      'Multiple manicured children play parks and walking tracks',
      'Ready for immediate registration & direct developer agreement',
      'Prime location with immediate links to NH-44 highway'
    ],
    image: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200'
    ],
    contactNumbers: ['9740589739', '9731308328'],
    isPremium: true,
    installmentsAvailable: false,
    developmentStatus: 'Approved',
    approvalBody: 'BIAAPA'
  },
  {
    id: 'horamavu-apartments',
    title: 'Horamavu Main Road 2BHK Apartments',
    tagline: 'Modern, key-in-hand 2BHK residential apartments on Horamavu Main Road',
    type: 'apartment',
    location: 'Horamavu Main Road, Bangalore',
    subLocation: '2km from Banaswadi Outer Ring Road Court',
    priceText: '₹55 Lakh onwards (Estimated)',
    basePrice: 5500000,
    basePricePerUnit: 5000,
    unitLabel: 'sqft',
    sizeText: 'Spacious 2BHK Layouts: 1100 & 1300 Sqft',
    sizesAvailable: [1100, 1300],
    description: 'Exclusive state-of-the-art apartments with elevator services, covered parking, and 24/7 security on Horamavu Main Road.',
    longDescription: 'Affordable urban luxury awaits on Horamavu Main Road, Bangalore. Built with exceptional structural engineering, these premium 2BHK flats range from 1100 to 1300 Sqft. Strategically located exactly 2 kilometers from the Banaswadi Outer Ring Road Court, commuting is a breeze to premium IT hubs (Manyata Tech Park, Bagmane) and Kempegowda Airport. Every flat is blessed with heavy ventilation, compliance to Vaastu principles, top-grade tile floorings, teak wood main doors, and automatic generator backup systems.',
    features: [
      'Prime Horamavu Main Road locality (zero off-road confusion)',
      'Secure covered individual car parking on concrete basement',
      'Whisper-quiet automatic 6-passenger automatic lift',
      '24/7 Cauvery / Borewell dual water supply systems',
      'Fully compliant with traditional Vaastu shastra layout',
      'Premium solid copper wiring & branded sanitaries'
    ],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200'
    ],
    contactNumbers: ['9731308328', '9740589739'],
    isPremium: false,
    installmentsAvailable: false,
    developmentStatus: 'Completed'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Balaji K. Krishnan',
    role: 'Tech Lead, Oracle Corp (Bangalore)',
    rating: 5,
    comment: 'Invested in Lepakshi Resort & Farms with Rajan sir two years ago. The development work is flawless—wide roads, clear boundary stones, and our Sandalwood saplings are thriving. Their installment program is incredibly transparent.',
    date: 'March 14, 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't2',
    name: 'Suresh Kumar Hegde',
    role: 'Retired Bank Manager, SBI',
    rating: 5,
    comment: 'Purchasing clear title plots near Devanahalli was my highest retirement objective. Property World team was incredibly supportive. BIAAPA approval papers were verified seamlessly, and registration went through on schedule without any middlemen fees.',
    date: 'May 02, 2026',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't3',
    name: 'Meenakshi Iyer',
    role: 'Director of Academics, Bangalore North',
    rating: 5,
    comment: 'The Horamavu Main Road 2BHK flat is perfect for our family. Extremely quiet building despite being on the main road, and just 2km away from Banaswadi court block. Solid teak doors, elevator support, and constant water—superb construction quality!',
    date: 'June 10, 2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
  }
];

export const BUILDER_BIO = {
  name: 'Rajan. M',
  role: 'Director & Chief Builder',
  company: 'Property World Builders & Developers',
  slogan: 'A Name You Can Trust',
  office: 'FF4, 2nd Floor, Eternia Apartment, Shantivana, Sahakar Nagar, Bangalore - 560092',
  officeMapUrl: 'https://maps.google.com/maps?vet=10CAAQoqAOahcKEwjotomKlYmVAxUAAAAAHQAAAAAQBg..i&rlz=1C1GCGX_enIN1182IN1182&sca_esv=9775b4ed3171e694&pvq=Cg0vZy8xMXpmczdzODZyIlcKUVByb3BlcnR5IHdvcmxkIGJ1aWxkZXJzIGFuZCBkZXZlbG9wZXJzIEZGNCwybmQgZmxvb3IsZXRlcm5pYSBhcGFydG1lbnQsc2hhbnRpdmFuYRACGAM&lqi=ClFQcm9wZXJ0eSB3b3JsZCBidWlsZGVycyBhbmQgZGV2ZWxvcGVycyBGRjQsMm5kIGZsb29yLGV0ZXJuaWEgYXBhcnRtZW50LHNoYW50aXZhbmFaUyJRcHJvcGVydHkgd29ybGQgYnVpbGRlcnMgYW5kIGRldmVsb3BlcnMgZmY0IDJuZCBmbG9vciBldGVybmlhIGFwYXJ0bWVudCBzaGFudGl2YW5hkgETcHJvcGVydHlfaW52ZXN0bWVudA&fvr=1&cs=0&um=1&ie=UTF-8&fb=1&gl=in&sa=X&ftid=0x3bae179111e376f1:0xb46031dd5b056f93',
  email: 'mrajan3131@gmail.com',
  website: 'www.propertyworldind.com',
  phones: ['93424 20855', '9731308328'],
  experience: '40+ Years in Land Procurement, Khata Approvals, & Premium Gated Communities across AP & Karnataka.'
};
