/**
 * Aurelia Dental Studio — Architecture & Content Verification Self-Check
 * Small, zero-dependency, assert-based test script (Ponytail rule compliant)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Running Aurelia Dental Studio self-check suite...');

// 1. Files existence check
const requiredFiles = [
  'package.json',
  'server.js',
  'index.html',
  'treatments.html',
  'doctor.html',
  'contact.html',
  'css/styles.css',
  'js/app.js'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  assert(fs.existsSync(filePath), `Missing critical file: ${file}`);
  const stats = fs.statSync(filePath);
  assert(stats.size > 200, `File ${file} appears suspiciously empty (${stats.size} bytes)`);
});
console.log('✓ All 6 core structural files exist and have substantial content');

// 2. Brand & Core Copy Check in index.html
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

assert(indexHtml.includes('AURELIA'), 'Missing brand name AURELIA');
assert(indexHtml.toLowerCase().includes('dental studio'), 'Missing brand qualifier DENTAL STUDIO');
assert(indexHtml.includes('Modern Dentistry. Thoughtfully Personal.'), 'Missing brand tagline');
assert(indexHtml.includes('Navi Mumbai'), 'Missing practice location Navi Mumbai');
assert(indexHtml.includes('Book an Appointment'), 'Missing primary CTA');
assert(indexHtml.includes('Explore Treatments'), 'Missing secondary CTA');
assert(indexHtml.includes('Demo Website'), 'Missing mandatory demo qualification notice');
console.log('✓ Brand identity, tagline, location, CTAs, and demo disclaimer verified');

// 3. Featured Services Check (all 6 required services)
const requiredServices = [
  'General Dentistry',
  'Cosmetic Dentistry',
  'Orthodontics',
  'Dental Implants',
  'Root Canal Care',
  'Pediatric Dentistry'
];

requiredServices.forEach(srv => {
  assert(indexHtml.includes(srv), `Missing featured service: ${srv}`);
});
console.log('✓ All 6 required core dental services present in homepage');

// 4. Specialist Team Check
const requiredDoctors = [
  'Dr. Aanya Mehta',
  'Dr. Rohan Shah',
  'Dr. Mira Kapoor',
  'Dr. Arjun Rao'
];

requiredDoctors.forEach(doc => {
  assert(indexHtml.includes(doc), `Missing specialist doctor: ${doc}`);
});
console.log('✓ All 4 demo specialist clinicians configured');

// 5. Booking Form Elements Check
const requiredFormFields = [
  'id="apt-name"',
  'id="apt-phone"',
  'id="apt-email"',
  'id="apt-date"',
  'id="apt-time"',
  'id="apt-treatment"',
  'id="apt-doctor"',
  'id="apt-message"',
  'id="booking-success-pane"'
];

requiredFormFields.forEach(field => {
  assert(indexHtml.includes(field), `Missing booking form element: ${field}`);
});
console.log('✓ Appointment conversion form and confirmation pane validated');

// 6. FAQ Check (7 questions)
const requiredFaqs = [
  'How should I prepare for my first visit?',
  'How often should I schedule a dental checkup?',
  'Do you offer clear aligners?',
  'What happens during a consultation?',
  'How long does a typical appointment take?',
  'Do you treat children?',
  'How do I request an appointment?'
];

requiredFaqs.forEach(faq => {
  assert(indexHtml.includes(faq), `Missing FAQ question: ${faq}`);
});
console.log('✓ All 7 required FAQ entries present');

// 7. Treatments Directory Comprehensive Categories Check
const treatmentsHtml = fs.readFileSync(path.join(__dirname, 'treatments.html'), 'utf8');
const treatmentCategories = [
  'General Dentistry',
  'Cosmetic Dentistry',
  'Orthodontics',
  'Restorative Dentistry',
  'Advanced Care',
  'Pediatric Dentistry'
];

treatmentCategories.forEach(cat => {
  assert(treatmentsHtml.includes(cat), `Missing treatment directory category: ${cat}`);
});
console.log('✓ Treatments directory categorisation verified');

// 8. Doctor Profile Page Check
const doctorHtml = fs.readFileSync(path.join(__dirname, 'doctor.html'), 'utf8');
assert(doctorHtml.includes('Dr. Aanya Mehta'), 'Doctor page missing Dr. Aanya Mehta');
assert(doctorHtml.includes('Conservative Dentistry &amp; Endodontics') || doctorHtml.includes('Conservative Dentistry & Endodontics'), 'Doctor page missing credentials');
console.log('✓ Dedicated Doctor profile page validated');

console.log('\n========================================');
console.log('ALL ARCHITECTURAL SELF-CHECKS PASSED! ✓');
console.log('========================================\n');
