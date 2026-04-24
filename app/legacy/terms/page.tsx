import React from "react";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";

export default function TermsPage() {
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Conditions Générales" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 mt-16 max-w-4xl">
      <AppBreadcrumb items={breadcrumbItems} />
      
      <div className="prose prose-green max-w-none">
        <h1 className="font-serif text-4xl font-bold text-green-900 mb-8">Conditions Générales d&apos;Utilisation</h1>
        
        <p className="text-muted-foreground italic mb-8">Dernière mise à jour : 24 avril 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">1. Présentation du site</h2>
          <p>
            Le site <strong>JARDIN INDOOR</strong> est une plateforme de commerce électronique spécialisée dans la vente de matériel de culture en intérieur, graines et accessoires de jardinage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">2. Conditions d&apos;accès et d&apos;utilisation</h2>
          <p>
            L&apos;accès au site et son utilisation sont réservés aux personnes majeures. L&apos;utilisateur s&apos;engage à utiliser le site conformément à sa destination et à ne pas tenter de porter atteinte à son bon fonctionnement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">3. Produits et Commandes</h2>
          <p>
            Les produits proposés sont décrits avec la plus grande exactitude possible. Les photographies ne sont pas contractuelles. La commande est ferme dès la validation du paiement par l&apos;utilisateur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">4. Prix et Paiement</h2>
          <p>
            Les prix sont indiqués en Euros TTC. Le site se réserve le droit de modifier ses prix à tout moment. Le paiement est exigible immédiatement à la commande.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">5. Livraison et Retour</h2>
          <p>
            Les délais de livraison sont indicatifs. Conformément à la loi, l&apos;utilisateur dispose d&apos;un délai de rétractation de 14 jours à compter de la réception de sa commande pour retourner les produits, à condition qu&apos;ils soient dans leur état et emballage d&apos;origine.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">6. Responsabilité</h2>
          <p>
            La responsabilité de JARDIN INDOOR ne saurait être engagée pour tous les inconvénients ou dommages inhérents à l&apos;utilisation du réseau Internet, notamment une rupture de service ou une intrusion extérieure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">7. Propriété Intellectuelle</h2>
          <p>
            Tous les éléments du site (textes, logos, images, code source) sont protégés par le droit d&apos;auteur et la propriété intellectuelle. Toute reproduction est strictement interdite sans accord préalable.
          </p>
        </section>
      </div>
    </div>
  );
}
