import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly SALT = 'school_erp_2025_secure_salt'; // School-specific salt

  constructor() {}

  /**
   * Hash password using SHA-256 with salt
   * This ensures passwords are not visible in network tab
   */
  hashPassword(password: string): string {
    const saltedPassword = password + this.SALT;
    return CryptoJS.SHA256(saltedPassword).toString(CryptoJS.enc.Hex);
  }

  /**
   * Generate a secure hash for any string
   */
  generateHash(input: string): string {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
  }

  /**
   * Verify if a password matches a hash (for client-side verification if needed)
   */
  verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }
}