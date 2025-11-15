import env from '#start/env'
import Booking from '#models/booking'
import axios from 'axios'

interface N8nWebhookPayload {
  event: 'booking.created' | 'booking.updated' | 'booking.cancelled'
  booking: any
  customer: any
  metadata?: Record<string, any>
}

export default class N8nService {
  /**
   * Base URL for N8N webhooks
   */
  private static get webhookUrl(): string | undefined {
    return env.get('N8N_WEBHOOK_URL')
  }

  /**
   * Trigger N8N webhook when a booking is created
   * This will trigger email confirmation, Google Calendar event, etc.
   */
  static async triggerBookingCreated(booking: Booking) {
    if (!this.webhookUrl) {
      console.warn('N8N_WEBHOOK_URL not configured, skipping webhook')
      return
    }

    try {
      await booking.load('customer')

      if (booking.type === 'INDOOR') {
        await booking.load('timeSlots')
      } else {
        await booking.load('course')
      }

      const payload: N8nWebhookPayload = {
        event: 'booking.created',
        booking: booking.toJSON(),
        customer: booking.customer.toJSON(),
        metadata: {
          timestamp: new Date().toISOString(),
          bookingType: booking.type,
        },
      }

      await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 seconds timeout
      })

      console.log(`N8N webhook triggered for booking ${booking.id}`)
    } catch (error) {
      console.error('Failed to trigger N8N webhook for booking creation:', error)
      // Don't throw error - booking is already created
      // We don't want to rollback the transaction if webhook fails
    }
  }

  /**
   * Trigger N8N webhook when a booking is updated
   */
  static async triggerBookingUpdated(booking: Booking) {
    if (!this.webhookUrl) {
      console.warn('N8N_WEBHOOK_URL not configured, skipping webhook')
      return
    }

    try {
      await booking.load('customer')

      if (booking.type === 'INDOOR') {
        await booking.load('timeSlots')
      } else {
        await booking.load('course')
      }

      const payload: N8nWebhookPayload = {
        event: 'booking.updated',
        booking: booking.toJSON(),
        customer: booking.customer.toJSON(),
        metadata: {
          timestamp: new Date().toISOString(),
        },
      }

      await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      })

      console.log(`N8N webhook triggered for booking update ${booking.id}`)
    } catch (error) {
      console.error('Failed to trigger N8N webhook for booking update:', error)
    }
  }

  /**
   * Trigger N8N webhook when a booking is cancelled
   */
  static async triggerBookingCancelled(booking: Booking) {
    if (!this.webhookUrl) {
      console.warn('N8N_WEBHOOK_URL not configured, skipping webhook')
      return
    }

    try {
      await booking.load('customer')

      const payload: N8nWebhookPayload = {
        event: 'booking.cancelled',
        booking: booking.toJSON(),
        customer: booking.customer.toJSON(),
        metadata: {
          timestamp: new Date().toISOString(),
          cancellationReason: booking.cancellationReason,
        },
      }

      await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      })

      console.log(`N8N webhook triggered for booking cancellation ${booking.id}`)
    } catch (error) {
      console.error('Failed to trigger N8N webhook for booking cancellation:', error)
    }
  }

  /**
   * Test N8N webhook connection
   */
  static async testWebhook(): Promise<boolean> {
    if (!this.webhookUrl) {
      throw new Error('N8N_WEBHOOK_URL is not configured')
    }

    try {
      const response = await axios.post(
        this.webhookUrl,
        {
          event: 'test',
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      )

      return response.status === 200
    } catch (error) {
      console.error('N8N webhook test failed:', error)
      return false
    }
  }
}
