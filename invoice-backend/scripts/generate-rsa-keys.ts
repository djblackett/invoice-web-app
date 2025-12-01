#!/usr/bin/env tsx

import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Generates a 4096-bit RSA key pair for JWT signing
 *
 * Usage:
 *   yarn tsx scripts/generate-rsa-keys.ts
 *
 * This will generate:
 *   - Private key (jwt-private.pem)
 *   - Public key (jwt-public.pem)
 *   - Base64-encoded versions for environment variables
 */
function generateRSAKeys() {
  console.log('Generating 4096-bit RSA key pair...');

  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  // Save keys to files
  const keysDir = join(__dirname, '../keys');
  try {
    writeFileSync(join(keysDir, 'jwt-private.pem'), privateKey);
    writeFileSync(join(keysDir, 'jwt-public.pem'), publicKey);
    console.log('\n✓ Keys saved to keys/ directory');
  } catch (error) {
    console.log('\n⚠ Could not save to keys/ directory (directory might not exist)');
    console.log('  You can manually create the directory: mkdir keys');
  }

  // Convert to base64 for environment variables
  const privateKeyBase64 = Buffer.from(privateKey).toString('base64');
  const publicKeyBase64 = Buffer.from(publicKey).toString('base64');

  console.log('\n='.repeat(80));
  console.log('Add these to your .env file:');
  console.log('='.repeat(80));
  console.log();
  console.log(`JWT_PRIVATE_KEY="${privateKeyBase64}"`);
  console.log();
  console.log(`JWT_PUBLIC_KEY="${publicKeyBase64}"`);
  console.log();
  console.log('='.repeat(80));
  console.log();
  console.log('⚠ IMPORTANT SECURITY NOTES:');
  console.log('  1. NEVER commit the private key to version control');
  console.log('  2. Add keys/ directory to .gitignore');
  console.log('  3. Store the private key in a secure secret manager in production');
  console.log('  4. The public key can be safely shared (used for token verification)');
  console.log();
  console.log('✓ Key generation complete!');
}

generateRSAKeys();
