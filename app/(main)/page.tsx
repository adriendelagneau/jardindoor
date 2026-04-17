import SingleMap from "@/components/map/SingleMap";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Sprout, Tag } from "lucide-react";

export default function Home() {
  return (
    <div className="py-8 lg:py-12 mx-2">
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-6 gap-4 min-h-[1200px] md:h-[1400px] mt-12">
        
        {/* Main Hero - Large span */}
        <Card className="md:col-span-3 md:row-span-3 relative min-h-[400px] md:min-h-0 overflow-hidden group">
          <Image 
            src="/home-img.png" 
            alt="Hero image" 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cultivez votre jardin intérieur</h1>
            <p className="max-w-md text-lg text-gray-200 mb-6">Tout le matériel nécessaire pour vos plantes, des graines aux systèmes hydroponiques.</p>
            <Button size="lg" className="w-fit gap-2">
              Voir la boutique <ArrowRight size={18} />
            </Button>
          </div>
        </Card>

        {/* Promo / Discount Block */}
        <Card className="md:col-span-1 md:row-span-2 bg-primary text-primary-foreground flex flex-col justify-center items-center text-center p-6 border-none">
          <Tag size={48} className="mb-4 opacity-80" />
          <CardTitle className="text-2xl mb-2">PROMOS -20%</CardTitle>
          <CardDescription className="text-primary-foreground/80 mb-6">Sur tous les engrais ce weekend avec le code <span className="font-bold">JARDIN20</span></CardDescription>
          <Button variant="secondary" className="w-full">Profiter de l'offre</Button>
        </Card>

        {/* Categories - Boutique */}
        <Card className="md:col-span-1 md:row-span-2 hover:bg-accent transition-colors cursor-pointer group">
          <CardHeader>
            <ShoppingBag className="text-primary mb-2 group-hover:scale-110 transition-transform" size={32} />
            <CardTitle>Boutique</CardTitle>
            <CardDescription>Lampes, tentes, extracteurs et plus.</CardDescription>
          </CardHeader>
        </Card>

        {/* Categories - Graines */}
        <Card className="md:col-span-1 md:row-span-1 hover:bg-accent transition-colors cursor-pointer group flex flex-row items-center p-4">
           <Sprout className="text-primary mr-4 group-hover:rotate-12 transition-transform" size={24} />
           <div>
             <CardTitle className="text-sm">Graines</CardTitle>
             <CardDescription className="text-xs">Sélection Premium</CardDescription>
           </div>
        </Card>

        {/* Map Section - Medium span */}
        <Card className="md:col-span-2 md:row-span-3 overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle>Où nous trouver ?</CardTitle>
            <CardDescription>36 Avenue Gontran Bienvenu, 56000 Vannes</CardDescription>
          </CardHeader>
          <CardContent className="h-full pt-4">
             <SingleMap />
          </CardContent>
        </Card>

        {/* Quick Contact / Info */}
        <Card className="md:col-span-1 md:row-span-2 flex flex-col justify-between p-6 bg-muted/50">
          <div>
            <CardTitle className="mb-2">Besoin d'aide ?</CardTitle>
            <CardDescription>Nos experts vous conseillent pour votre installation.</CardDescription>
          </div>
          <Button variant="outline" className="mt-4">Nous contacter</Button>
        </Card>

        {/* Small Visual Block */}
        <Card className="md:col-span-1 md:row-span-1 bg-accent/20 border-dashed flex items-center justify-center italic text-muted-foreground p-4 text-center">
           "La nature à portée de main, même en ville."
        </Card>

      </div>
    </div>
  );
}
