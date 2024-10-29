import SocialMediaTitleGenerator from "@/components/SocialMediaTitleGenerator";

export default function Home() {
  return (
    <div className="container mx-auto pl-16 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        TMX Social Media Content Generator
      </h1>
      <SocialMediaTitleGenerator />
    </div>
  );
}
