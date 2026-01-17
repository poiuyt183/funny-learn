import { HeroSection } from "@/components/landing/hero-section";
import { FeatureHighlights } from "@/components/landing/feature-highlights";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-white">
			<LandingHeader />
			<main>
				<HeroSection />
				<FeatureHighlights />
			</main>
			<LandingFooter />
		</div>
	);
}
