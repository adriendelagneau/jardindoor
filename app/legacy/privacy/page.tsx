import React from "react";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";

export default function PrivacyPage() {
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Politique de Confidentialité" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 mt-16 max-w-4xl">
      <AppBreadcrumb items={breadcrumbItems} />
      
      <div className="prose prose-green max-w-none">
        <h1 className="font-serif text-4xl font-bold text-green-900 mb-8">Politique de Confidentialité</h1>
        
        <p className="text-muted-foreground italic mb-8">Dernière mise à jour : 24 avril 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">1. Collecte des données</h2>
          <p>
            Nous collectons des informations lorsque vous vous inscrivez sur notre site, vous connectez à votre compte, effectuez un achat ou remplissez un formulaire de contact. Les informations collectées incluent votre nom, votre adresse e-mail, votre adresse de livraison et vos coordonnées de paiement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">2. Utilisation des informations</h2>
          <p>
            Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
            <li>Améliorer notre site Web et notre service client</li>
            <li>Traiter vos transactions et assurer la livraison</li>
            <li>Vous contacter par e-mail concernant votre commande</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">3. Confidentialité du commerce en ligne</h2>
          <p>
            Nous sommes les seuls propriétaires des informations collectées sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour n&apos;importe quel raison, sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande et / ou une transaction (ex: livraison).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">4. Protection des informations</h2>
          <p>
            Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne (SSL). Nous protégeons également vos informations hors ligne.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">5. Cookies</h2>
          <p>
            Nos cookies améliorent l&apos;accès à notre site et identifient les visiteurs réguliers. Cependant, cette utilisation des cookies n&apos;est en aucune façon liée à des informations personnelles identifiables sur notre site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">6. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de portabilité et de suppression de vos données. Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse suivante : <strong>contact@jardin-indoor.fr</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-4">7. Consentement</h2>
          <p>
            En utilisant notre site, vous consentez à notre politique de confidentialité.
          </p>
        </section>
      </div>
    </div>
  );
}
