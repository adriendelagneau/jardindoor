import Image from "next/image"
import Link from "next/link"
import prisma from "@/lib/prisma/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Image as ImageIcon } from "lucide-react"

export default async function ImagesPage() {
  const images = await prisma.image.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="py-8 lg:py-12 mx-2 space-y-12 pb-24">
      {/* Hero Section */}
      <Card className="relative h-[480px] w-full overflow-hidden rounded-3xl shadow-lg border-none bg-primary">
        <Image 
          src="/home-img.png" 
          alt="Images banner" 
          fill 
          sizes="100vw"
          className="object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/40 to-transparent flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold font-serif uppercase tracking-widest">
              Médiathèque
            </h1>
          </div>
          <p className="max-w-lg text-lg opacity-90">
            Gérez vos ressources visuelles, optimisez vos images et organisez votre catalogue média.
          </p>
        </div>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center -mt-16 relative z-10">
        <Button asChild size="lg" className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform bg-primary text-primary-foreground">
          <Link href="/admin/images/create">
            <Plus className="mr-3 h-8 w-8" />
            Créer une image
          </Link>
        </Button>
      </div>

      {/* Images List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-4">
        {images.map((image) => (
          <Link key={image.id} href={`/admin/images/${image.id}`} className="group">
            <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full bg-card">
              <div className="aspect-4/3 relative overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.altText || ""}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                  {image.altText}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {image.shortDescription}
                </p>
                <div className="mt-4 flex items-center text-xs font-medium text-primary">
                  Modifier les détails
                  <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {images.length === 0 && (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Image src="/file.svg" alt="Empty" width={32} height={32} className="opacity-20" />
          </div>
          <h3 className="text-xl font-semibold">Aucune image trouvée</h3>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
            Votre bibliothèque d&apos;images est vide. Commencez par ajouter votre première image.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/admin/images/create">Ajouter une image</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
