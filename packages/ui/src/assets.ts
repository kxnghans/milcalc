/**
 * @file assets.ts
 * @description This file centralizes the URLs for all static assets, such as mascot images.
 * Using a single source of truth for asset URLs makes maintenance easier.
 */

const BASE_URL = 'https://lixmvlfmwxkfbvnnhxzh.supabase.co/storage/v1/object/public/milcalc_public/mascot';

export const MASCOT_URLS = {
  ALTITUDE: `${BASE_URL}/3d_altitude.png`,
  ALTITUDE1: `${BASE_URL}/3d_altitude1.png`,
  CRUNCH: `${BASE_URL}/3d_crunch.png`,
  DOCUMENTS: `${BASE_URL}/3d_documents.png`,
  PAY: `${BASE_URL}/3d_pay.png`,
  PAY1: `${BASE_URL}/3d_pay1.png`,
  PLANK: `${BASE_URL}/3d_plank.png`,
  PUSHUP: `${BASE_URL}/3d_pushup.png`,
  RETIREMENT: `${BASE_URL}/3d_retirement.png`,
  RUN: `${BASE_URL}/3d_run.png`,
  SPLASH: `${BASE_URL}/3d_splash.png`,
  WALK: `${BASE_URL}/3d_walk.png`,
};
