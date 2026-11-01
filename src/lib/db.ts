import raw from '@/data/db.json';
import { getFeaturedDishes, getMenuSections } from '@/lib/menu-data';
import type { FeaturedDish, MenuSectionData } from '@/lib/menu-types';

/**
 * Where the public pages get their content, read ONLY through the getters below:
 * - static copy (headings, labels, hero, story, contact, SEO text) comes from src/data/db.json;
 * - the menu and the signature dishes come from MongoDB (src/lib/menu-data.ts), so what the admin
 *   saves shows up on the site straight away.
 * Getters are async because part of the content is a database read.
 */

export type { MenuItemData } from '@/lib/menu-types';

export interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Link {
  label: string;
  href: string;
}

export interface Site {
  name: string;
  tagline: string;
  phone: { display: string; href: string };
  email: string;
  address: { short: string; full: string };
  hours: { days: string; time: string }[];
  footerInfo: string[];
  social: { id: 'instagram' | 'facebook'; label: string; href: string }[];
}

export interface Nav {
  links: Link[];
  cta: Link;
}

export interface PageMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

export interface Offer {
  title: string;
  text: string;
  tag: string;
}

export type Dish = FeaturedDish;

export interface Review {
  name: string;
  text: string;
}

export interface TrustBadgeData {
  icon: 'award' | 'star' | 'newspaper';
  label: string;
}

export interface Home {
  hero: {
    image: ImageData;
    eyebrow: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    primaryCtaLabel: string;
    secondaryCta: Link;
  };
  offers: { eyebrow: string; title: string; items: Offer[] };
  dishes: {
    eyebrow: string;
    title: string;
    items: Dish[];
    link: Link;
  };
  story: { image: ImageData; eyebrow: string; title: string; text: string; link: Link };
  gallery: { eyebrow: string; title: string; images: ImageData[]; alt: string };
  reviews: { eyebrow: string; title: string; items: Review[]; badges: TrustBadgeData[] };
  visit: { eyebrow: string; title: string };
}

export interface Menu {
  header: { eyebrow: string; title: string };
  cta: string;
  /** Shown when the database has no available dishes yet. */
  empty: string;
  sections: MenuSectionData[];
}

export interface About {
  header: { eyebrow: string; title: string };
  image: ImageData;
  paragraphs: string[];
}

export interface Contact {
  header: { eyebrow: string; title: string };
  callLabel: string;
  directionsLabel: string;
  directionsHref: string;
  mapTitle: string;
  mapSrc: string;
}

export interface NotFound {
  eyebrow: string;
  heading: string;
  text: string;
  homeLabel: string;
  callLabel: string;
}

export type PageKey = keyof typeof raw.pages;

/** Replace an image key stored in the JSON ("hero") with the full image record. */
const img = (key: string): ImageData => {
  const found = (raw.images as Record<string, ImageData>)[key];
  if (!found) throw new Error(`db.json: unknown image key "${key}"`);
  return found;
};

export async function getSite(): Promise<Site> {
  return raw.site as Site;
}

export async function getNav(): Promise<Nav> {
  return raw.nav;
}

export async function getPageMeta(page: PageKey): Promise<PageMeta> {
  return raw.pages[page];
}

export async function getHome(): Promise<Home> {
  const { hero, dishes, story, gallery, offers, reviews, visit } = raw.home;
  return {
    hero: { ...hero, image: img(hero.image) },
    offers,
    dishes: { ...dishes, items: await getFeaturedDishes() },
    story: { ...story, image: img(story.image) },
    gallery: { ...gallery, images: gallery.images.map(img) },
    reviews: reviews as Home['reviews'],
    visit,
  };
}

export async function getMenu(): Promise<Menu> {
  return { ...raw.menu, sections: await getMenuSections() };
}

export async function getAbout(): Promise<About> {
  return { ...raw.about, image: img(raw.about.image) };
}

export async function getContact(): Promise<Contact> {
  return raw.contact;
}

export async function getNotFound(): Promise<NotFound> {
  return raw.notFound;
}
