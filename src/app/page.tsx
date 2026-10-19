import { SectionTitle } from '@/components/molecules';
import {
  DishesSection,
  GallerySection,
  Hero,
  OffersSection,
  ReviewsSection,
  StorySection,
  VisitUs,
} from '@/components/organisms';
import { getContact, getHome, getSite } from '@/lib/db';
import { pageMetadata } from '@/lib/metadata';

export const generateMetadata = () => pageMetadata('home');

export default async function HomePage() {
  const [home, site, contact] = await Promise.all([getHome(), getSite(), getContact()]);

  return (
    <>
      <Hero hero={home.hero} phoneHref={site.phone.href} />
      <OffersSection offers={home.offers} />
      <DishesSection dishes={home.dishes} />
      <StorySection story={home.story} />
      <GallerySection gallery={home.gallery} />
      <ReviewsSection reviews={home.reviews} />
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle eyebrow={home.visit.eyebrow} title={home.visit.title} />
        </div>
        <VisitUs site={site} contact={contact} />
      </section>
    </>
  );
}
