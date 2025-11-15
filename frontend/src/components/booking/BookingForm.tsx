import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

const bookingFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(255, 'Le prénom est trop long'),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(255, 'Le nom est trop long'),
  email: z.string().email('Email invalide'),
  phone: z
    .string()
    .min(10, 'Numéro de téléphone invalide')
    .regex(/^[0-9+\s()-]+$/, 'Le téléphone ne doit contenir que des chiffres'),
  specialRequests: z.string().optional(),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void
  isLoading?: boolean
  error?: string | null
}

export function BookingForm({ onSubmit, isLoading = false, error }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vos informations</CardTitle>
        <CardDescription>
          Complétez le formulaire pour finaliser votre réservation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">
              Prénom <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="Jean"
              {...register('firstName')}
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName">
              Nom <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="Dupont"
              {...register('lastName')}
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jean.dupont@example.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Vous recevrez la confirmation à cette adresse
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Téléphone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="06 12 34 56 78"
              {...register('phone')}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Demandes spéciales (optionnel)</Label>
            <textarea
              id="specialRequests"
              placeholder="Exemple : Première fois sur simulateur, niveau débutant..."
              {...register('specialRequests')}
              disabled={isLoading}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.specialRequests && (
              <p className="text-sm text-destructive">{errors.specialRequests.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Envoi en cours...
              </>
            ) : (
              'Continuer vers le récapitulatif'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            En continuant, vous acceptez nos conditions générales de vente
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
