import SingleMap from "@/components/map/SingleMap";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShoppingBag,
  Sprout,
  Tag,
  Mail,
  Phone,
  MapPin,
  Leaf,
} from "lucide-react";
import { getProducts } from "../../actions/products";
import { ProductSection } from "@/components/carousel/main-carousel/ProductSection";

export default async function Home() {
  const { products } = await getProducts({
    pageSize: 12,
    type: "PRODUCT",
  });

  const { products: seeds } = await getProducts({
    pageSize: 12,
    type: "SEED",
  });

  return (
    <div className="py-8 lg:py-12 mx-2 space-y-12 mt-12">
      {/* --- PART 1: BOUTIQUE --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4">
        {/* Main Hero - Large span */}
        <Card className="md:col-span-3 md:row-span-3 relative min-h-[400px] overflow-hidden group">
          <Image
            src="/home-img.png"
            alt="Hero image"
            fill
            sizes="(max-width: 768px) 100vw, 75vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              Cultivez votre jardin intérieur
            </h1>
            <p className="max-w-md text-lg text-gray-200 mb-6">
              Tout le matériel nécessaire pour vos plantes, des graines aux
              systèmes hydroponiques.
            </p>
            <Button size="lg" className="w-fit gap-2">
              Voir la boutique <ArrowRight size={18} />
            </Button>
          </div>
        </Card>

        {/* Categories - Boutique */}
        <Card className="md:col-span-1 md:row-span-2 hover:bg-accent transition-colors cursor-pointer group flex flex-col justify-center">
          <CardHeader>
            <ShoppingBag
              className="text-primary mb-2 group-hover:scale-110 transition-transform"
              size={48}
            />
            <CardTitle className="text-3xl">Boutique</CardTitle>
            <CardDescription className="text-base">
              Lampes, tentes, extracteurs et tout le nécessaire pour
              l&apos;hydroponie.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Promo / Discount Block */}
        <Card className="md:col-span-1 md:row-span-1 bg-primary text-primary-foreground flex flex-col justify-center items-center text-center p-6 border-none text-xl">
          <Tag size={32} className="mb-2 opacity-80" />
          <CardTitle className="text-xl mb-1">PROMOS</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-xs">
           <span className="font-semibold text-lg">-10%, -20%, -30%</span>
          </CardDescription>
        </Card>
      </div>

      {/* Carousel - Products */}
      <ProductSection title="Promos" products={products} href="/boutique" />

      {/* --- PART 2: SEEDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4">
        {/* Categories - Graines (Main Seed) */}
        <Card className="md:col-span-2 md:row-span-2 hover:bg-accent transition-colors cursor-pointer group flex flex-col justify-center p-8 bg-secondary/30 relative overflow-hidden">
          <Sprout
            className="text-primary/20 absolute -right-8 -bottom-8 group-hover:scale-110 transition-transform"
            size={240}
          />
          <div className="relative z-10">
            <Sprout className="text-primary mb-4" size={48} />
            <CardTitle className="text-4xl mb-4">Graines Premium</CardTitle>
            <CardDescription className="text-lg max-w-sm">
              Une sélection rigoureuse des meilleures varieties pour une
              croissance optimale et des recoltes genereuses.
            </CardDescription>
            <Button variant="outline" className="mt-6 gap-2">
              Découvrir la collection <ArrowRight size={16} />
            </Button>
          </div>
        </Card>

        {/* Seed Info/Quote */}
        <Card className="md:col-span-2 md:row-span-1 bg-accent/10 border-dashed flex items-center justify-center p-6 text-center italic text-muted-foreground">
          <p className="text-xl">
            &quot;Chaque graine est une promesse de vie et de beaute pour votre
            espace.&quot;
          </p>
        </Card>

        {/* Seed Producer 1 */}
        <Card className="md:col-span-1 md:row-span-1 bg-secondary/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-secondary/20 transition-colors cursor-pointer">
          <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Leaf className="text-primary" size={24} />
          </div>
          <CardTitle className="text-sm uppercase tracking-widest font-bold">
          Barneys Farm
          </CardTitle>
          <CardDescription className="text-[10px]">
            Partenaire Premium
          </CardDescription>
        </Card>

        {/* Seed Producer 2 */}
        <Card className="md:col-span-1 md:row-span-1 bg-secondary/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-secondary/20 transition-colors cursor-pointer">
          <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Leaf className="text-primary" size={24} />
          </div>
          <CardTitle className="text-sm uppercase tracking-widest font-bold">
            Green House Seeds
          </CardTitle>
          <CardDescription className="text-[10px]">Graines Bio</CardDescription>
        </Card>
      </div>

         {/* Carousel - Products */}
      <ProductSection title="Graines" products={seeds} href="/boutique" />

      {/* --- PART 3: CONTACT --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4">
        {/* Map Section */}
        <Card className="md:col-span-2 md:row-span-2 overflow-hidden border-none shadow-none bg-transparent">
          <CardContent className="p-0 h-full">
            <SingleMap />
          </CardContent>
        </Card>

        {/* Address & Quick Help */}
        <Card className="md:col-span-2 md:row-span-1 flex items-center justify-center p-6 bg-accent/20 text-xl">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="text-primary" size={24} />
            </div>
            <div>
              <CardTitle className="text-lg">Notre Adresse</CardTitle>
              <CardDescription>
                36 Avenue Gontran Bienvenu, 56000 Vannes
              </CardDescription>
            </div>
          </div>
        </Card>

        {/* Contact Info (Email & Phone) */}
        <Card className="md:col-span-2 md:row-span-1 grid grid-cols-2 gap-4 bg-muted/30 p-4 text-2xl">
          <div className="flex flex-col justify-center items-center text-center p-2 rounded-lg bg-card border border-border/50">
            <Mail className="text-primary mb-2" size={24} />
            <p className="text-sm font-medium">contact@jardin.fr</p>
          </div>
          <div className="flex flex-col justify-center items-center text-center p-2 rounded-lg bg-card border border-border/50">
            <Phone className="text-primary mb-2" size={24} />
            <p className="text-sm font-medium">02 97 00 00 00</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
