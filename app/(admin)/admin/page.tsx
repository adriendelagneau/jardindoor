import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Tag, 
  Image as ImageIcon, 
  Layers, 
  ArrowRight, 
  Plus, 

} from "lucide-react";

export default function AdminPage() {
  return (
    <div className="py-8 lg:py-12 mx-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Tableau de bord</h1>
          <p className="text-muted-foreground">Gérez votre boutique et vos contenus.</p>
        </div>
        <Link href="/admin/products/create">
          <Button className="gap-2">
            <Plus size={18} /> Nouveau Produit
          </Button>
        </Link>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-5 gap-4 min-h-[1000px] md:h-[1200px]">
        
        {/* 1. Hero Landscape - Admin Banner */}
        <Card className="md:col-span-4 md:row-span-2 relative overflow-hidden group border-none bg-primary">
          <Image 
            src="/home-img.png" 
            alt="Admin banner" 
            fill 
            sizes="100vw"
            className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/40 to-transparent flex flex-col justify-center p-12 text-primary-foreground">
            <h2 className="text-4xl font-bold mb-4 font-serif">Console d&apos;Administration</h2>
            <p className="max-w-lg text-lg opacity-90 mb-8">
              Bienvenue dans votre espace de gestion. Suivez vos stocks, organisez vos catégories et mettez à jour votre catalogue en quelques clics.
            </p>
          
          </div>
        </Card>

        {/* 2. Products Management */}
        <Link href="/admin/products" className="md:col-span-2 md:row-span-2 group/card">
          <Card className="h-full hover:shadow-lg transition-all border-primary/10 flex flex-col">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-fit p-3 rounded-xl mb-4 text-primary group-hover/card:scale-110 transition-transform">
                <Package size={32} />
              </div>
              <CardTitle className="text-3xl">Produits</CardTitle>
              <CardDescription className="text-base">
                Inventaire complet, gestion des stocks et prix.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Total Produits</span>
                  <span className="text-xl font-bold">124</span>
                </div>
                <Button className="w-full gap-2 group">
                  Gérer le catalogue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 3. Brands */}
        <Link href="/admin/brand" className="md:col-span-1 md:row-span-1">
          <Card className="h-full hover:bg-accent/5 transition-colors cursor-pointer group flex flex-col justify-center">
            <CardHeader className="p-6">
              <Tag className="text-primary mb-2 group-hover:scale-110 transition-transform" size={28} />
              <CardTitle className="text-xl">Marques</CardTitle>
              <CardDescription className="text-xs">Gestion des partenaires</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* 4. Images */}
        <Link href="/admin/images" className="md:col-span-1 md:row-span-1">
          <Card className="h-full hover:bg-accent/5 transition-colors cursor-pointer group flex flex-col justify-center">
            <CardHeader className="p-6">
              <ImageIcon className="text-primary mb-2 group-hover:scale-110 transition-transform" size={28} />
              <CardTitle className="text-xl">Médiathèque</CardTitle>
              <CardDescription className="text-xs">Images & assets</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* 5. Categories & Subcategories */}
        <Link href="/admin/categories" className="md:col-span-2 md:row-span-1">
          <Card className="h-full bg-secondary/10 border-dashed border-primary/20 hover:border-primary/50 transition-colors cursor-pointer group overflow-hidden">
            <CardHeader className="relative z-10">
              <Layers className="text-primary mb-2 group-hover:rotate-12 transition-transform" size={32} />
              <CardTitle className="text-2xl">Catégories</CardTitle>
              <CardDescription className="text-sm">
                Structure de la boutique & sous-catégories.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-col gap-2 mt-4">
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Systèmes Hydro</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  <span>Éclairage LED</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary/30" />
                  <span>Engrais Bio</span>
               </div>
            </CardContent>
            <Layers className="absolute -right-8 -bottom-8 text-primary/5 group-hover:scale-110 transition-transform" size={200} />
          </Card>
        </Link>

      </div>
    </div>
  );
}
