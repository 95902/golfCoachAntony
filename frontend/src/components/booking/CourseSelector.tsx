import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getCourses } from '@/services/courses'
import type { Course } from '@/types'

interface CourseSelectorProps {
  selectedCourse: Course | null
  onSelectCourse: (course: Course) => void
}

export function CourseSelector({ selectedCourse, onSelectCourse }: CourseSelectorProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getCourses()
      setCourses(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la récupération des parcours')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = parseInt(e.target.value)
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      onSelectCourse(course)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Choix du parcours</CardTitle>
        <CardDescription>Sélectionnez le parcours de golf</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course">
            Parcours <span className="text-destructive">*</span>
          </Label>
          <Select
            id="course"
            value={selectedCourse?.id?.toString() || ''}
            onChange={handleChange}
          >
            <option value="">-- Sélectionnez un parcours --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} - {course.location}
              </option>
            ))}
          </Select>
        </div>

        {selectedCourse && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-1">{selectedCourse.name}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              📍 {selectedCourse.location}
            </p>
            {selectedCourse.description && (
              <p className="text-sm">{selectedCourse.description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
