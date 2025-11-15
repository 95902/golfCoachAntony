import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Golf Coach Antony
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Réservez vos séances de golf sur simulateur TrackMan 4 ou vos parcours accompagnés
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking/indoor">
              <Button size="lg" className="w-full sm:w-auto">
                Réserver Indoor
              </Button>
            </Link>
            <Link to="/booking/accompanied">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Parcours Accompagné
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Indoor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Réservation Indoor</CardTitle>
              <CardDescription>Simulateur TrackMan 4</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Créneaux d'1 heure à 70€</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Réservez de 1 à 3 créneaux consécutifs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Confirmation immédiate par email</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Simulateur dernière génération</span>
                </li>
              </ul>
              <Link to="/booking/indoor" className="block">
                <Button className="w-full">Réserver maintenant</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Accompanied */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Parcours Accompagné</CardTitle>
              <CardDescription>9 ou 18 trous</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>9 trous : 180€ (4 heures)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>18 trous : 300€ (journée)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Prix divisé entre 1 à 3 joueurs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Accompagnement professionnel</span>
                </li>
              </ul>
              <Link to="/booking/accompanied" className="block">
                <Button className="w-full">Réserver maintenant</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold">Comment ça marche ?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1</div>
                <h3 className="font-semibold mb-2">Choisissez</h3>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez votre date et vos créneaux horaires
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">2</div>
                <h3 className="font-semibold mb-2">Réservez</h3>
                <p className="text-sm text-muted-foreground">
                  Complétez vos informations et confirmez
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">3</div>
                <h3 className="font-semibold mb-2">Jouez</h3>
                <p className="text-sm text-muted-foreground">
                  Recevez votre confirmation et profitez !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Golf Coach Antony. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
